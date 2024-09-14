<script setup lang="ts">
import DirectoryCommandPrompt from './DirectoryCommandPrompt.vue';
import ReplyPrompt from './ReplyPrompt.vue';

import { useCommandPromptStore } from '../stores/globalStore'
import { storeToRefs } from 'pinia'

const store = useCommandPromptStore()
const { PROMPT_INSTANCES } = storeToRefs(store)
</script>

<template>
    <div class="single-instance" v-for="instance in PROMPT_INSTANCES" :key="instance.id">
        <DirectoryCommandPrompt :id="instance.id" :command="instance.command" :currentDir="instance.currentDir"
            :enabled="instance.enabled" />
        <ReplyPrompt :reply="instance.reply" v-if="instance.reply" />
    </div>
</template>

<style scoped>
.single-instance {
    margin-left: 1rem;
}
</style>
