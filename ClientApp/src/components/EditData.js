import React, { useEffect, useState } from 'react';
//wyświetl jedną notatkę (get id), contenteditable = true, dodatkowe przyciski wracajace na poprzednią podstrone (bonus punkty za komponent funkcyjny)

export const EditData = (props) => {


    useEffect(() => { 
        console.log("component loaded")
        }, [])

    const refTitle = React.useRef();
    const refContent = React.useRef();
    const refDate = React.useRef();
    const refEditDate = React.useRef();

    async function handleEdit() {

        if (refTitle.current?.innerText.length == 0 && refContent.current?.innerText.length == 0) {
            console.log("incorrect")
            //show warning if needed
            return 0
        }

        if (props.id == "new") {
             console.log("creator")
            let body = { title: refTitle.current?.innerText, content: refContent.current?.innerText, toDelete: false }
            const response = await fetch('api/Notes', { headers: { "Content-Type": "application/json" }, method: "POST", body: JSON.stringify(body) })
            console.log(response)

        } else {
            console.log("editor")
            let body = { id: props.id, title: refTitle.current?.innerText, content: refContent.current?.innerText, date: refDate.current?.innerText }
            console.log(body)
            const response = await fetch('api/Notes/', { headers: { "Content-Type": "application/json" }, method: "PUT", body: JSON.stringify(body) });
            console.log(response)
        }

        await cleanPopup()

    }

    const handleDeleteNote = () => {
        props.deleteThisNote()
        cleanPopup()
    }

    const cleanPopup = () => {

        props.restartData()
        props.clearPopup()

    }

    return props.visibility ? (
                //add black opacity screen behind
                <>
                    <div hidden={!props.visibility} className="blackPage" style={{ opacity: 0.5, width: "100%", height: "100%", backgroundColor: "black", position: "fixed", top: 0, left: 0 }}>
                    </div>
                    <div hidden={!props.visibility} className="popup" style={{ opacity: 1, padding: 0, position: "fixed", backgroundColor: "#B2BEB5", width: "70%", height: "80%", margin: "auto", left: "calc((100% - 70%) / 2)" }}>

                        <div style={{ marginTop: 5 }} ref={refTitle} contentEditable suppressContentEditableWarning={true} className="title">{props.title}</div>

                        <hr />

                        <div ref={refContent} contentEditable suppressContentEditableWarning={true} className="content">{props.content}</div>

                        <hr />

                        <div ref={refDate} className="date"> {props.date}</div>
                        <div ref={refEditDate} className="date"> { props.editDate}</div>

                        <div style={{ width: "100%", margin: 0, position: "absolute", bottom: "0px", display: "flex", flex: 1, background: "transparent" }}>
                            <button className="buttonLeft buttonLeftClose buttonClose" style={{ flex: 1 }} onClick={() => handleEdit()}>{props.id != "new" ? "Update" : "Add"}</button>
                            { props.id != "new" ? <button className="buttonCenter buttonClose" style={{ flex: 1 }} onClick={() => handleDeleteNote()}>{props.toDelete ? "Restore" : "Delete"}</button>: null}
                            {props.toDelete ? <button className="buttonCenter buttonClose" style={{ flex: 1 }}>Remove</button> : null}
                            <button className="buttonRight buttonRightClose buttonClose" style={{ flex: 1 }} onClick={() => props.clearPopup()}>Cancel</button>
                    
                        </div>

                    </div>
                </>
        
        ) : null
}
export default EditData
    