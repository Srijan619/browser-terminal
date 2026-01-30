import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useFilesStore } from '../../stores/filesStore'
import { useCommandPromptStore } from '../../stores/globalStore'

const getCurrentDirName = (): string => {
    let currDir = useCommandPromptStore().CURRENT_DIR
    const allDirs = currDir.split('/')
    return allDirs[allDirs.length - 1]
}

export const vimCommand: CommandPlugin = {
    name: 'vim',
    description: 'Edit a file',
    execute: (args: string[], prompt: PromptInstance) => {
        const fileName = args[0]
        if (!fileName) {
            prompt.reply = 'Please provide a filename to start editing.'
            return
        }

        const cmdStore = useCommandPromptStore()
        cmdStore.VIM_EDITOR_VISIBLE = true
        cmdStore.VIM_EDITOR_FILENAME = fileName
        cmdStore.VIM_EDITOR_CONTENT = useFilesStore().getFile(
            fileName,
            [getCurrentDirName()]
        )
    }
}
