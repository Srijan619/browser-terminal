import type { PromptInstance } from '../types'

export interface CommandPlugin {
    name: string        // Primary command keywords (e.g., 'ls')
    aliases?: string[]  // Optional aliases
    description?: string
    execute: (args: string[], prompt: PromptInstance) => Promise<void> | void
}
