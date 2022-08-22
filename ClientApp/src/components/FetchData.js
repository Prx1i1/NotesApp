import React, { Component } from 'react';
import NoteComponent from "./NoteComponent";
import EditData from "./EditData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faTrash, faX, faTrashArrowUp, faBan } from '@fortawesome/free-solid-svg-icons'

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
      this.state = { forecasts: [], loading: true, mode: false, restart: 0, display: "default", deleteMode: "temporary", minWidth: "30%", layout: 2 };
      //this.deleteNote = this.deleteNote.bind(this)
      //this.handleChangeMode = this.handleChangeMode(this)
  }

  componentDidMount() {
    this.populateNotesData();
  }



    renderNotesTable(forecasts) {
        return (
            forecasts.map(note => (<NoteComponent key={note.id} id={note.id} title={note.title} content={note.content} date={note.date} toDeletion={note.toDelete} deleteMode={this.state.deleteMode}
                onClick={() => this.deleteNote(note.id)} mode={this.state.mode} storePopup={this.storePopupData} onClickComplex={() => this.deleteNoteComplex(note.id, note.toDeletion)} minWidth= {this.state.minWidth } />))
    );
    }

    async handleChangeMode() {

        this.setState({mode: !this.state.mode})
        console.log(this.state.mode)

    }

    storePopupData = (id, title, content, date, toDelete) => {
        this.setState({ popupId: id, popupTitle: title, popupContent: content, popupDate: date, popupToDelete: toDelete })

        console.log(this.state)
    }

    clearPopupData = () => {
        this.setState({ popupId: null, popupTitle: null, popupContent: null, popupDate: null, popupToDelete: null })

        console.log(this.state)
    }

    clearPopupUpdate = () => {
        this.setState({loading: true})
        this.populateNotesData()
    }

    createNotePopup() {
        this.setState({ popupId: "new"})
    }

    async handleCreateNote() {
        let body = { "title": null, "content": null, "date": null, "toDelete" : false}
        const addnote = await fetch('api/Notes', { headers: { "Content-Type": "application/json" },  method: "POST", body: JSON.stringify(body)})
        console.log(addnote)
        this.populateNotesData()
    }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderNotesTable(this.state.forecasts);

    let mode = this.state.mode

      let currentPopup = <EditData id={this.state.popupId} title={this.state.popupTitle} content={this.state.popupContent} date={this.state.popupDate} toDelete={this.state.popupToDelete}
          visibility={this.state.popupId !== undefined && this.state.popupId !== null ? true : false} clearPopup={this.clearPopupData}
          restartData={this.clearPopupUpdate} deleteThisNote={() => this.deleteNoteComplex(this.state.popupId, this.state.popupToDelete)} />

      return (

          <div>
              <style>{mode ? "body { background-color: red; }" : "body { background-color: #ff9933; }"}</style>
           {currentPopup}
        <h1 id="tabelLabel" >My Notes</h1>
            <p>All notes stored online</p>
            <p onClick={() => this.handleChangeMode()}>Current mode: {mode ? "delete" : "view"}</p>
            <div>
                  <button onClick={() => this.createNotePopup()}>Create New Note</button>
                  <button onClick={() => this.handleChangeLayout(this.state.minWidth)} style={{ marginLeft: "5px" }}>Change Layout ({ this.state.layout + 1}/5)</button>
                  {/*<button style={{ float: "right" }} onClick={() => this.handleChangeDisplay(this.state.display)}>View {this.state.display == "default" ? "trash" : "notes" }</button>*/}
                  <button style={{ float: "right", marginLeft: "5px", marginRight: "5px" }} onClick={() => this.handleChangeMode()}><abbr title={"Switch between view and delete modes"}><FontAwesomeIcon icon={!mode ? faTrash : faX} /></abbr></button>
                 {/* <button style={{ float: "right" }} onClick={() => this.handleDeleteMode(this.state.deleteMode)}> <abbr title={"Switch between permanent deletion and moving to trash"}> <FontAwesomeIcon icon={ this.state.deleteMode === "temporary" ? faTrashArrowUp : faBan }/> </abbr> </button>*/}
            </div>
        <div style={{display: "flex", flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", alignContent: "space-around",marginTop: 4, padding: 0 }}>
            {contents}
        </div>
      </div>
      );
    }

    

    async handleChangeLayout(layoutValue) {
        if (layoutValue == "15%") {
            this.setState({ minWidth: "20%" })
            this.setState({ layout: 1})
        } else if (layoutValue == "20%") {
            this.setState({ minWidth: "30%" })
            this.setState({ layout: 2 })
        } else if (layoutValue == "30%") {
            this.setState({ minWidth: "40%" })
            this.setState({ layout: 3 })
        } else if (layoutValue == "40%") {
            this.setState({ minWidth: "100%" })
            this.setState({ layout: 4 })
        } else {
            this.setState({ minWidth: "15%" })
            this.setState({ layout: 0 })
        }
    }

    async handleDeleteMode(mode) {
        if (mode == "temporary") {
            this.setState({ deleteMode: "pernament" })
        } else {
            this.setState({ deleteMode: "temporary" })
        }
    }

    async handleChangeDisplay(display) {

        console.log("data display", display)

        if (display == "deleted") {
            this.setState({ display: "default" })
        } else {
            this.setState({ display: "deleted" })
        }

        await this.setState({loading: true})
        await this.populateNotesData()
    }
    async populateNotesData() {

    console.log("fetching data", this.state.display)

      let displayMode = this.state.display
      const response = await fetch('api/Notes/' + displayMode, { headers: {"Content-Type" : "application/json"} });
      console.log(response)
      const data = await response.json();
      console.log(data)
        this.setState({ forecasts: data, loading: false });
   }

    async deleteNote(id) {
        console.log("clicked")
        const deletion = await fetch('api/Notes/' + id, { headers: { "Content-Type": "application/json" }, method: "delete" })
        console.log(deletion)
        this.setState({ loading: true })

        await this.populateNotesData()
    }

    //wire this function to onclick in component
    async deleteNoteComplex(id, toDeleteCurrent) {
        let body = { "id": id, "toDelete": toDeleteCurrent }
        console.log("body", body)
        //fetch here
        const complexDelete = await fetch('api/Notes/delete', { headers: { "Content-Type": "application/json" }, method: "PUT", body: JSON.stringify(body) });
        console.log(complexDelete)
        this.setState({loading: true})

        await this.populateNotesData()
        
    }

}
