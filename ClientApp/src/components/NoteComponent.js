import react, { Component } from "react"

class NoteComponent extends Component {
    constructor(props) {
        super(props)
        this.state = { id: props.id, title: props.title, content: props.content, date: props.date, mode: props.mode, toDeletion: props.toDeletion, selected: false }
    }

    handleClick() {
        console.log(this.props)
        if (!this.props.mode) {
            console.log("View")
            this.setState({ selected: true })

            this.props.storePopup(this.state.id, this.state.title, this.state.content, this.state.date)

        } else { 
            //this.props.onClick() // this is perma deletion
            this.props.onClickComplex()
        }

    }

    render() {

        let deletionTag = this.state.toDeletion? "red" : "green"

        return (
            <div
                style={{ width: "auto", flex: 1, padding: 3, borderStyle: "dashed", borderColor: "black", borderWidth: "1px", marginBottom: 3, backgroundColor: deletionTag }}
                onClick={() => this.handleClick()}
            >
                <div style={{ textAlign: "center", fontWeight: "bold" }}>{this.props.title}</div>
                <div >{this.props.content}</div>
                <div style={{textAlign: "right" }}>{this.props.date }</div>
            </div>    
        )
    }
}
export default NoteComponent