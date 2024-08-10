import { defineStore } from 'pinia'
import { ref, Ref } from 'vue'

// Define the PromptInstance interface with Ref types
interface PromptInstance {
    id: number;
    command: string;
    reply: string;
    currentDir: string;
    enabled: boolean;
}

export const useCommandPromptStore = defineStore('commandPrompt', () => {
    const VALID_COMMANDS = ['ls', 'cd', 'pwd'];
    const BAD_COMMAND_ERROR_MESSAGE = 'Command not found!';
    const PROMPT_INSTANCES = ref<PromptInstance[]>([]);

    // Function to create a new prompt instance
    const createNewPromptInstance = (): void => {
        // Explicitly assert the type with "as PromptInstance"
        const newPrompt = {
            id: PROMPT_INSTANCES.value.length + 1,
            command: '',
            reply: '',
            currentDir: '~',
            enabled: true,

        } as PromptInstance;  // Type assertion

        PROMPT_INSTANCES.value.push(newPrompt);
    };

    // Function to check if the command is allowed
    const isInputCommandAllowed = (command: string): boolean => {
        if (!command) return false;
        const prefixFromCommand = command.split(' ')[0];
        return VALID_COMMANDS.includes(prefixFromCommand);
    };

    // Function to handle the enter keypress for a specific prompt
    const handleCommandInputEnter = (promptId: number): void => {
        debugger
        const promptInstance = PROMPT_INSTANCES.value.find(instance => instance.id === promptId);
        if (!promptInstance) return;

        if (!isInputCommandAllowed(promptInstance.command)) {
            promptInstance.reply = BAD_COMMAND_ERROR_MESSAGE;
        } else {
            promptInstance.reply = "Command found";
        }
        createNewPromptInstance(); // Create a new prompt after handling input
        promptInstance.enabled = false; // Disable input after handling input
    };

    // Initialize the first prompt instance
    createNewPromptInstance();

    return { PROMPT_INSTANCES, handleCommandInputEnter };
});
