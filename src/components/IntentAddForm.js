import { useState } from "react";
import axios from 'axios';

const DEFAULT_INTENTS_URL = "http://localhost:5000/intent"

const IntentAddForm = ({ onIntentAdded }) => {
    const [author, setAuthor] = useState('');
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        const intentData = {
            author,
            content
        };

        try {
            await axios.post(DEFAULT_INTENTS_URL, intentData);
            onIntentAdded();
        } catch (error) {
            console.error("Error adding intent:", error);
        }
    };

    return (
        <div>
            <h2>Add an intent</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author" required />
                <input type="text" id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required />
                <button type="submit">
                    Add
                </button>
            </form>
        </div>
    );
};

export default IntentAddForm;