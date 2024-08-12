<template>
    <div class="main-container">
        <button @click="togglePanel" class="setting" ref="button">⚙️</button>
        <div class="customization-form" v-if="showPanel" ref="panel">
            <h2>Customize Your Terminal</h2>
            <form>
                <div class="form-group">
                    <label for="background-color">Default Theme</label>
                    <select @change="applyTheme" v-model="selectedTheme">
                        <option v-for="theme in availableThemes" :key="theme">{{ theme }}
                        </option>
                    </select>
                </div>
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
    </div>
</template>
  
<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue';
import { useCustomizationStore } from '../stores/customizationStore';
import { themes } from '../assets/themes';
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
const selectedTheme = ref(store.TERMINAL_DEFAULT_THEME);

const togglePanel = () => {
    if (button.value?.classList.contains('circle-animation')) {
        button.value.classList.remove('circle-animation');
    } else {
        button.value?.classList.add('circle-animation');
    }
    showPanel.value = !showPanel.value;
};

// Click outside handler
const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as Node;
    if (panel.value && button.value && !panel.value.contains(target) && !button.value.contains(target)) {
        togglePanel()
    }
};

const availableThemes = computed(() => {
    return Object.keys(themes);
})

const applyTheme = (event: Event) => {
    const target = event.target as HTMLSelectElement; // Type assertion here
    const themeName = target.value as keyof typeof themes;
    store.applyTheme(themeName);
};

onMounted(() => {
    document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
});
</script>
  
<style scoped>
.main-container {
    position: absolute;
    top: 0;
    right: 0;
    max-width: 400px;
    margin: 0 auto;
}

.customization-form {
    width: 400px;
    max-width: 400px;
    padding: 20px;
    background-color: #f7f7f7;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    position: absolute;
    right: 0;
    z-index: 1000;
    opacity: 0;
    /* Start with the form hidden */
    transform: scale(0.5);
    /* Start with a smaller scale */
    animation: popIn 0.5s forwards;
    /* Change animation duration as needed */
}

@keyframes popIn {
    0% {
        opacity: 0;
        transform: scale(0.5);
        /* Start small */
    }

    50% {
        opacity: 0.5;
        /* Fade in */
    }

    100% {
        opacity: 1;
        transform: scale(1);
        /* End at normal scale */
    }
}

.setting {
    border: transparent;
    cursor: pointer;
    position: relative;
    margin: 1rem;
    transform: scale(1.5);
    background-color: transparent;
}

.setting.circle-animation {
    animation: mymove 5s .5;

}

@keyframes mymove {
    50% {
        transform: rotate(180deg) scale(1.5);
    }
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

select {
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
  