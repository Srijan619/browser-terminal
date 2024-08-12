<template>
    <button @click="togglePanel" class="setting" ref="button">⚙️</button>
    <div class="customization-form" v-if="showPanel" ref="panel">
        <h2>Customize Your Terminal</h2>
        <form>
            <div class="form-group">
                <label for="background-color">Terminal Background Color</label>
                <input id="background-color" type="color" v-model="TERMINAL_BACKGROUND_COLOR" />
            </div>

            <div class="form-group">
                <label for="reply-color">Terminal Reply Color</label>
                <input id="reply-color" type="color" v-model="TERMINAL_REPLY_COLOR" />
            </div>

            <div class="form-group">
                <label for="directory-prompt-color">Directory Prompt Color</label>
                <input id="directory-prompt-color" type="color" v-model="TERMINAL_DIRECTORY_PROMPT_COLOR" />
            </div>

            <div class="form-group">
                <label for="command-prompt-color">Command Prompt Color</label>
                <input id="command-prompt-color" type="color" v-model="TERMINAL_COMMAND_PROMPT_COLOR" />
            </div>

            <div class="form-group">
                <label for="ls-file-color">LS File Color</label>
                <input id="ls-file-color" type="color" v-model="TERMINAL_LS_FILE_COLOR" />
            </div>

            <div class="form-group">
                <label for="ls-folder-color">LS Folder Color</label>
                <input id="ls-folder-color" type="color" v-model="TERMINAL_LS_FOLDER_COLOR" />
            </div>
        </form>
    </div>
</template>
  
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { useCustomizationStore } from '../stores/customizationStore';
import { storeToRefs } from 'pinia'

const store = useCustomizationStore();
const { TERMINAL_BACKGROUND_COLOR,
    TERMINAL_REPLY_COLOR,
    TERMINAL_DIRECTORY_PROMPT_COLOR,
    TERMINAL_COMMAND_PROMPT_COLOR,
    TERMINAL_LS_FILE_COLOR,
    TERMINAL_LS_FOLDER_COLOR } = storeToRefs(store);

const showPanel = ref(false);
const panel = ref<HTMLDivElement | null>(null);
const button = ref<HTMLButtonElement | null>(null);

const togglePanel = () => {
    showPanel.value = !showPanel.value;
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (panel.value && button.value && !panel.value.contains(target) && !button.value.contains(target)) {
        showPanel.value = false;
    }
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
  
<style scoped>
.customization-form {
    max-width: 400px;
    margin: 0 auto;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1000;
}

.setting {
    border: transparent;
    cursor: pointer;
    position: absolute;
    top: 0;
    right: 0;
    margin: 1rem;
    transform: scale(2);
    background-color: transparent;
}

h2 {
    text-align: center;
    margin-bottom: 20px;
    color: #333;
}

.form-group {
    margin-bottom: 15px;
    display: flex;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #555;
    flex: 2;
}

input[type="color"] {
    width: 100%;
    padding: 5px;
    border: 1px solid #ccc;
    border-radius: 4px;
    flex: 1;
}

.save-button {
    width: 100%;
    padding: 10px;
    border: none;
    background-color: #007bff;
    color: white;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s ease;
}

.save-button:hover {
    background-color: #0056b3;
}
</style>
  