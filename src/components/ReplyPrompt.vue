<script setup lang="ts">
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
}

.bird {
    font-size: 20px;
}
</style>
