<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    reply: string;
}>();
</script>

<template>
    <span class="reply-prompt">{{ reply }}</span>
</template>

<style scoped>
.reply-prompt {
    color: rgb(234, 229, 82);
    margin-right: 0.1rem;
}
</style>
