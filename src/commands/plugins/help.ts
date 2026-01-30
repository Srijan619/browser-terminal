import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { registry } from '../index'
import { marked } from 'marked'

export const helpCommand: CommandPlugin = {
    name: 'help',
    description: 'List all available commands',
    execute: (args: string[], prompt: PromptInstance) => {
        const commands = registry.getAllCommands().map(c => c.name)
        prompt.reply = marked
            .parse(
                `Need help? Try followings: <code>${commands.join(' | ')}</code>`
            )
            .toString()
    }
}
