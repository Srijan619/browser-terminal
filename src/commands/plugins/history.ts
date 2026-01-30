import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useCommandPromptStore } from '../../stores/globalStore'
import { marked } from 'marked'

export const historyCommand: CommandPlugin = {
    name: 'history',
    description: 'Show command history',
    execute: (args: string[], prompt: PromptInstance) => {
        prompt.reply = marked
            .parse(useCommandPromptStore().COMMAND_HISTORY.join('<br>'))
            .toString()
    }
}
