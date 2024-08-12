import { io, Socket } from 'socket.io-client';
import { PromptInstance } from '../types';
import { useCommandPromptStore } from '../stores/globalStore';

let socket: Socket | null = null;
let PROMPT_INSTANCE: PromptInstance;

const getCommandPromptStore = () => {
    return useCommandPromptStore();
};

const initializeSocket = () => {
    if (!socket && getCommandPromptStore().TERMINAL_MODE === 'server') {
        socket = io('http://localhost:3000'); // Connect to the server

        // Handle output from the server
        socket.on('output', (data: string) => {
            if (getCommandPromptStore().TERMINAL_MODE !== 'server') return;
            console.log('Client: Output from server', data);
            PROMPT_INSTANCE.reply = data;
            getCommandPromptStore().createNewPromptInstanceAndDisablePreviousInstance(PROMPT_INSTANCE);
        });

        socket.on('dirChangeFound', (data: string) => {
            if (getCommandPromptStore().TERMINAL_MODE !== 'server') return;
            console.log('Client: Directory change found');
            getCommandPromptStore().CURRENT_DIR = data;
            getCommandPromptStore().createNewPromptInstanceAndDisablePreviousInstance(PROMPT_INSTANCE);
        });
    }
};

const sendInputToServer = (input: string, promptInstance: PromptInstance) => {
    if (getCommandPromptStore().TERMINAL_MODE !== 'server') {
        console.warn('Terminal is not in server mode. No command will be sent to the server.');
        return;
    }

    // Initialize socket if not already connected
    initializeSocket();

    PROMPT_INSTANCE = promptInstance;

    // Use the handleCommandInputEnterServer method
    getCommandPromptStore().handleCommandInputEnterServer(promptInstance.id, input, async () => socket?.emit('command', input));
};

export { sendInputToServer };
