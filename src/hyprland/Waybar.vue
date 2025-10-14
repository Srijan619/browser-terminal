<script setup lang="ts">
import { useCustomizationStore } from '../stores/customizationStore'
import { useCommandPromptStore } from '../stores/globalStore'
import { storeToRefs } from 'pinia'

const customizationStore = useCustomizationStore()
const globalStore = useCommandPromptStore()

const {
    TERMINAL_BACKGROUND_COLOR,
    TERMINAL_REPLY_COLOR,
    TERMINAL_DIRECTORY_PROMPT_COLOR,
    TERMINAL_COMMAND_PROMPT_COLOR,
} = storeToRefs(customizationStore)
</script>

<template>
    <div class="container">
        <h1>Waybar</h1>
    </div>
</template>

<style>
.container {
    height: 100vh;
    background-color: v-bind(TERMINAL_BACKGROUND_COLOR);
    color: v-bind(TERMINAL_REPLY_COLOR);
    display: flex;
    flex-direction: column;
    padding: 0.1rem;
    overflow-y: scroll;
}

.directory-prompt {
    color: v-bind(TERMINAL_DIRECTORY_PROMPT_COLOR);
}

.command-prompt {
    color: v-bind(TERMINAL_COMMAND_PROMPT_COLOR);
}
</style>
