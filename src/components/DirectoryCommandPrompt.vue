<script setup lang="ts">
import DirectoryPrompt from './DirectoryPrompt.vue';
import CommandPromptInput from './CommandPromptInput.vue';
import { defineProps } from 'vue';

defineProps<{
    id: number;
    command: string;
    currentDir: string;
    enabled: boolean;
}>();
</script>

<template>
    <div class="single-prompt-card">
        <DirectoryPrompt :currentDir="currentDir" />
        <CommandPromptInput :id="id" :command="command" :enabled="enabled" />
    </div>
</template>

<style scoped>
.single-prompt-card {
    width: 100vw;
    height: fit-content;
    display: flex;
    flex-direction: row;
}
</style>
