import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useCommandPromptStore } from '../../stores/globalStore'

export const clearCommand: CommandPlugin = {
    name: 'clear',
    description: 'Clear the terminal screen',
    execute: (args: string[], prompt: PromptInstance) => {
        useCommandPromptStore().PROMPT_INSTANCES = []
    }
}
