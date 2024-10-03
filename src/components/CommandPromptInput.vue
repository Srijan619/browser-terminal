<script setup lang="ts">
import { ref, defineProps, onMounted, onUnmounted, computed } from 'vue'
import { useCommandPromptStore } from '../stores/globalStore'
import { sendInputToServer } from '../utils/commandsToServer'
import { Commands } from '../utils/commands.ts'
import SuggestionPrompt from './SuggestionPrompt.vue'

const props = defineProps<{
    id: string
    enabled: boolean
}>()

const store = useCommandPromptStore()
const PROMPT_INSTANCE = store.PROMPT_INSTANCES.find(
    (instance) => instance.id === props.id
)
const currentCommand = ref(PROMPT_INSTANCE?.command || '')

// Create a reference for the input
const commandInput = ref<HTMLInputElement | null>(null)

const showSuggestion = ref(false)

let debounceTimeout: number | undefined

// Debounce function
const debounce = (func: () => void, delay: number) => {
    return () => {
        clearTimeout(debounceTimeout)
        debounceTimeout = window.setTimeout(() => {
            func()
        }, delay)
    }
}
// Focus the input on component mount
onMounted(() => {
    focusInput()
})

const focusInput = () => {
    commandInput.value?.focus()
}

const blurInput = () => {
    commandInput.value?.blur()
}

// Handle command input enter
const handleEnter = () => {
    if (store.TERMINAL_MODE === 'client') {
        console.log('Client mode..')
        store.handleCommandInputEnter(props.id, currentCommand.value)
    } else {
        console.log('Server mode..')
        if (PROMPT_INSTANCE) {
            sendInputToServer(currentCommand.value, PROMPT_INSTANCE)
        }
    }
}

const HISTORY_COUNTER = ref(-1)

const handleShowHistoryUp = () => {
    console.log('Up pressed', store.COMMAND_HISTORY)
    if (store.COMMAND_HISTORY.length === 0) return // No history available

    // Move up in history
    if (HISTORY_COUNTER.value < store.COMMAND_HISTORY.length - 1) {
        HISTORY_COUNTER.value++
        currentCommand.value =
            store.COMMAND_HISTORY[
                store.COMMAND_HISTORY.length - 1 - HISTORY_COUNTER.value
            ].toString()
    }
    focusInput()
}

const handleShowHistoryDown = () => {
    if (store.COMMAND_HISTORY.length === 0 || HISTORY_COUNTER.value <= 0) {
        return // Do nothing if no history has been traversed or reached the end
    }

    // Move down in history
    currentCommand.value =
        store.COMMAND_HISTORY[
            store.COMMAND_HISTORY.length - HISTORY_COUNTER.value
        ].toString()
    HISTORY_COUNTER.value--
    focusInput()
}

const handleSuggestion = () => {
    console.log(
        'Showing suggestion',
        filterCommandsThatStartWithCurrentCommand.value
    )
    showSuggestion.value =
        filterCommandsThatStartWithCurrentCommand.value.length > 0
}

const filterCommandsThatStartWithCurrentCommand = computed(() => {
    return Commands.filter((command) => {
        return command.startsWith(currentCommand.value)
    })
})

const handleSelectedSuggestion = (suggestion: string) => {
    currentCommand.value = suggestion
    handleHideSuggestion()
}

const handleHideSuggestion = () => {
    showSuggestion.value = false
    focusInput()
}
</script>

<template>
    <div class="command-prompt-container">
        <input
            ref="commandInput"
            class="command-prompt"
            v-model="currentCommand"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            @keydown.enter="handleEnter"
            @keydown.up.prevent="handleShowHistoryUp"
            @keydown.down.prevent="handleShowHistoryDown"
            @keydown.tab.prevent="handleSuggestion"
            @keydown.esc="handleHideSuggestion"
            :disabled="!props.enabled"
        />
        <SuggestionPrompt
            v-if="showSuggestion"
            :suggestions="filterCommandsThatStartWithCurrentCommand"
            @select="handleSelectedSuggestion"
            @hide-suggestion="handleHideSuggestion"
        />
    </div>
</template>

<style scoped>
.command-prompt {
    all: unset;
    flex: 2;
    white-space: nowrap;
}

.command-prompt-container {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
}
</style>
