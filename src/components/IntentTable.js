import { useState, useEffect } from "react";
import axios from "axios";
import IntentAddForm from "./IntentAddForm";
import IntentEditForm from "./IntentEditForm";

const DEFAULT_INTENTS_URL = "http://localhost:5000/intent"

export default function IntentTable() {
    const [intents, setIntents] = useState([]);
    const [showAddForm, setShowAddForm] = useState(false);
    
    const [showEditForm, setShowEditForm] = useState(false);
    const [idEditedIntent, setIdEditedIntent] = useState('');
    const [contentEditedIntent, setContentEditedIntent] = useState('');

    const [idIntentIntentReport, setIdIntentIntentReport] = useState('');
    const [showIntentReport, setShowIntentReport] = useState(false);
    const [intentReport, setIntentReport] = useState([]);
    
    const [idIntentJsonLD, setIdIntentJsonLD] = useState('');
    const [showIntentJsonLD, setShowIntentJsonLD] = useState(false);
    const [jsonLDIntent, setJsonLDIntent] = useState('');

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

    const fetchIntentReport = async (intent_id) => {
        try {
            fetchIntents();
            const response = await axios.get(DEFAULT_INTENTS_URL+"/"+intent_id+"/intentReport");
                setIntentReport(response.data);
        } catch (error) {
            console.error("Error fetching intents:", error);
        }
    }

    const fetchIntentJsonLD = async (intent_id) => {
        try {
            fetchIntents();
            const response = await axios.get(DEFAULT_INTENTS_URL+"/"+intent_id+"/json-ld");
                setJsonLDIntent(response.data);
        } catch (error) {
            console.error("Error fetching JSON-LD:", error);
        }
    }

    const editIntent = async (intent_id, intent_content) => {
        setShowEditForm(true);
        setIdEditedIntent(intent_id);
        setContentEditedIntent(intent_content);
    }

    const deleteIntent = async (intent_id) => {
        try {
            await axios.delete(DEFAULT_INTENTS_URL+"/"+intent_id);
            fetchIntents();
            if(intent_id === idIntentJsonLD) {
                setIdIntentJsonLD('');
                setShowIntentJsonLD(false);
                setJsonLDIntent('');
            }
            if(intent_id === idIntentIntentReport) {
                setIdIntentIntentReport('');
                setShowIntentReport(false);
                setIntentReport([]);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const lookAtReport = async (intent_id) => {
        if(intent_id === idIntentIntentReport) {
            setIdIntentIntentReport('');
            setShowIntentReport(false);
            setIntentReport([]);
        } else {
            setIdIntentIntentReport(intent_id);
            setShowIntentReport(true);
            fetchIntentReport(intent_id);
        }
    }

    const lookAtJsonLD = async (intent_id) => {
        if(intent_id === idIntentJsonLD) {
            setIdIntentJsonLD('');
            setShowIntentJsonLD(false);
            setJsonLDIntent('');
        } else {
            setIdIntentJsonLD(intent_id);
            setShowIntentJsonLD(true);
            fetchIntentJsonLD(intent_id);
        }
    }

    return (
        <div>
            <button onClick={() => setShowAddForm(!showAddForm)}>
                {showAddForm ? '➖ Cancel add' : '➕ Add an intent'}
            </button>
            {showAddForm && <IntentAddForm onIntentAdded={() => { setShowAddForm(!showAddForm); fetchIntents(); }} />}
            {showEditForm && <IntentEditForm onIntentEdited={() => {
                setShowEditForm(!showEditForm);
                fetchIntents();
                if (idEditedIntent === idIntentJsonLD) {
                    fetchIntentJsonLD(idEditedIntent);
                }
                if (idEditedIntent === idIntentIntentReport) {
                    fetchIntentReport(idEditedIntent);
                }
            }}
            idEditedIntent={idEditedIntent}
            contentEditedIntent={contentEditedIntent}
            setShowEditForm={setShowEditForm} />}
            <h2>Intent List</h2>
            {intents.length > 0 ? (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Author</th>
                                <th>Content</th>
                                <th>Creation date</th>
                                <th>Last update date</th>
                                <th>EDIT</th>
                                <th>DELETE</th>
                                <th>Intent Report</th>
                                <th>JSON-LD</th>
                            </tr>
                        </thead>
                        <tbody>
                            {intents.map((intent) => (
                                <tr key={intent.id}>
                                    <td>{intent.id}</td>
                                    <td>{intent.author}</td>
                                    <td>{intent.content}</td>
                                    <td>{new Date(intent.date).toLocaleString("en-NO", {dateStyle: "long", timeStyle: "medium", timeZone: "Europe/Oslo"})}</td>
                                    <td>{new Date(intent.lastUpdateDate).toLocaleString("en-NO", {dateStyle: "long", timeStyle: "medium", timeZone: "Europe/Oslo"})}</td>
                                    <td><button onClick={() => editIntent(intent.id, intent.content)}>✏️</button></td>
                                    <td><button onClick={() => deleteIntent(intent.id) }>🗑️</button></td>
                                    <td><button onClick={() => lookAtReport(intent.id) }>{idIntentIntentReport === intent.id ? '❌' : '👁'}</button></td>
                                    <td><button onClick={() => lookAtJsonLD(intent.id) }>{idIntentJsonLD === intent.id ? '❌' : '👁'}</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {showIntentReport && intentReport.length > 0 && (
                        <div>
                            <h3>Intent Report for ID : {idIntentIntentReport}</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Agent Name</th>
                                        <th>Response</th>
                                        <th>Date</th>
                                        <th>Execution Time</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {intentReport.map((report, i) => (
                                        <tr key={i}>
                                            <td>{report.id}</td>
                                            <td>{report.agentName}</td>
                                            <td>{report.response}</td>
                                            <td>{new Date(report.date).toLocaleString("en-NO", {dateStyle: "long", timeStyle: "medium", timeZone: "Europe/Oslo"})}</td>
                                            <td>{(report.executionTime * 1).toFixed(3)} s</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    {showIntentJsonLD && (
                        <div>
                            <h3>JSON-LD for ID : {idIntentJsonLD}</h3>
                            <pre id="jsonld">{JSON.stringify(jsonLDIntent, null, 2)}</pre>
                        </div>
                    )}
                </div>
            ) : (
                <p>No intents founded</p>
            )}
        </div>
    )
}