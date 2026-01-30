import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useFilesStore } from '../../stores/filesStore'

const isFile = (fileName: string): boolean => {
    const validExtensions = ['txt', 'md', 'pem', 'js']
    const parts = fileName.split('.')
    if (parts.length <= 1) return false
    const extension = parts.pop()
    if (!extension) return false
    return validExtensions.includes(extension.toLowerCase())
}

const getFileRecursively = (
    name: string,
    currentDirContent: any = useFilesStore().AVAILABLE_DIRS
): any => {
    // This logic in original was slightly circular or reused. 
    // Simplified strictly for CAT usage based on original implementation context.
    // Original implementation of getFileRecursively seemed to search directories.
    // However, for CAT valid file content retrieval, we need to access file content.
    // The original cat command:
    // } else if (getFileRecursively(file)) {
    //    const fileContent = getFileRecursively(file)
    //    PROMPT_INSTANCE.reply = fileContent.toString()

    // In original code `getFileRecursively` returned directory content array OR file content?
    // Let's look at `useFilesStore().getFile` usage in VIM command.
    // It seems `useFilesStore` has better methods. 
    // BUT `getFileRecursively` in `commands.ts` was returning arrays for directories. 
    // Wait, the original `handleCatCommand` relied on `getFileRecursively`. 
    // Let's create a local helper that mirrors the original behavior for now to be safe, 
    // or better, use `useFilesStore` methods if clearer.

    // Re-implementing original `getFileRecursively` behavior from commands.ts:
    if (!currentDirContent) return []
    const content = currentDirContent.get(name)
    if (content) return content
    for (const [, value] of currentDirContent) {
        if (value instanceof Map) {
            const result = getFileRecursively(name, value)
            if (result) return result
        }
    }
    return undefined // altered from [] to undefined to differentiate not found vs empty
}

export const catCommand: CommandPlugin = {
    name: 'cat',
    description: 'Concatenate and display file content',
    execute: (args: string[], prompt: PromptInstance) => {
        const file = args[0]
        if (!file) {
            prompt.reply = 'Please provide file name to view!'
        } else if (!isFile(file)) {
            prompt.reply = 'Not a file!'
        } else {
            const fileContent = getFileRecursively(file)
            if (fileContent) {
                prompt.reply = fileContent.toString()
            } else {
                prompt.reply = `No such file: ${file}`
            }
        }
    }
}
