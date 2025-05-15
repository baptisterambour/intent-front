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
        <div>
            <button onClick={() => setShowEditForm(false)}>➖ Cancel edit</button>
            <h2>Edit intent</h2>
            <h3>ID : {idEditedIntent}</h3>
            <form onSubmit={handleSubmit}>
                <input type="text" id="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Content" required />
                <button type="submit">
                    Edit
                </button>
            </form>
        </div>
    );
};

export default IntentEditForm;