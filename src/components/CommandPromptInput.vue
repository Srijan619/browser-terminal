<script setup lang="ts">
import { ref, defineProps, onMounted, onUnmounted } from 'vue';
import { useCommandPromptStore } from '../stores/globalStore';
import { onUpdated } from 'vue';
import { sendInputToServer } from '../utils/commandsToServer';


const props = defineProps<{
    id: string,
    enabled: boolean;
}>();

const store = useCommandPromptStore();
const currentCommand = ref('');
const isFocused = ref(true);
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
    document.addEventListener('selectionchange', handleSelectionChange);
    focusInput();
});

// Cleanup event listeners
onUnmounted(() => {
    document.removeEventListener('selectionchange', handleSelectionChange);
});

onUpdated(() => {
    focusInput();
})

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

</script>

<template>
    <input ref="commandInput" class="command-prompt" v-model="currentCommand" autocorrect="off" autocapitalize="off"
        spellcheck="false" @keyup.enter="handleEnter" :disabled="!props.enabled" @blur="isFocused = false"
        @focus="isFocused = true" />
</template>

<style scoped>
.command-prompt {
    all: unset;
    flex: 2;
    color: whitesmoke;
    white-space: nowrap;
    /* Prevent line wrapping */
}
</style>
