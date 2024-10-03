<script setup lang="ts">
import { defineProps, ref, onMounted, onBeforeUnmount, defineEmits } from 'vue'

const props = defineProps<{
    suggestions?: string[] | null
}>()

const emit = defineEmits<{
    (e: 'select', suggestion: string): void
    (e: 'hide-suggestion'): void
}>()

const focusedIndex = ref(0)
const suggestionRef = ref<HTMLElement | null>(null)

// Function to handle key events
const handleKeyDown = (event: KeyboardEvent) => {
    if (props.suggestions) {
        if (event.key === 'Tab') {
            event.preventDefault()

            if (suggestionRef.value) {
                suggestionRef.value.focus()
            }

            focusedIndex.value =
                (focusedIndex.value + 1) % props.suggestions.length
        } else if (event.key === 'Enter') {
            selectSuggestion(props.suggestions[focusedIndex.value])
        } else if (event.key === 'Escape') {
            emit('hide-suggestion')
        }
    }
}

// Function to detect clicks outside the component
const handleClickOutside = (event: MouseEvent) => {
    if (
        suggestionRef.value &&
        !suggestionRef.value.contains(event.target as Node)
    ) {
        emit('hide-suggestion')
    }
}

// Set up the event listener when the component is mounted
onMounted(() => {
    if (suggestionRef.value) {
        suggestionRef.value.focus()
    }
    document.addEventListener('click', handleClickOutside)
})

// Clean up the event listener when the component is unmounted
onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside)
})

const selectSuggestion = (suggestion: string) => {
    emit('select', suggestion)
}
</script>

<template>
    <div
        class="suggestion-prompt"
        @keydown="handleKeyDown"
        tabindex="0"
        ref="suggestionRef"
        role="listbox"
        aria-label="Command suggestions"
    >
        <div class="suggestion-list">
            <span
                class="suggestion-single"
                v-for="(suggestion, index) in props.suggestions"
                :key="index"
                :class="{ focused: index === focusedIndex }"
            >
                {{ suggestion }}
            </span>
        </div>
    </div>
</template>

<style>
.suggestion-prompt {
    color: inherit;
    margin: 0.1rem;
    padding: 0.2rem;
    width: fit-content;
}

.suggestion-list {
    display: flex;
    flex-wrap: wrap;
}

.suggestion-single {
    margin: 0.5rem;
}

span.focused {
    color: black;
    background-color: #e0e0e0;
    border-color: #007bff;
    padding: 0.3rem;
    border-radius: 0.3rem;
    box-shadow:
        rgba(0, 0, 0, 0.1) 0px 4px 6px -1px,
        rgba(0, 0, 0, 0.06) 0px 2px 4px -1px;
}
</style>
