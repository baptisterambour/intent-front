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
        <div className="p-4 bg-white border rounded shadow-lg">
            <h2 className="text-lg font-bold mb-2">Add an intent</h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded shadow-md">
                <input type="text" id="author" value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Author"
                className="border p-2 w-full mb-2" required />
                <input type="text" id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"
                className="border p-2 w-full mb-2" required />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Add
                </button>
            </form>
        </div>
    );
};

export default IntentAddForm;