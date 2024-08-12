import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { themes } from '../assets/themes';

export const useCustomizationStore = defineStore('customizationStore', () => {
    // Default values
    const TERMINAL_BACKGROUND_COLOR = ref(themes.darkMode.TERMINAL_BACKGROUND_COLOR);
    const TERMINAL_REPLY_COLOR = ref(themes.darkMode.TERMINAL_REPLY_COLOR);
    const TERMINAL_DIRECTORY_PROMPT_COLOR = ref(themes.darkMode.TERMINAL_DIRECTORY_PROMPT_COLOR);
    const TERMINAL_COMMAND_PROMPT_COLOR = ref(themes.darkMode.TERMINAL_COMMAND_PROMPT_COLOR);
    const TERMINAL_LS_FILE_COLOR = ref(themes.darkMode.TERMINAL_LS_FILE_COLOR);
    const TERMINAL_LS_FOLDER_COLOR = ref(themes.darkMode.TERMINAL_LS_FOLDER_COLOR);

    // THEME
    const TERMINAL_DEFAULT_THEME = ref<keyof typeof themes>('darkMode');

    // Method to update the customization values based on a JSON object
    const updateCustomization = (customizationData: Record<string, string>) => {
        if (customizationData.TERMINAL_BACKGROUND_COLOR) {
            TERMINAL_BACKGROUND_COLOR.value = customizationData.TERMINAL_BACKGROUND_COLOR;
        }
        if (customizationData.TERMINAL_REPLY_COLOR) {
            TERMINAL_REPLY_COLOR.value = customizationData.TERMINAL_REPLY_COLOR;
        }
        if (customizationData.TERMINAL_DIRECTORY_PROMPT_COLOR) {
            TERMINAL_DIRECTORY_PROMPT_COLOR.value = customizationData.TERMINAL_DIRECTORY_PROMPT_COLOR;
        }
        if (customizationData.TERMINAL_COMMAND_PROMPT_COLOR) {
            TERMINAL_COMMAND_PROMPT_COLOR.value = customizationData.TERMINAL_COMMAND_PROMPT_COLOR;
        }
        if (customizationData.TERMINAL_LS_FILE_COLOR) {
            TERMINAL_LS_FILE_COLOR.value = customizationData.TERMINAL_LS_FILE_COLOR;
        }
        if (customizationData.TERMINAL_LS_FOLDER_COLOR) {
            TERMINAL_LS_FOLDER_COLOR.value = customizationData.TERMINAL_LS_FOLDER_COLOR;
        }

        // UPDATE THEME
        if (customizationData.TERMINAL_DEFAULT_THEME) {
            TERMINAL_DEFAULT_THEME.value = customizationData.TERMINAL_DEFAULT_THEME as keyof typeof themes;
        }
        saveToLocalStorage();
    };

    // Method to return the current customization settings as a JSON object
    const getCustomizationAsJson = () => {
        return {
            TERMINAL_BACKGROUND_COLOR: TERMINAL_BACKGROUND_COLOR.value,
            TERMINAL_REPLY_COLOR: TERMINAL_REPLY_COLOR.value,
            TERMINAL_DIRECTORY_PROMPT_COLOR: TERMINAL_DIRECTORY_PROMPT_COLOR.value,
            TERMINAL_COMMAND_PROMPT_COLOR: TERMINAL_COMMAND_PROMPT_COLOR.value,
            TERMINAL_LS_FILE_COLOR: TERMINAL_LS_FILE_COLOR.value,
            TERMINAL_LS_FOLDER_COLOR: TERMINAL_LS_FOLDER_COLOR.value,
            TERMINAL_DEFAULT_THEME: TERMINAL_DEFAULT_THEME.value,
        };
    };

    // Method to save the current settings to localStorage
    const saveToLocalStorage = () => {
        const customizationJson = getCustomizationAsJson();
        localStorage.setItem('customizer', JSON.stringify(customizationJson));
    };

    // Initialization: Check if customization settings exist in localStorage
    const initFromLocalStorage = () => {
        const storedCustomization = localStorage.getItem('customizer');
        if (storedCustomization) {
            const customizationData = JSON.parse(storedCustomization);
            updateCustomization(customizationData);
        } else {
            saveToLocalStorage(); // Save the default settings to localStorage
        }
    };

    // Method to apply a predefined theme
    const applyTheme = (themeName: keyof typeof themes) => {
        const theme = themes[themeName];
        updateCustomization(theme);
    };

    // Watch for changes and save them automatically to localStorage
    watch(
        () => getCustomizationAsJson(),
        () => {
            saveToLocalStorage();
        },
        { deep: true }
    );

    // Initialize the store with values from localStorage (if available)
    initFromLocalStorage();

    return {
        TERMINAL_BACKGROUND_COLOR,
        TERMINAL_REPLY_COLOR,
        TERMINAL_DIRECTORY_PROMPT_COLOR,
        TERMINAL_COMMAND_PROMPT_COLOR,
        TERMINAL_LS_FILE_COLOR,
        TERMINAL_LS_FOLDER_COLOR,
        TERMINAL_DEFAULT_THEME,
        updateCustomization,
        getCustomizationAsJson,
        applyTheme,
    };
});
