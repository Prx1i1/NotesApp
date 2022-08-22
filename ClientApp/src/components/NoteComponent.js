import react, { Component } from "react"

class NoteComponent extends Component {
    constructor(props) {
        super(props)
        this.state = { id: props.id, title: props.title, content: props.content, date: props.date, mode: props.mode, toDeletion: props.toDeletion, selected: false }
    }


    handleClick() {

        console.log(this.props.selectionMode)

        if (this.props.selectionMode == "select") {

            this.props.select()


        } else { 

            console.log(this.props)
            if (!this.props.mode) {
                console.log("View")

                this.props.storePopup(this.state.id, this.state.title, this.state.content, this.state.date, this.state.toDeletion)

            } else {
                if (this.props.deleteMode === "temporary") {
                    //this.props.onClick() // this is perma deletion
                    this.props.onClickComplex()
                } else {
                    this.props.onClick()
                }
            }
        }

    }

    handleDateFormat() {
        let timeframes = this.props.date.split("T") 
        let time = timeframes[1]
        let date = timeframes[0]

        time = time.split(":")
        time = time[0] + ":" + time[1]

        date = date.split("-")
        date = date[2] + "." + date[1] + "." + date[0]

        return(time + " " + date)
    }

    render() {

        //let deletionTag = this.state.toDeletion? "red" : "lightgray"

        return (
            <div
                className={"note"}
                style={{
                    width: "auto", flex: 1, minWidth: this.props.minWidth, backgroundColor: this.props.isSelected()? "black" : "white"
                }}
                onClick={() => this.handleClick()}
            >
                <div className={"notePartTitle", "notePart"} style={{ textAlign: "center", fontWeight: "bold" }}>{this.props.title}</div>
                <div className={"notePartContent", "notePart"} style={{ wordWrap: "break-word"} }>{this.props.content}</div>
                <div className={"notePartDate", "notePart"} style={{ textAlign: "right" }}>{this.handleDateFormat()}</div>
            </div>    
        )
    }
}
export default NoteComponent