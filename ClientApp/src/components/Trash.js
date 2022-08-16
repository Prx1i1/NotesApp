import React, { useEffect, useState } from 'react';
import NoteComponent from "./NoteComponent";

export const Trash = () => {

    const [displayMode, setDisplayMode] = useState("deleted")
    const [mode, changeMode] = useState(false)
    const [forecasts, setForecasts] = useState([])
    const [loading, setLoadingState] = useState(true)
    const [minWidth, setMinWidth] = useState("30%")
    const [deleteMode, setDeleteMode] = useState("temporary")

    useEffect(() => {
        populateNotesData()
    }, [])

    function deleteNote(id) {

    }

    function storePopupData() {

    }

    function deleteNoteComplex(id, toDeletion) {

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

    let contents = loading ? <p>Loading...</p> : renderNotesTable()

    return (

        <div style={{ display: "flex", flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", alignContent: "space-around", marginTop: 4, padding: 0 }}>
            {contents}
        </div>
        )
}
export default Trash