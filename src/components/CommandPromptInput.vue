<script setup lang="ts">
import { ref, defineProps, onMounted, onUnmounted } from 'vue';
import { useCommandPromptStore } from '../stores/globalStore';
import { sendInputToServer } from '../utils/commandsToServer';


const props = defineProps<{
    id: string,
    enabled: boolean;
}>();

const store = useCommandPromptStore();
const currentCommand = ref('');
const PROMPT_INSTANCE = store.PROMPT_INSTANCES.find(instance => instance.id === props.id);

// Create a reference for the input
const commandInput = ref<HTMLInputElement | null>(null);

let debounceTimeout: number | undefined;

// Debounce function
const debounce = (func: () => void, delay: number) => {
    return () => {
        clearTimeout(debounceTimeout);
        debounceTimeout = window.setTimeout(() => {
            func();
        }, delay);
    };
};
// Focus the input on component mount
onMounted(() => {
    // As we constantly put focus to input, add selection change to allow user to select text if it is needed
    document.addEventListener('selectionchange', handleSelectionChange);
    focusInput();
});

// Cleanup event listeners
onUnmounted(() => {
    document.removeEventListener('selectionchange', handleSelectionChange);
});

// onUpdated(() => {
//     focusInput();
// })

// Function to focus the input
const focusInput = () => {
    commandInput.value?.focus();
};

const blurInput = () => {
    commandInput.value?.blur();
};

// Handle command input enter
const handleEnter = () => {
    if (store.TERMINAL_MODE === 'client') {
        console.log("Client mode..")
        store.handleCommandInputEnter(props.id, currentCommand.value);
    } else {
        console.log("Server mode..")
        if (PROMPT_INSTANCE) {
            sendInputToServer(currentCommand.value, PROMPT_INSTANCE)
        }
    }
};

// Handle selection change
const handleSelectionChange = debounce(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) {
        blurInput();
    } else {
        focusInput();
    }
}, 300); // Adjust the delay as needed

const HISTORY_COUNTER = ref(-1);

const handleShowHistoryUp = () => {
    if (store.COMMAND_HISTORY.length === 0) return; // No history available

    blurInput();
    // Move up in history
    if (HISTORY_COUNTER.value < store.COMMAND_HISTORY.length - 1) {
        HISTORY_COUNTER.value++;
        currentCommand.value = store.COMMAND_HISTORY[store.COMMAND_HISTORY.length - 1 - HISTORY_COUNTER.value].toString();
    }
};

const handleShowHistoryDown = () => {
    if (store.COMMAND_HISTORY.length === 0 || HISTORY_COUNTER.value <= 0) {
        return; // Do nothing if no history has been traversed or reached the end
    }

    blurInput();
    // Move down in history
    currentCommand.value = store.COMMAND_HISTORY[store.COMMAND_HISTORY.length - HISTORY_COUNTER.value].toString();
    HISTORY_COUNTER.value--;
};


</script>

<template>
    <input ref="commandInput" class="command-prompt" v-model="currentCommand" autocorrect="off" autocapitalize="off"
        spellcheck="false" @keyup.enter="handleEnter" @keyup.up.prevent="handleShowHistoryUp"
        @keyup.down.prevent="handleShowHistoryDown" :disabled="!props.enabled" />
</template>

<style scoped>
.command-prompt {
    all: unset;
    flex: 2;
    white-space: nowrap;
    /* Prevent line wrapping */
}
</style>
