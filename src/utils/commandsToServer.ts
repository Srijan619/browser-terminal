

import { io } from 'socket.io-client'
import { PromptInstance } from "../types";
import { useCommandPromptStore } from '../stores/globalStore';

const socket = io('http://localhost:3000'); // Connect to the server

let PROMPT_INSTANCE: PromptInstance;

const getCommandPromptStore = () => {
    return useCommandPromptStore();
};

const sendInputToServer = (input: string, promptInstance: PromptInstance) => {
    PROMPT_INSTANCE = promptInstance;

    // Use the handleCommandInputEnterServer method
    getCommandPromptStore().handleCommandInputEnterServer(promptInstance.id, input, () => socket.emit('command', input));
};

// Handle output from the server
socket.on('output', (data: string) => {
    console.log("Client: Output from server", data);
    PROMPT_INSTANCE.reply = data; // Assuming reply is of type string
    getCommandPromptStore().createNewPromptInstanceAndDisablePreviousInstance(PROMPT_INSTANCE);
});

socket.on('dirChangeFound', (data: string) => {
    console.log("CLient dir change")
    //PROMPT_INSTANCE.reply = data; // Assuming reply is of type string
    getCommandPromptStore().CURRENT_DIR = data;
    getCommandPromptStore().createNewPromptInstanceAndDisablePreviousInstance(PROMPT_INSTANCE);
});


export { sendInputToServer }