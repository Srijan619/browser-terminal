import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { PromptInstance } from '../types';
import { handleCommand, CURRENT_DIR } from '../utils/commands';
import { WELCOME_MESSAGE } from "../staticMessages/welcomeMessage";
import { marked } from 'marked';

export const useCommandPromptStore = defineStore('commandPrompt', () => {
    const PROMPT_INSTANCES = ref<PromptInstance[]>([]);

    const emptyPromptInstance = (): PromptInstance => {
        return {
            id: uuidv4(),
            command: '',
            reply: '',
            currentDir: CURRENT_DIR,
            enabled: true,
        } as PromptInstance;
    }
    // Function to create a new prompt instance
    const createNewPromptInstance = (): void => {
        PROMPT_INSTANCES.value.push(emptyPromptInstance());
    };

    const createWelcomeMessagePrompt = (): void => {
        const messagePromptInstance = emptyPromptInstance();
        messagePromptInstance.enabled = false;
        messagePromptInstance.reply = marked.parse(WELCOME_MESSAGE).toString();
        PROMPT_INSTANCES.value.push(messagePromptInstance);
    }

    // Function to handle the enter keypress for a specific prompt
    const handleCommandInputEnter = (promptId: string, currentCommand: string): void => {
        const promptInstance = PROMPT_INSTANCES.value.find(instance => instance.id === promptId);
        if (!promptInstance) return;

        // Set the current command to the prompt instance
        promptInstance.command = currentCommand;
        handleCommand(promptInstance);

        // Create a new prompt after handling input
        createNewPromptInstance();
        promptInstance.enabled = false; // Disable input after handling input
    };

    // Initialize the first prompt instance
    createWelcomeMessagePrompt();
    createNewPromptInstance();

    return { PROMPT_INSTANCES, handleCommandInputEnter };
});
