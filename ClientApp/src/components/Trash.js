import React, { useEffect, useState } from 'react';
import NoteComponent from "./NoteComponent";
import EditData from "./EditData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faTrashArrowUp } from '@fortawesome/free-solid-svg-icons';

export const Trash = () => {

    const [displayMode, setDisplayMode] = useState("deleted")
    const [mode, changeMode] = useState(false)
    const [forecasts, setForecasts] = useState([])
    const [loading, setLoadingState] = useState(true)
    const [minWidth, setMinWidth] = useState("30%")
    const [deleteMode, setDeleteMode] = useState("temporary")

    const [buttonsControll, setButtonControll] = useState(0)

    const [popupId, setPopupId] = useState(null)
    const [popupTitle, setPopupTitle] = useState(null)
    const [popupContent, setPopupContent] = useState(null)
    const [popupDate, setPopupDate] = useState(null)
    const [popupToDelete, setPopupDelete] = useState(null)

    const [selectedNotes, setSelectedNotes] = useState([])
    const [selectionMode, setSelectionMode] = useState("default")

    useEffect(() => {
        populateNotesData()
    }, [])

    function isSelected(id) {

        let alreadyInArray = false

        for (let i = 0; i < selectedNotes.length; i++) {
            if (selectedNotes[i] == id) {
                console.log("found id in array")
                alreadyInArray = true

            }
        }

        return alreadyInArray
    }

    function toggleNotesSelection() {
        if (selectionMode == "default") {
            setSelectionMode("select")
        } else {
            setSelectionMode("default")
            setSelectedNotes([])
        }
    }

    async function handleSelectNote(id) {

        let alreadyInArray = false
        let placeInArray = null
        for (let i = 0; i < selectedNotes.length; i++) {
            if (selectedNotes[i] == id) {
                console.log("found id in array")
                alreadyInArray = true
                placeInArray = i
            }
        }

        if (alreadyInArray == true) {
            let tempNotesArray = selectedNotes
            tempNotesArray.splice(placeInArray, 1)
            await setSelectedNotes(tempNotesArray)
        } else {
            await setSelectedNotes([...selectedNotes, id])
        }

        console.log(selectedNotes)

    }

    async function deleteNote(id) {
        console.log("clicked")
        const deletion = await fetch('api/Notes/' + id, { headers: { "Content-Type": "application/json" }, method: "delete" })
        console.log(deletion)
        setLoadingState(true)

        await populateNotesData()
    }

    function storePopupData(id, title, content, date, toDelete) {
        setPopupId(id)
        setPopupTitle(title)
        setPopupContent(content)
        setPopupDate(date)
        setPopupDelete(toDelete)
    }
    function clearPopupData(){
        setPopupId(null)
        setPopupTitle(null)
        setPopupContent(null)
        setPopupDate(null)
        setPopupDelete(null)
    }

    function clearPopupUpdate(){
        setLoadingState(true)
        populateNotesData()
    }

    async function deleteNoteComplex(id, toDeleteCurrent) {
       
            let body = { "id": id, "toDelete": toDeleteCurrent }
            console.log("body", body)
            //fetch here
            const complexDelete = await fetch('api/Notes/delete', { headers: { "Content-Type": "application/json" }, method: "PUT", body: JSON.stringify(body) });
            console.log(complexDelete)

            setLoadingState(true)

            await populateNotesData()

        
    }

    function renderNotesTable() {
        return (
            forecasts.map(note => (<NoteComponent key={note.id} id={note.id} title={note.title} content={note.content} date={note.date} editDate={note.editDate} toDeletion={note.toDelete} deleteMode={deleteMode}
                onClick={() => deleteNote(note.id)} mode={mode} storePopup={storePopupData} onClickComplex={() => deleteNoteComplex(note.id, note.toDeletion)} minWidth={minWidth}
                selectionMode={selectionMode} select={() => handleSelectNote(note.id)} allSelectedNotes={selectedNotes} isSelected={() => isSelected(note.id)} tags={null} />))
        );
    }

    async function populateNotesData() {

  
        const response = await fetch('api/Notes/' + displayMode, { headers: { "Content-Type": "application/json" } });
        console.log(response)
        const data = await response.json();
        console.log(data)

        setLoadingState(false)
        setForecasts(data)

        renderNotesTable()
    }

    let currentPopup = <EditData id={popupId} title={popupTitle} content={popupContent} date={popupDate} toDelete={popupToDelete} deleteThisNote={() => (deleteNoteComplex(popupId, popupToDelete))}
        visibility={popupId !== undefined && popupId !== null ? true : false} clearPopup={clearPopupData} restartData={clearPopupUpdate} removeThisNote={deleteNote} /> 
    let contents = loading ? <p>Loading...</p> : renderNotesTable()

    return (
        <div>
            <div>
                {currentPopup}
            </div>
            <div className={"trashButtons"}  style={{ display: "flex", flex: 1, width: "100%"} }>
                <button className="buttonLeft" style={{ flex: buttonsControll == 0 ? 2 : 1 }} onClick={() => (changeMode(false), setButtonControll(0))}><FontAwesomeIcon icon={ faPenToSquare }></FontAwesomeIcon></button>
                <button className="buttonCenter" style={{ flex: buttonsControll == 1 ? 2 : 1 }} onClick={() => (changeMode(true), setDeleteMode("permanent"), setButtonControll(1))} ><FontAwesomeIcon icon={faTrash}></FontAwesomeIcon></button>
                <button className="buttonRight" style={{ flex: buttonsControll == 2 ? 2 : 1 }} onClick={() => (changeMode(true), setDeleteMode("temporary"), setButtonControll(2))} ><FontAwesomeIcon icon={faTrashArrowUp}></FontAwesomeIcon></button>
            </div>
            <div style={{ display: "flex", flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", alignContent: "space-around", marginTop: 4, padding: 0 }}>
                {contents}
            </div>
            
        </div>
    )
}
export default Trash