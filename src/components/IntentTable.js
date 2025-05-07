import {useState, useEffect} from "react";
import axios from "axios";
import IntentAddForm from "./IntentAddForm";
import IntentEditForm from "./IntentEditForm";

const DEFAULT_INTENTS_URL = "http://localhost:5000/intent"

export default function TaskTable() {
    const [intents, setIntents] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        fetchIntents();
    }, []);

    const fetchIntents = async () => {
        try {
            const response = await axios.get(DEFAULT_INTENTS_URL);
            setIntents(response.data);
        } catch (error) {
            console.error("Error fetching intents:", error);
        }
    }

    const editIntent = async (intent_id) => {
        try {
            await axios.patch(DEFAULT_INTENTS_URL+"/"+intent_id);
        } catch (error) {
            console.error(error);
        }
    }

    const deleteIntent = async (intent_id) => {
        try {
            await axios.delete(DEFAULT_INTENTS_URL+"/"+intent_id);
            fetchIntents();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-bold my-4">Intent List</h2>
            {intents.length > 0 ? (
                <div className="overflow-x-auto max-w-7xl mx-auto">
                    <table className="min-w-full table-auto border-collapse">
                        <thead>
                            <tr className="bg-gray-200">
                                <th className="border p-2">ID</th>
                                <th className="border p-2">Author</th>
                                <th className="border p-2">Content</th>
                                <th className="border p-2">Creation date</th>
                                <th className="border p-2">Last update date</th>
                                <th className="border p-2">EDIT</th>
                                <th className="border p-2">DELETE</th>
                            </tr>
                        </thead>
                        <tbody>
                            {intents.map((intent) => (
                                <tr key={intent.id} className="border">
                                    <td className="p-2">{intent.id}</td>
                                    <td className="p-2">{intent.author}</td>
                                    <td className="p-2">{intent.content}</td>
                                    <td className="p-2">{intent.date}</td>
                                    <td className="p-2">{intent.lastUpdateDate}</td>
                                    <td className="p-2"><button onClick={() => editIntent(intent.id, intent.content)}>✏️</button></td>
                                    <td className="p-2"><button onClick={() => deleteIntent(intent.id) }>❌</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>No intents founded</p>
            )}
            <button
                className="bg-green-500 text-white font-bold rounded px-2 py-2 my-4"
                onClick={() => setShowAddForm(!showAddForm)}
            >
                {showAddForm ? '➖ Cancel' : '➕ Add an intent'}
            </button>
            {showAddForm && <IntentAddForm onIntentAdded={() => { setShowAddForm(!showAddForm); fetchIntents(); }} />}
            {showEditForm && <IntentEditForm onIntentEdited={() => { setShowEditForm(!showEditForm); fetchIntents(); }} />}
        </div>
    )
}