import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useCommandPromptStore } from '../../stores/globalStore'
import { useFilesStore } from '../../stores/filesStore'
import { useCustomizationStore } from '../../stores/customizationStore'
import { marked } from 'marked'

// Helper functions extracted from original commands.ts
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

const formatLsReply = (reply: string) => {
    const formattedReply = [] as string[]
    reply?.split(' ').forEach((r) => {
        if (!isFile(r)) {
            formattedReply.push(
                `<span style="color: ${useCustomizationStore().TERMINAL_LS_FOLDER_COLOR};">${r}</span>`
            )
        } else {
            formattedReply.push(
                `<span style="color:${useCustomizationStore().TERMINAL_LS_FILE_COLOR};">${r}</span>`
            )
        }
    })
    return marked.parse(formattedReply.join(' '))
}

const getFileRecursively = (
    currentDirName: string,
    currentDirContent: any = useFilesStore().AVAILABLE_DIRS
): (string | Map<string, any>)[] => {
    if (!currentDirContent) return []
    const content = currentDirContent.get(currentDirName)
    if (content) return content
    for (const [, value] of currentDirContent) {
        if (value instanceof Map) {
            const result = getFileRecursively(currentDirName, value)
            if (result) return result
        }
    }
    return []
}

const mapDirsToString = (content: (string | Map<string, any>)[]) => {
    if (content) {
        return Array.from(content as (string | Map<string, any>)[])
            .flatMap((item: string | Map<string, any>) => {
                if (typeof item === 'string') {
                    return isFile(item) ? item : []
                } else if (Array.isArray(item)) {
                    return item.filter(
                        (nestedItem) =>
                            typeof nestedItem === 'string' && isFile(nestedItem)
                    )
                } else if (item instanceof Map) {
                    return Array.from(item.keys()).filter((nestedKey) =>
                        isFile(nestedKey)
                    )
                }
                return []
            })
            .join(' ')
    }
}

export const lsCommand: CommandPlugin = {
    name: 'ls',
    description: 'List directory contents',
    execute: (args: string[], prompt: PromptInstance) => {
        const currentDirName = getCurrentDirName()
        let reply = ''
        if (currentDirName && useFilesStore().AVAILABLE_DIRS.has(currentDirName)) {
            const dirMappedString = mapDirsToString(
                getFileRecursively(currentDirName)
            )
            reply = dirMappedString ? dirMappedString : ''
        } else {
            reply = Array.from(useFilesStore().AVAILABLE_DIRS.keys()).join(' ')
        }
        prompt.reply = formatLsReply(reply).toString()
    }
}
