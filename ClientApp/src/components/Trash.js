﻿import React, { useEffect, useState } from 'react';
import NoteComponent from "./NoteComponent";
import EditData from "./EditData"

export const Trash = () => {

    const [displayMode, setDisplayMode] = useState("deleted")
    const [mode, changeMode] = useState(false)
    const [forecasts, setForecasts] = useState([])
    const [loading, setLoadingState] = useState(true)
    const [minWidth, setMinWidth] = useState("30%")
    const [deleteMode, setDeleteMode] = useState("temporary")

    //popupId: id, popupTitle: title, popupContent: content, popupDate
    const [popupId, setPopupId] = useState(null)
    const [popupTitle, setPopupTitle] = useState(null)
    const [popupContent, setPopupContent] = useState(null)
    const [popupDate, setPopupDate] = useState(null)

    useEffect(() => {
        populateNotesData()
    }, [])

    async function deleteNote(id) {
        console.log("clicked")
        const deletion = await fetch('api/Notes/' + id, { headers: { "Content-Type": "application/json" }, method: "delete" })
        console.log(deletion)
        setLoadingState(true)

        await populateNotesData()
    }

    function storePopupData(id, title, content, date) {
        setPopupId(id)
        setPopupTitle(title)
        setPopupContent(content)
        setPopupDate(date)
    }
    function clearPopupData(){
        setPopupId(null)
        setPopupTitle(null)
        setPopupContent(null)
        setPopupDate(null)
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
            forecasts.map(note => (<NoteComponent key={note.id} id={note.id} title={note.title} content={note.content} date={note.date} toDeletion={note.toDelete} deleteMode={deleteMode}
                onClick={() => deleteNote(note.id)} mode={mode} storePopup={storePopupData} onClickComplex={() => deleteNoteComplex(note.id, note.toDeletion)} minWidth={minWidth} />))
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

    let currentPopup = <EditData id={popupId} title={popupTitle} content={popupContent} date={popupDate}
        visibility={popupId !== undefined && popupId !== null ? true : false} clearPopup={clearPopupData} restartData={clearPopupUpdate} />
    let contents = loading ? <p>Loading...</p> : renderNotesTable()

    return (
        <div>
            <div>
                {currentPopup}
            </div>
            <div>
                <button onClick={() => (changeMode(false))}>*view*</button>
                <button onClick={() => (changeMode(true), setDeleteMode("permanent"))} >*delete*</button>
                <button onClick={() => (changeMode(true), setDeleteMode("temporary"))} >*restore*</button>
            </div>
            <div style={{ display: "flex", flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", alignContent: "space-around", marginTop: 4, padding: 0 }}>
                {contents}
            </div>
            
        </div>
    )
}
export default Trash