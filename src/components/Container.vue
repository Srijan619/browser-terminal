<script setup lang="ts">
import CommandPromptInputInstance from './CommandPromptInstance.vue';
</script>

<template>
  <div class="container">
    <CommandPromptInputInstance />
  </div>
</template>

<style scoped>
.container {
  width: 100vw;
  height: 600px;
  background-color: black;
  color: #888;
  display: flex;
  flex-direction: column;
  padding: 0.1rem;
  max-height: 600px;
  overflow: scroll;
}
</style>
