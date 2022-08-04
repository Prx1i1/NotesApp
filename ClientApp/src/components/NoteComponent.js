﻿import react, { Component } from "react"

class NoteComponent extends Component {
    constructor(props) {
        super(props)
        this.state = {id: props.id, title: props.title, content: props.content, date: props.date}
    }
    render() {
        return (
            <div style={{width: "auto",flex:1, flexDirection: "column", padding: 3, borderStyle: "dashed", borderColor: "black", borderWidth: "1px", marginBottom: 3}} >
                <div style={{ textAlign: "center", fontWeight: "bold" }}>{this.props.title}</div>
                <div>{this.props.content}</div>
                <div style={{textAlign: "right" }}>{this.props.date }</div>
            </div>    
        )
    }
}
export default NoteComponent