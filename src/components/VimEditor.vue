<template>
    <div ref="editor" class="editor" v-if="VIM_EDITOR_VISIBLE"></div>
</template>

<script setup lang="ts">
import { onMounted, ref, onBeforeUnmount } from 'vue'
import { basicSetup } from 'codemirror'
import { EditorView, lineNumbers, highlightActiveLine } from '@codemirror/view'
import { markdown } from '@codemirror/lang-markdown'
import { javascript } from '@codemirror/lang-javascript'
import { history } from '@codemirror/commands'
import { vim, Vim } from '@replit/codemirror-vim'

import { useFilesStore } from '../stores/filesStore'
import { useCommandPromptStore } from '../stores/globalStore'
import { storeToRefs } from 'pinia'

// Store references
const filesStore = useFilesStore()
const globalStore = useCommandPromptStore()
const { VIM_EDITOR_VISIBLE, VIM_EDITOR_CONTENT, VIM_EDITOR_FILENAME } =
    storeToRefs(globalStore)

const editor = ref<HTMLDivElement | null>(null)
let cm: EditorView | null = null

// Function to save the file
function saveFile() {
    if (cm) {
        filesStore.saveFile(VIM_EDITOR_FILENAME.value, cm.state.doc.toString())
    }
}

// Function to quit the editor (remove it from the DOM)
function quitEditor() {
    if (cm) {
        VIM_EDITOR_VISIBLE.value = false
        cm.destroy() // Clean up the editor instance
        cm = null
    }
}

// Function to define custom Vim commands
function defineVimCommands() {
    Vim.defineEx('write', 'w', saveFile)
    Vim.defineEx('quit', 'q', quitEditor)
    Vim.defineEx('wq', 'wq', () => {
        saveFile()
        quitEditor()
    })
}

onMounted(() => {
    const extensions = [
        lineNumbers(),
        highlightActiveLine(),
        history(),
        vim(),
        basicSetup,
    ]

    // Add the appropriate language extension based on the file type
    const fileType = VIM_EDITOR_FILENAME.value.split('.').pop() // Get the file extension
    if (fileType === 'md') {
        extensions.push(markdown())
    } else if (fileType === 'js') {
        extensions.push(javascript())
    }
    cm = new EditorView({
        doc: VIM_EDITOR_CONTENT.value,
        extensions,
        parent: editor.value!,
    })

    console.log(cm)
    cm.focus()
    // Define custom Vim commands
    defineVimCommands()
})

onBeforeUnmount(() => {
    quitEditor()
})
</script>

<style scoped>
.editor {
    width: 100vw;
    height: 100vh;
    border: 1px solid #ddd;
    font-family: 'monospace';
}
</style>
