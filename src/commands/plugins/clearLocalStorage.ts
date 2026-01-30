import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'

export const clearLocalStorageCommand: CommandPlugin = {
    name: 'clearLocalStorage',
    description: 'Clear local storage',
    execute: (args: string[], prompt: PromptInstance) => {
        localStorage.clear()
    }
}
