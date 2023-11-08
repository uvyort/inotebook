
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const host = "http://localhost:5000"
    const notesInitial = []

    const [notes, setNotes] = useState(notesInitial)


    //   Get all Notes
    const getNotes = async () => {
        // TODO:API CALL
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
            method: "GET",

            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU0N2FhNzc2NDE5ZmRhODc1NzFkN2Y0In0sImlhdCI6MTY5OTI1MzcyNX0.2phZO5_W-aKzOUhJIThchW26igxpC_gzDcO3lwnt4ac"
            },
         });
         const json = await response.json()
         
         setNotes(json)
    }

    //   Add a note
    const addNote = async (title, description, tag) => {
        // TODO:API CALL
        const response = await fetch(`${host}/api/notes/addnote`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU0N2FhNzc2NDE5ZmRhODc1NzFkN2Y0In0sImlhdCI6MTY5OTI1MzcyNX0.2phZO5_W-aKzOUhJIThchW26igxpC_gzDcO3lwnt4ac"
            },

            body: JSON.stringify({ title, description, tag })
        });

        const note = await response.json();
        setNotes(notes.concat(note))
    }




    // Delete a note
    const deleteNote =async (id) => {
        
         // API Call
         const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU0N2FhNzc2NDE5ZmRhODc1NzFkN2Y0In0sImlhdCI6MTY5OTI1MzcyNX0.2phZO5_W-aKzOUhJIThchW26igxpC_gzDcO3lwnt4ac"
            }
        });
        const json = response.json();
        console.log(json);

        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes)
    }

    // Edit a note
    const editNote = async (id, title, description, tag) => {
        // API Call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNjU0N2FhNzc2NDE5ZmRhODc1NzFkN2Y0In0sImlhdCI6MTY5OTI1MzcyNX0.2phZO5_W-aKzOUhJIThchW26igxpC_gzDcO3lwnt4ac"
            },
            body: JSON.stringify({ title, description, tag }),
        });
        const json =await response.json();
         console.log(json)

        let newNotes = JSON.parse(JSON.stringify(notes))
        // Logic to edit in client
        for (let index = 0; index < newNotes.length; index++) {
            const element = newNotes[index];
            if (element._id === id) {
                newNotes[index].title = title;
                newNotes[index].description = description;
                newNotes[index].tag = tag;
                break;
            } 
        }
        
        setNotes(newNotes);
    }
    return <NoteContext.Provider value={{ notes, addNote, deleteNote, editNote, getNotes }}>
        {props.children}
    </NoteContext.Provider>
}


export default NoteState;