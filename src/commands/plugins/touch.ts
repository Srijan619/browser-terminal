import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useFilesStore } from '../../stores/filesStore'
import { useCommandPromptStore } from '../../stores/globalStore'

const getCurrentDirName = (): string => {
    let currDir = useCommandPromptStore().CURRENT_DIR
    const allDirs = currDir.split('/')
    return allDirs[allDirs.length - 1]
}

const isFile = (fileName: string): boolean => {
    const validExtensions = ['txt', 'md', 'pem', 'js']
    const parts = fileName.split('.')
    if (parts.length <= 1) return false
    const extension = parts.pop()
    if (!extension) return false
    return validExtensions.includes(extension.toLowerCase())
}

export const touchCommand: CommandPlugin = {
    name: 'touch',
    description: 'Create a file or update timestamp',
    execute: (args: string[], prompt: PromptInstance) => {
        const fileName = args[0]

        if (!fileName) {
            prompt.reply = 'Please provide a filename for touch command.'
            return
        }
        if (isFile(fileName)) {
            useFilesStore().addFile(fileName, '', [getCurrentDirName()])
        } else {
            useFilesStore().addFolder(fileName, [getCurrentDirName()])
        }
    }
}
