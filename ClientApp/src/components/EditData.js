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
        

        <div hidden={ !props.visibility } className="popup" style={{ position: "absolute", backgroundColor: "#B2BEB5", width: "70%", height: "60%", margin: "auto" }}>

            <div ref={ refTitle } contentEditable className="title"> {props.title}</div>
        
            <div ref={refContent} contentEditable className="content">{props.content}</div>
            
            <div ref={refDate} contentEditable className="date"> {props.date}</div>

            <div style={{ width: "100%",display: "block" , position: "absolute", bottom : "0px" }}>
                <button onClick={() => handleEdit() }>Update</button>
                <button onClick={() => props.clearPopup() }>Cancel</button>
            </div>

        </div>
        
        )
}
export default EditData
    