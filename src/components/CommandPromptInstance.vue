<script setup lang="ts">
import DirectoryCommandPrompt from './DirectoryCommandPrompt.vue';
import ReplyPrompt from './ReplyPrompt.vue';

import { useCommandPromptStore } from '../stores/globalStore'
import { storeToRefs } from 'pinia'
// access the `store` variable anywhere in the component ✨
const store = useCommandPromptStore()
const { PROMPT_INSTANCES } = storeToRefs(store)
console.log(PROMPT_INSTANCES)
</script>

<template>
    <div v-for="instance in PROMPT_INSTANCES" :key="instance.id">
        <DirectoryCommandPrompt :id="instance.id" :command="instance.command" :currentDir="instance.currentDir"
            :enabled="instance.enabled" />
        <ReplyPrompt :reply="instance.reply" />
    </div>
</template>

<style scoped></style>
