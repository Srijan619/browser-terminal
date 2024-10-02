<script setup lang="ts">
import { defineProps, ref, onMounted, defineEmits } from 'vue'

const props = defineProps<{
    suggestions?: string[] | null
}>()

const emit = defineEmits<{
    (e: 'select', suggestion: string): void
    (e: 'hide-suggestion'): void
}>()

const focusedIndex = ref(0)
const suggestionRef = ref<HTMLElement | null>(null)

// Focus the suggestion component on Tab key press
const handleKeyDown = (event: KeyboardEvent) => {
    if (props.suggestions) {
        if (event.key === 'Tab') {
            event.preventDefault() // Prevent the default tabbing behavior

            // Focus the suggestion component if it's not already focused
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
onMounted(() => {
    console.log('I am mounting...', suggestionRef.value)
    if (suggestionRef.value) {
        suggestionRef.value.focus()
    }
})

const selectSuggestion = (suggestion: string) => {
    emit('select', suggestion) // Emit the selected suggestion
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
    margin-right: 0.1rem;
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
    background-color: #e0e0e0; /* Highlight the focused suggestion */
    border-color: #007bff; /* Change border color when focused */
}
</style>
