<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{
    currentDir: string;
}>();

</script>

<template>
    <span class="directory-prompt">{{ currentDir }} >&nbsp;</span>
</template>

<style scoped>
.directory-prompt {
    margin-right: 0.1rem;
}
</style>
