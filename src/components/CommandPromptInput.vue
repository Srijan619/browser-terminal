<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';
import { useCommandPromptStore } from '../stores/globalStore';
import { onUpdated } from 'vue';

const props = defineProps<{
    id: string,
    enabled: boolean;
}>();

const store = useCommandPromptStore();
const currentCommand = ref('');

// Create a reference for the input
const commandInput = ref<HTMLInputElement | null>(null);

// Focus the input on component mount
onMounted(() => {
    focusInput();
});

onUpdated(() => {
    focusInput();
})

// Function to focus the input
const focusInput = () => {
    commandInput.value?.focus();
};

// Handle command input enter
const handleEnter = () => {
    store.handleCommandInputEnter(props.id, currentCommand.value);
};
</script>

<template>
    <input ref="commandInput" class="command-prompt" v-model="currentCommand" @keyup.enter="handleEnter"
        :disabled="!props.enabled" />
</template>

<style scoped>
.command-prompt {
    all: unset;
    flex: 2;
    color: whitesmoke;
}
</style>
