import React, { useState } from 'react';
//wyświetl jedną notatkę (get id), contenteditable = true, dodatkowe przyciski wracajace na poprzednią podstrone (bonus punkty za komponent funkcyjny)

export const EditData = (props) => {

    const refTitle = React.useRef();
    const refContent = React.useRef();
    const refDate = React.useRef();

    async function handleEdit() {
        let body = { id: props.id, title: refTitle.current?.innerText, content: refContent.current?.innerText, date: refDate.current?.innerText }
        console.log(body)
        const response = await fetch('api/Notes/', { headers: { "Content-Type": "application/json" }, method: "PUT", body: JSON.stringify(body) });
        console.log(response)

        await cleanPopup()

    }

    const cleanPopup = () => {

        props.restartData()
        props.clearPopup()
    }

    return (
        //add black opacity screen behind
        <>
            <div hidden={ !props.visibility} className="blackPage" style={{ opacity: 0.5, width: "100%", height: "100%", backgroundColor: "black", position: "absolute", top: 0, left: 0 }}>
        </div>
        <div hidden={!props.visibility} className="popup" style={{opacity: 1 ,padding: 0 , position: "absolute", backgroundColor: "#B2BEB5", width: "70%", height: "80%", margin: "auto", left: "calc((100% - 70%) / 2)" }}>

            <div style={{ marginTop: 5}} ref={ refTitle } contentEditable className="title"> {props.title}</div>

            <hr />

            <div ref={refContent} contentEditable className="content">{props.content}</div>

            <hr />

            <div ref={refDate} contentEditable className="date"> {props.date}</div>

            <div style={{ width: "100%", position: "absolute", bottom : "0px" }}>
                <button style={{ width: "50%"}} onClick={() => handleEdit() }>Update</button>
                <button style={{ width: "50%"}} onClick={() => props.clearPopup() }>Cancel</button>
            </div>

        </div>
        </>
        
        )
}
export default EditData
    