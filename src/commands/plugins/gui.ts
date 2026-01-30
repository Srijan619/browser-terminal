import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'

export const guiCommand: CommandPlugin = {
    name: 'gui',
    description: 'Enter GUI mode',
    execute: (args: string[], prompt: PromptInstance) => {
        console.log('In a god mode now')
        prompt.reply = 'You are about to enter to a different world'
    }
}
