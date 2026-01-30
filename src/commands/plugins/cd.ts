import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useCommandPromptStore } from '../../stores/globalStore'
import { useFilesStore } from '../../stores/filesStore'

const ROOT_DIR = '~'

export const cdCommand: CommandPlugin = {
    name: 'cd',
    description: 'Change directory',
    execute: (args: string[], prompt: PromptInstance) => {
        const changeDir = args[0]
        if (!changeDir) {
            // Change to root always if nothing provided
            useCommandPromptStore().CURRENT_DIR = ROOT_DIR
        } else if (!useFilesStore().AVAILABLE_DIRS.has(changeDir)) {
            prompt.reply = `No such directory!`
        } else {
            useCommandPromptStore().CURRENT_DIR += '/' + changeDir
        }
    }
}
