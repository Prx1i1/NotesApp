import React, { Component } from 'react';
import NoteComponent from "./NoteComponent";
import EditData from "./EditData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faTrash, faX } from '@fortawesome/free-solid-svg-icons'

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
      this.state = { forecasts: [], loading: true, mode: false, restart: 0 };
      //this.deleteNote = this.deleteNote.bind(this)
      //this.handleChangeMode = this.handleChangeMode(this)
  }

  componentDidMount() {
    this.populateNotesData();
  }



    renderForecastsTable(forecasts) {
        return (
            forecasts.map(note => (<NoteComponent key={note.id} id={note.id} title={note.title} content={note.content} date={note.date} toDeletion={note.toDelete}
                onClick={() => this.deleteNote(note.id)} mode={this.state.mode} storePopup={this.storePopupData} onClickComplex={() => this.deleteNoteComplex(note.id, note.toDeletion) } />))
    );
    }

    async handleChangeMode() {

        this.setState({mode: !this.state.mode})
        console.log(this.state.mode)

    }

    storePopupData = (id, title, content, date) => {
        this.setState({ popupId: id, popupTitle: title, popupContent: content, popupDate: date })

        console.log(this.state)
    }

    clearPopupData = () => {
        this.setState({ popupId: null, popupTitle: null, popupContent: null, popupDate: null })

        console.log(this.state)
    }

    clearPopupUpdate = () => {
        this.setState({loading: true})
        this.populateNotesData()
    }

    async handleCreateNote() {
        let body = {"title" : "title", "content": "content", "date" : "today(i will do it later)", "toDelete" : false}
        const addnote = await fetch('api/Notes', { headers: { "Content-Type": "application/json" },  method: "POST", body: JSON.stringify(body)})
        console.log(addnote)
        this.populateNotesData()
    }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderForecastsTable(this.state.forecasts);

    let mode = this.state.mode

      let currentPopup = <EditData id={this.state.popupId} title={this.state.popupTitle} content={this.state.popupContent} date={this.state.popupDate}
          visibility={this.state.popupId !== undefined && this.state.popupId !== null ? true : false} clearPopup={this.clearPopupData} restartData={ this.clearPopupUpdate }/>

      return (

          <div>
              <style>{mode? "body { background-color: red; }" : null}</style>
           {currentPopup}
        <h1 id="tabelLabel" >My Notes</h1>
            <p>All notes stored online</p>
            <p onClick={() => this.handleChangeMode()}>Current mode: {mode ? "delete" : "view"}</p>
            <div>
                  <button onClick={() => this.handleCreateNote()}>Create New Note</button>
                  {/*<button style={{ float: "right" }} onClick={() => this.handleChangeDisplay()}>Change display</button>*/}
                  <button style={{ float: "right" }} onClick={() => this.handleChangeMode()}><FontAwesomeIcon icon={!mode ? faTrash : faX} /></button>
            </div>
        <div style={{ flex: 1, flexDirection: "column", flexWrap: "wrap", justifyContent: "space-evenly", alignContent: "space-around",marginTop: 4 }}>
            {contents}
        </div>
      </div>
      );
  }

    async handleChangeDisplay() {
        if (this.state.display == "deleted") {
            this.setState({ display: "default" })
        } else {
            this.setState({ display: "deleted" })
        }

        await this.populateNotesData()
    }

    async populateNotesData() {

    console.log("fetching data", this.state.display)

      let displayMode = "default"
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
