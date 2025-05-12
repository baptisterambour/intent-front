import { useState, useEffect } from "react";
import axios from 'axios';

const DEFAULT_INTENTS_URL = "http://localhost:5000/intent"

const IntentEditForm = ({ onIntentEdited, idEditedIntent, contentEditedIntent, setShowEditForm }) => {
    const [content, setContent] = useState(contentEditedIntent);

    useEffect(() => {
        setContent(contentEditedIntent);
    }, [contentEditedIntent]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const intentData = {
            content
        };

        try {
            await axios.patch(DEFAULT_INTENTS_URL+"/"+idEditedIntent, intentData);
            onIntentEdited();
        } catch (error) {
            console.error("Error editing intent:", error);
        }
    };

    return (
        <div className="p-4 bg-white border rounded shadow-lg">
            <button onClick={() => setShowEditForm(false)}>➖ Cancel edit</button>
            <h2 className="text-lg font-bold mb-2">Edit an intent</h2>
            <h3>ID : {idEditedIntent}</h3>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto bg-white p-6 rounded shadow-md">
                <input type="text" id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content"
                className="border p-2 w-full mb-2" required />
                <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
                    Edit
                </button>
            </form>
        </div>
    );
};

export default IntentEditForm;