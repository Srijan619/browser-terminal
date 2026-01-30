import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useCommandPromptStore } from '../../stores/globalStore'

export const pwdCommand: CommandPlugin = {
    name: 'pwd',
    description: 'Print working directory',
    execute: (args: string[], prompt: PromptInstance) => {
        prompt.reply = useCommandPromptStore().CURRENT_DIR
    }
}
