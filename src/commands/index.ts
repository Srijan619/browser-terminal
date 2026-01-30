import type { PromptInstance } from '../types'
import type { CommandPlugin } from './types'
import { marked } from 'marked'

import * as plugins from './plugins'

class CommandRegistry {
    private commands: Map<string, CommandPlugin> = new Map()

    constructor() {
        Object.values(plugins).forEach(plugin => {
            this.register(plugin)
        })
    }

    register(plugin: CommandPlugin) {
        this.commands.set(plugin.name, plugin)
        if (plugin.aliases) {
            plugin.aliases.forEach(alias => this.commands.set(alias, plugin))
        }
    }

    getCommand(name: string): CommandPlugin | undefined {
        return this.commands.get(name)
    }

    getAllCommands(): CommandPlugin[] {
        // Return unique plugins (deduplicate aliased entries)
        const uniquePlugins = new Set(this.commands.values())
        return Array.from(uniquePlugins)
    }

    async execute(input: string, prompt: PromptInstance) {
        const [cmdName, ...args] = input.trim().split(/\s+/)

        if (!cmdName) return

        const command = this.commands.get(cmdName)
        if (command) {
            await command.execute(args, prompt)
        } else {
            prompt.reply = marked.parse(`Command <code>${cmdName}</code> not found! Type <code>help</code> to know all options.`).toString()
        }
    }
}

export const registry = new CommandRegistry()

// Helper Methods for Consumers
import { useCommandPromptStore } from '../stores/globalStore'

export const getCommandNames = () => registry.getAllCommands().map(c => c.name)

export const handleCommand = async (promptInstance: PromptInstance) => {
    if (!promptInstance.command) return

    // Store command with arguments and everything
    useCommandPromptStore().COMMAND_HISTORY.push(promptInstance.command)

    // Execute via Registry
    await registry.execute(promptInstance.command, promptInstance)
}
