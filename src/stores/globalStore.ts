import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid';
import { PromptInstance } from '../types';
import { handleCommand, CURRENT_DIR } from '../utils/commands';

export const useCommandPromptStore = defineStore('commandPrompt', () => {
    const PROMPT_INSTANCES = ref<PromptInstance[]>([]);

    // Function to create a new prompt instance
    const createNewPromptInstance = (): void => {
        const newPrompt = {
            id: uuidv4(),
            command: '',
            reply: '',
            currentDir: CURRENT_DIR,
            enabled: true,
        } as PromptInstance;

        PROMPT_INSTANCES.value.push(newPrompt);
    };

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
    createNewPromptInstance();

    return { PROMPT_INSTANCES, handleCommandInputEnter };
});
