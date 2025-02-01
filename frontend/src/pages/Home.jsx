import { useState, useEffect, useContext } from "react";
import api from "../api";
import Note from "../components/Note";
import "../styles/Home.css";

function Home() {
    const [notes, setNotes] = useState([]);
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");


    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
        api.get("/api/v1/notes/")
            .then((response) => response.data)
            .then((data) => {
                setNotes(data);
                console.log(data);
            })
            .catch((error) => alert(error));
    };

    const deleteNote = (id) => {
        api.delete(`/api/v1/notes/delete/${id}/`)
            .then((response) => {
                if (response.status === 204) {
                    alert("Note was deleted successfully");
                } else {
                    alert("Failed to delete note");
                }
                getNotes();
            })
            .catch((error) => alert(error));
    };

    const createNote = (e) => {
        e.preventDefault();

        api.post("/api/v1/notes/", { title, content }).then((response) => {
            if (response.status === 201) {
                alert("Note was created successfully");
            } else {
                alert("Failed to create note");
            }
            getNotes();
        });
    };

    return (
        <div>
            <div>
                <h2>Notes</h2>
                {notes.map((note) => (
                    <Note key={note.id} note={note} onDelete={deleteNote} />
                ))}
            </div>
            <h2>Create a note</h2>
            <form onSubmit={createNote}>
                <label htmlFor="title">Title:</label>
                <br />
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                />
                <label htmlFor="content">Content:</label>
                <br />
                <textarea
                    id="content"
                    name="content"
                    required
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                ></textarea>
                <br />
                <input type="submit" value="Submit" />
            </form>
        </div>
    );
}

export default Home;
