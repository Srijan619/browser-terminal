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
    // As we constantly put focus to input, add selection change to allow user to select text if it is needed
    document.addEventListener('selectionchange', handleSelectionChange)
    focusInput()
})

// Cleanup event listeners
onUnmounted(() => {
    document.removeEventListener('selectionchange', handleSelectionChange)
})

// Function to focus the input
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

// Handle selection change
const handleSelectionChange = debounce(() => {
    const selection = window.getSelection()
    if (selection && selection.toString().length > 0) {
        blurInput()
    } else {
        focusInput()
    }
}, 300) // Adjust the delay as needed

const HISTORY_COUNTER = ref(-1)

const handleShowHistoryUp = () => {
    if (store.COMMAND_HISTORY.length === 0) return // No history available

    blurInput()
    // Move up in history
    if (HISTORY_COUNTER.value < store.COMMAND_HISTORY.length - 1) {
        HISTORY_COUNTER.value++
        currentCommand.value =
            store.COMMAND_HISTORY[
                store.COMMAND_HISTORY.length - 1 - HISTORY_COUNTER.value
            ].toString()
    }
}

const handleShowHistoryDown = () => {
    if (store.COMMAND_HISTORY.length === 0 || HISTORY_COUNTER.value <= 0) {
        return // Do nothing if no history has been traversed or reached the end
    }

    blurInput()
    // Move down in history
    currentCommand.value =
        store.COMMAND_HISTORY[
            store.COMMAND_HISTORY.length - HISTORY_COUNTER.value
        ].toString()
    HISTORY_COUNTER.value--
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
    console.log('Selected suggestion:', suggestion)
    currentCommand.value = suggestion
    handleHideSuggestion()
}

const handleHideSuggestion = () => {
    console.log('Hide suggestion')
    showSuggestion.value = false
}
</script>

<template>
    <div>
        <input
            ref="commandInput"
            class="command-prompt"
            v-model="currentCommand"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            @keyup.enter="handleEnter"
            @keyup.up.prevent="handleShowHistoryUp"
            @keyup.down.prevent="handleShowHistoryDown"
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
    /* Prevent line wrapping */
}
</style>
