import React, { Component } from 'react';
import NoteComponent from "./NoteComponent";
import EditData from "./EditData";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCoffee, faTrash, faX, faTrashArrowUp, faBan, faPlus, faHandPointer } from '@fortawesome/free-solid-svg-icons'

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
      this.state = { forecasts: [], loading: true, mode: false, restart: 0, display: "default", deleteMode: "temporary", minWidth: "30%", layout: 2, selectedNotes: [], popupTags: [], selectionMode: "default" };
  }

  componentDidMount() {
      this.populateNotesData();
      console.log(this.props)
  }



    renderNotesTable(forecasts) {
        return (
            forecasts.map(note => (<NoteComponent key={note.id} id={note.id} title={note.title} content={note.content} date={note.date} toDeletion={note.toDelete} deleteMode={this.state.deleteMode} editDate={note.editDate} tags={note.tags }
                onClick={() => this.deleteNote(note.id)} mode={this.state.mode} storePopup={this.storePopupData} onClickComplex={() => this.deleteNoteComplex(note.id, note.toDeletion)} minWidth={this.state.minWidth}
                selectionMode={this.state.selectionMode} select={() => this.handleSelectNote(note.id)} allSelectedNotes={this.state.selectedNotes} isSelected={() => this.isSelected(note.id) } />))
    );
    }

    handleAddTag = (input) => {

        console.log("add tags")
        console.log(this.state.popupTags, input)

        if (this.state.popupTags !== null) {
            let source = [...this.state.popupTags, input]
            console.log(source)
            console.log(JSON.stringify({ tags: source }))
            this.setState({ popupTags: source })
            this.fetchModifyTag(source)
        } else {
            this.setState({ popupTags: [input] })
            this.fetchModifyTag([input])
        }


    }

    async fetchModifyTag(tags) {

        console.log(tags)
        let body = { id: this.state.popupId, "title": null, "content": null, tags: JSON.stringify(tags) }
        console.log(JSON.stringify(body))
        const response = await fetch('api/Notes/tags', { headers: { "Content-Type": "application/json" }, method: "PUT", body: JSON.stringify(body) });
        console.log(response)
    }


    isSelected(id) {

        let alreadyInArray = false

        for (let i = 0; i < this.state.selectedNotes.length; i++) {
            if (this.state.selectedNotes[i] == id) {
                console.log("found id in array")
                alreadyInArray = true

            }
        }

        return alreadyInArray
    }

    toggleNotesSelection() {
        if (this.state.selectionMode == "default") {
            this.setState({ selectionMode: "select" })
        } else {
            this.setState({ selectionMode: "default" })
            this.setState({ selectedNotes: []})
        }
    }

    async handleSelectNote(id) {

        let alreadyInArray = false
        let placeInArray = null
        for (let i = 0; i < this.state.selectedNotes.length; i++) {
            if (this.state.selectedNotes[i] == id) {
                console.log("found id in array")
                alreadyInArray = true
                placeInArray = i
            }
        }

        if (alreadyInArray == true) {
            let tempNotesArray = this.state.selectedNotes
            tempNotesArray.splice(placeInArray, 1)
            await this.setState({ selectedNotes: tempNotesArray })
        } else {
            await this.setState({ selectedNotes: [...this.state.selectedNotes, id] })
        }

        console.log(this.state.selectedNotes)

    }

    async handleChangeMode() {

        this.setState({mode: !this.state.mode})
        console.log(this.state.mode)

    }

    storePopupData = (id, title, content, date, toDelete, editDate, tags) => {
        this.setState({ popupId: id, popupTitle: title, popupContent: content, popupDate: date, popupToDelete: toDelete, popupEditDate: editDate, popupTags: tags })

        console.log(this.state)
    }

    clearPopupData = () => {
        this.setState({ popupId: null, popupTitle: null, popupContent: null, popupDate: null, popupToDelete: null, popupEditDate: null, popupTags: [] })

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
        let body = { "title": null, "content": null, "date": null, "toDelete" : false, "editDate" : null}
        const addnote = await fetch('api/Notes', { headers: { "Content-Type": "application/json" },  method: "POST", body: JSON.stringify(body)})
        console.log(addnote)
        this.populateNotesData()
    }

    async handleSearch(e) {
        console.log(e.target.value)
        this.setState({loading: true})

        if (e.target.value.length != 0) {
            this.handleSearchFetch(e.target.value)
        } else {
            this.populateNotesData()
        }
    }

    async handleSearchFetch(text) {
        const response = await fetch('/api/Notes/search/' + this.state.display + "/" + text, { headers: { "Content-Type" : "application/json" }, method: "GET"})
        const data = await response.json();
        console.log(data)
        this.setState({ forecasts: data, loading: false });
    }


    render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderNotesTable(this.state.forecasts);

    let mode = this.state.mode

        let currentPopup = <EditData addTags={this.handleAddTag}  id={this.state.popupId} title={this.state.popupTitle} content={this.state.popupContent} date={this.state.popupDate} toDelete={this.state.popupToDelete} editDate={this.state.popupEditDate} tags={this.state.popupTags }
            visibility={this.state.popupId !== undefined && this.state.popupId !== null ? true : false} clearPopup={this.clearPopupData} addTag={() => this.addTag(this.state.popupId) }
          restartData={this.clearPopupUpdate} deleteThisNote={() => this.deleteNoteComplex(this.state.popupId, this.state.popupToDelete)} />

      return (

          <div>
              
              
              <style>{mode ? ":root { background-color: red; }" : "body { background-color: inherit; }"}</style>
              <button className="addNote" onClick={() => this.createNotePopup()}><FontAwesomeIcon style={{ position: 'relative', left: 10, bottom: 10, fontSize: 32}} icon={faPlus}></FontAwesomeIcon></button>
              {currentPopup}
              <div style={{ height: 12 }}></div> {/*this is margin*/}
            <h1 >My Notes</h1>
            <p>All your notes in one place</p>
{/*            <p onClick={() => this.handleChangeMode()}>Current mode: {mode ? "delete" : "view"}</p>*/}
              <div className="mainButtons">
                  {/*<button style={{ flex: 1}} onClick={() => this.createNotePopup()}>Create New Note</button>*/}
                  {/*<button style={{ flex: 1 }} onClick={() => this.handleChangeLayout(this.state.minWidth)} style={{ marginLeft: "5px" }}>Change Layout ({ this.state.layout + 1}/5)</button>*/}
                  <input style={{ flex: 2 }} type="text" className="search" onChange={(e) => this.handleSearch(e)} />
                  {/*<button style={{flex:1, float: "right" }} onClick={() => this.handleChangeMode()}><abbr title={"Switch between view and delete modes"}><FontAwesomeIcon icon={!mode ? faTrash : faX} /></abbr></button>*/}
                  <button style={{right: 4, top: 4, float: "right" }} onClick={() => this.toggleNotesSelection()}>{this.state.selectionMode === "select" ?
                      <FontAwesomeIcon icon={faX}></FontAwesomeIcon> :
                      <FontAwesomeIcon icon={faHandPointer}></FontAwesomeIcon>}</button>
                  {this.state.selectionMode == "select" ? <button style={{ float: "right" }} onClick={() => this.handleDeleteSelected(this.state.selectedNotes)}><FontAwesomeIcon icon={faTrash }></FontAwesomeIcon></button> : null}

                  {/* <button style={{ float: "right" }} onClick={() => this.handleDeleteMode(this.state.deleteMode)}> <abbr title={"Switch between permanent deletion and moving to trash"}> <FontAwesomeIcon icon={ this.state.deleteMode === "temporary" ? faTrashArrowUp : faBan }/> </abbr> </button>*/}
            </div>
        <div style={{display: "flex", flex: 1, flexDirection: "row", flexWrap: "wrap", justifyContent: "space-evenly", alignContent: "space-around",marginTop: 4, padding: 0 }}>
            {contents}
              </div>

              {this.props.isMenuVisible() ? <div className="sideBar" style={{ position: "absolute", left: 0, top: 50, height: "100%", width: "25%" }}>
                Sidebar contents
              </div> : null}
      </div>
      );
    }

    async handleDeleteSelected(notes) {
        notes.map((i, j) => {
            this.deleteNoteComplex(i, false)
            console.log("deleting note id", i)
        })
        this.setState({ selectedNotes: [] })
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
