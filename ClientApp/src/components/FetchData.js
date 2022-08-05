import React, { Component } from 'react';
import NoteComponent from "./NoteComponent";
import { useState } from "react";

export class FetchData extends Component {
  static displayName = FetchData.name;

  constructor(props) {
    super(props);
      this.state = { forecasts: [], loading: true, mode: true, restart: 0 };
      //this.deleteNote = this.deleteNote.bind(this)
      //this.handleChangeMode = this.handleChangeMode(this)
  }

  componentDidMount() {
    this.populateNotesData();
  }



    renderForecastsTable(forecasts) {
        return (
            forecasts.map(note => (<NoteComponent key={note.id} title={note.title} content={note.content} date={note.date} onClick={() => this.deleteNote(note.id)} mode={this.state.mode } />))
    );
    }

    async handleChangeMode() {

        this.setState({mode: !this.state.mode})
        console.log(this.state.mode)

    }

    async handleCreateNote() {
        let body = {"title" : "title", "content": "content", "date" : "today(i will do it later)"}
        const addnote = await fetch('api/Notes', { headers: { "Content-Type": "application/json" },  method: "POST", body: JSON.stringify(body)})
        console.log(addnote)
        this.populateNotesData()
    }

  render() {
    let contents = this.state.loading
      ? <p><em>Loading...</em></p>
      : this.renderForecastsTable(this.state.forecasts);

    let mode = this.state.mode

    return (
        <div onClick={null}>
        <h1 id="tabelLabel" >My Notes</h1>
            <p>All notes stored online</p>
            <p onClick={() => this.handleChangeMode()}>Current mode: {mode? "delete" : "view"}</p>
            <button onClick={() => this.handleCreateNote() }>Create New Note</button>
        <div style={{flex:3, flexDirection: "row", flexWrap: "wrap"}}>
            {contents}
        </div>
      </div>
      );
  }

  async populateNotesData() {
      const response = await fetch('api/Notes/', { headers: {"Content-Type" : "application/json"} });
      console.log(response)
      const data = await response.json();
      console.log(data)
    this.setState({ forecasts: data, loading: false });
   }

  async addNewNotes() {

    }

    async deleteNote(id) {
        console.log("clicked")
        const deletion = await fetch('api/Notes/' + id, { headers: { "Content-Type": "application/json" }, method: "delete" })
        console.log(deletion)
        const response = await fetch('api/Notes/', { headers: { "Content-Type": "application/json" } });
        console.log(response)
        const data = await response.json();
        console.log(data)
        this.setState({ forecasts: data, loading: false });
    }


}
