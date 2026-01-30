import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useFilesStore } from '../../stores/filesStore'

const RM_COMMAND_USAGE_MESSAGE = 'Proper usage of rm command is with rm filename | rm -r folder_name'

const isFile = (fileName: string): boolean => {
    const validExtensions = ['txt', 'md', 'pem', 'js']
    const parts = fileName.split('.')
    if (parts.length <= 1) return false
    const extension = parts.pop()
    if (!extension) return false
    return validExtensions.includes(extension.toLowerCase())
}

const handleFolderDeletion = (argument: string, prompt: PromptInstance) => {
    const folderName = argument.split('-r')[1]?.trim()

    if (!folderName) {
        prompt.reply = RM_COMMAND_USAGE_MESSAGE
        return
    }

    if (isFile(folderName)) {
        prompt.reply = `File detected in command ${prompt.command} while using -r option, please remove option -r to delete a file`
        return
    }

    if (useFilesStore().deleteFolder(folderName)) {
        prompt.reply = `Folder ${folderName} deleted successfully!`
    } else {
        prompt.reply = `No such folder ${folderName} found!`
    }
}

const handleFileDeletion = (fileName: string, prompt: PromptInstance) => {
    if (isFile(fileName)) {
        if (useFilesStore().deleteFile(fileName)) {
            prompt.reply = `File ${fileName} successfully deleted!`
        } else {
            prompt.reply = `No such file ${fileName} found!`
        }
    } else {
        prompt.reply = `Folder detected in command ${prompt.command}, please use option -r to delete a folder`
    }
}

export const rmCommand: CommandPlugin = {
    name: 'rm',
    aliases: ['remove'],
    description: 'Remove files or directories',
    execute: (args: string[], prompt: PromptInstance) => {
        // Reconstruct args to check for flags easily, though args array is available.
        // Original logic checked string inclusion of -r.
        const fullArgs = args.join(' ')
        if (!fullArgs) {
            prompt.reply = RM_COMMAND_USAGE_MESSAGE
            return
        }

        if (fullArgs.includes('-r')) {
            handleFolderDeletion(fullArgs, prompt)
        } else {
            handleFileDeletion(fullArgs, prompt)
        }
    }
}
