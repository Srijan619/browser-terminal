import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCustomizationStore = defineStore('customizationStore', () => {
    const TERMINAL_BACKGROUND_COLOR = ref('#000000');
    const TERMINAL_REPLY_COLOR = ref('#e6e6fa');
    const TERMINAL_DIRECTORY_PROMPT_COLOR = ref('#07bd07');
    const TERMINAL_COMMAND_PROMPT_COLOR = ref('#f5f5f5');
    const TERMINAL_LS_FILE_COLOR = ref('#dbff00');
    const TERMINAL_LS_FOLDER_COLOR = ref('#007bff');

    return { TERMINAL_BACKGROUND_COLOR, TERMINAL_REPLY_COLOR, TERMINAL_DIRECTORY_PROMPT_COLOR, TERMINAL_COMMAND_PROMPT_COLOR, TERMINAL_LS_FILE_COLOR, TERMINAL_LS_FOLDER_COLOR };
});
