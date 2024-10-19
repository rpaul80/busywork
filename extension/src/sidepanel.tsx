import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import Client from "./lib/client";

interface Agent {
    name: string,
    id: string,
    prompt: string
}

const CreateJiraTicket = {
    "name": "Create Ticket",
    "id": "create_ticket",
    "prompt": "Write a ticket for this"
}

const SummarizeForClarity = {
    "name": "Summarize",
    "id": "summarize",
    "prompt": "Summarize the following content"
}

const Agents: Agent[] = [
    CreateJiraTicket,
    SummarizeForClarity
]

interface SidePanelProperties {
    text?: string
}

const client = new Client("http://localhost:8000")

const SidePanel = (properties: SidePanelProperties) => {
    const [agents] = useState<Agent[]>(Agents);
    const [selectedAgentId, setSelectedAgentId] = useState<string>(Agents[0].id);
    const [messageText, setMessageText] = useState<string>("");
    const [response, setResponse] = useState<string>("")

    if (chrome.runtime) {
        useEffect(() => {
            const messageListener = (
                request: chrome.contextMenus.OnClickData,
                sender: chrome.runtime.MessageSender,
                sendResponse: (response?: any) => void
            ) => {

                setMessageText(request.selectionText || "");
            };

            chrome.runtime.onMessage.addListener(messageListener);

            // Cleanup listener when component unmounts
            return () => {
                chrome.runtime.onMessage.removeListener(messageListener);
            };
        }, []); // Empty dependency array means this effect runs once on mount

    }

    const agentOptions = agents.map((agent) =>
        <option key={agent.id} value={agent.id}>{agent.name}</option>
    );


    async function onSubmit() {
        const res = await client.invoke(selectedAgentId, messageText)
        console.log(res)
        setResponse(res['response']['graph_output'])
    }

    return (
        <>
            <select
                name="agent"
                id="agents"
                onChange={(event) => { setSelectedAgentId(event.target.value) }}
            >
                {agentOptions}
            </select>
            <p>
                Prompt: {Agents.find(a => a.id == selectedAgentId)?.prompt || "Not found"}
            </p>
            {messageText && (
                <div>
                    <h3>Received Message:</h3>
                    <p>{messageText}</p>
                </div>
            )}
            {response && (
                <div>
                    <h3>Received Response:</h3>
                    <p>{response}</p>
                </div>
            )}

            <button onClick={onSubmit}>Submit</button>
        </>
    );
};

const root = createRoot(document.getElementById("root")!);

root.render(
    <React.StrictMode>
        <SidePanel />
    </React.StrictMode>
);