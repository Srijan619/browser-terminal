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
    color: rgb(230, 230, 250);
    margin-right: 0.1rem;
    margin-left: 1rem;
}
</style>
