<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    reply: string;
}>();
</script>

<template>
    <div class="reply-prompt" v-html="reply"></div>
</template>

<style>
.reply-prompt {
    color: inherit;
    margin-right: 0.1rem;
    margin-left: 1rem;
}
</style>
