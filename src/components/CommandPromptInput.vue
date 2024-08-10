<script setup lang="ts">
import { ref, defineProps, onMounted } from 'vue';
import { useCommandPromptStore } from '../stores/globalStore'

const props = defineProps<{
    id: number,
    command: string;
    enabled: boolean;
}>();

const store = useCommandPromptStore()
const currentCommand = ref(props.command);


// Create a reference for the input
const commandInput = ref<HTMLInputElement | null>(null);

// Focus the input on component mount
onMounted(() => {
    commandInput.value?.focus(); // Ensure the input is focused
});
</script>

<template>
    <input ref="commandInput" class="command-prompt" v-model="currentCommand"
        @keyup.enter="store.handleCommandInputEnter(props.id)" :disabled="!enabled" />
</template>

<style scoped>
.command-prompt {
    all: unset;
    flex: 2;
}
</style>
