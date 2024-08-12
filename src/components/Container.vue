<script setup lang="ts">
import CommandPromptInputInstance from './CommandPromptInstance.vue';
import { useCustomizationStore } from '../stores/customizationStore';
import { storeToRefs } from 'pinia'

const store = useCustomizationStore();
const { TERMINAL_BACKGROUND_COLOR, TERMINAL_REPLY_COLOR, TERMINAL_DIRECTORY_PROMPT_COLOR, TERMINAL_COMMAND_PROMPT_COLOR } = storeToRefs(store);
</script>

<template>
  <div class="container">
    <CommandPromptInputInstance />
  </div>
</template>

<style>
.container {
  width: min-content;
  height: 600px;
  background-color: v-bind(TERMINAL_BACKGROUND_COLOR);
  color: v-bind(TERMINAL_REPLY_COLOR);
  display: flex;
  flex-direction: column;
  padding: 0.1rem;
  max-height: 600px;
  overflow-y: scroll;
}

.directory-prompt {
  color: v-bind(TERMINAL_DIRECTORY_PROMPT_COLOR);
}

.command-prompt {
  color: v-bind(TERMINAL_COMMAND_PROMPT_COLOR);
}
</style>
