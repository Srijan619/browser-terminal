<script setup lang="ts">
import { ref, watch } from 'vue';
import { useCommandPromptStore } from '../stores/globalStore';

// Get the store
const store = useCommandPromptStore();

// Create a ref for the selected terminal mode
const selectedMode = ref(store.TERMINAL_MODE);

// Watch for changes in selectedMode and update the store accordingly
watch(selectedMode, (newMode) => {
    store.TERMINAL_MODE = newMode;
    store.reset();
    store.createMessagePrompt("Welcome to terminal: " + newMode)
    store.createNewPromptInstanceAndDisablePreviousInstance();
});
</script>

<template>
    <div class="dropdown-container">
        <select v-model="selectedMode" class="styled-dropdown">
            <option value="client">Client</option>
            <option value="server">Server</option>
        </select>
    </div>
</template>

<style scoped>
/* Container for the dropdown */
.dropdown-container {
    display: inline-block;
    position: relative;
}

/* Style the dropdown */
.styled-dropdown {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    background-color: #ffffff;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 10px 30px 10px 15px;
    font-size: 16px;
    color: #333;
    cursor: pointer;
    outline: none;
    transition: border-color 0.3s ease;
}

/* Add a custom arrow */
.styled-dropdown::after {
    content: '\25BC';
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    font-size: 12px;
    color: #666;
}

/* Change border color on focus */
.styled-dropdown:focus {
    border-color: #007bff;
}

/* Hover effect */
.styled-dropdown:hover {
    border-color: #007bff;
}

/* Change background on selection */
.styled-dropdown option:checked {
    background-color: #f0f0f0;
}
</style>
