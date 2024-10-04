import type { PromptInstance } from '../types'
import { useCommandPromptStore } from '../stores/globalStore'
import { useCustomizationStore } from '../stores/customizationStore'
import { useFilesStore } from '../stores/filesStore'
import { marked } from 'marked'

const ROOT_DIR = '~'

export enum Command {
  LS = 'ls',
  CD = 'cd',
  PWD = 'pwd',
  CLEAR = 'clear',
  CAT = 'cat',
  TOP = 'top',
  HISTORY = 'history',
  TOUCH = 'touch',
  VIM = 'vim',
  CLEAR_LOCALSTORAGE = 'clearLocalStorage',
  REMOVE = 'rm',
  HELP = 'help',
}

export const Commands: Command[] = [
  Command.LS,
  Command.CD,
  Command.PWD,
  Command.CLEAR,
  Command.CAT,
  Command.TOP,
  Command.HISTORY,
  Command.TOUCH,
  Command.VIM,
  Command.CLEAR_LOCALSTORAGE,
  Command.REMOVE,
  Command.HELP,
]
const BAD_COMMAND_ERROR_MESSAGE =
  '&nbsp;Command not found! Type <code>help</code> to know all options.'
let PROMPT_INSTANCE: PromptInstance

const getCommandPromptStore = () => {
  return useCommandPromptStore()
}

const getCustomizationStore = () => {
  return useCustomizationStore()
}

const getFilesStore = () => {
  return useFilesStore()
}

const formatBadCommandMessage = (command: string) => {
  let formattedMessage =
    (command && `<code>${command}</code>`) + BAD_COMMAND_ERROR_MESSAGE
  return marked.parse(formattedMessage).toString()
}
// Function to check if the command is allowed
const isInputCommandAllowed = (command: string): boolean => {
  if (!command) return false
  const prefix = commandPrefix(command)

  return prefix !== null && Object.values(Command).includes(prefix)
}

const commandPrefix = (command: string): Command | null => {
  const prefix = command?.split(' ')[0]?.trim() // Get the first word of the command

  // Check if the prefix exists in the Command enum and return it, or return null if not
  return Object.values(Command).includes(prefix as Command)
    ? (prefix as Command)
    : null
}

const commandSuffix = (command: string): string => {
  return command?.split(' ')[1]?.trim()
}

const commandSuffixAll = (command: string): string => {
  return command.split(' ').slice(1).join(' ').trim()
}

const getCurrentDirName = (currentDir?: string): string => {
  let currDir = currentDir || getCommandPromptStore().CURRENT_DIR
  const allDirs = currDir.split('/')
  return allDirs[allDirs.length - 1]
}

const isFile = (fileName: string): boolean => {
  // Check if the filename contains a dot, is not just a dot, and has a valid extension
  const validExtensions = ['txt', 'md', 'pem', 'js']
  const parts = fileName.split('.')

  // If there's no dot or only one part, it cannot be a file
  if (parts.length <= 1) return false

  // Check if the last part is a valid file extension
  const extension = parts.pop() // Get the last part after the last dot
  if (!extension) return false
  return validExtensions.includes(extension.toLowerCase())
}

const formatLsReply = (reply: string) => {
  const formattedReply = [] as string[]
  reply?.split(' ').forEach((r) => {
    if (!isFile(r)) {
      formattedReply.push(
        `<span style="color: ${getCustomizationStore().TERMINAL_LS_FOLDER_COLOR};">${r}</span>`
      )
    } else {
      formattedReply.push(
        `<span style="color:${getCustomizationStore().TERMINAL_LS_FILE_COLOR};">${r}</span>`
      )
    }
  })
  return marked.parse(formattedReply.join(' '))
}

// Function to filter only directories (non-files) in the current directory
const getFileRecursively = (
  currentDirName: string,
  currentDirContent: any = getFilesStore().AVAILABLE_DIRS
): (string | Map<string, any>)[] => {
  if (!currentDirContent) return []

  // Try to get the directory content directly from the map if possible
  const content = currentDirContent.get(currentDirName)

  if (content) return content

  // If content is not found directly, recursively search within nested Maps
  for (const [, value] of currentDirContent) {
    if (value instanceof Map) {
      const result = getFileRecursively(currentDirName, value)
      if (result) {
        return result // Return the result immediately if found
      }
    }
  }

  // If not found anywhere, return an empty string
  return []
}

const mapDirsToString = (content: (string | Map<string, any>)[]) => {
  if (content) {
    return Array.from(content as (string | Map<string, any>)[])
      .flatMap((item: string | Map<string, any>) => {
        // If the item is a string (file or directory)
        if (typeof item === 'string') {
          return isFile(item) ? item : [] // Return the item if it's a file
        } else if (Array.isArray(item)) {
          // If it's an array (assuming this is a nested structure), filter its contents
          return item.filter(
            (nestedItem) =>
              typeof nestedItem === 'string' && isFile(nestedItem)
          )
        } else if (item instanceof Map) {
          // Handle the case where the item is a nested Map
          return Array.from(item.keys()).filter((nestedKey) =>
            isFile(nestedKey)
          )
        }
        return []
      })
      .join(' ')
  }
}

const handleClearCommand = (): void => {
  getCommandPromptStore().PROMPT_INSTANCES = []
}

const handleHelpCommand = (): void => {
  PROMPT_INSTANCE.reply = marked
    .parse(
      `Need help? Try followings: <code>${Commands.join(' | ')}</code>`
    )
    .toString()
}

const handleLsCommand = (): void => {
  const currentDirName = getCurrentDirName()
  let reply = ''
  if (currentDirName && getFilesStore().AVAILABLE_DIRS.has(currentDirName)) {
    const dirMappedString = mapDirsToString(
      getFileRecursively(currentDirName)
    )
    reply = dirMappedString ? dirMappedString : ''
  } else {
    reply = Array.from(getFilesStore().AVAILABLE_DIRS.keys()).join(' ')
  }
  PROMPT_INSTANCE.reply = formatLsReply(reply).toString()
}

const handleCdCommand = (): void => {
  const changeDir = commandSuffix(PROMPT_INSTANCE.command)
  if (!changeDir) {
    // Change to root always if nothing provided
    getCommandPromptStore().CURRENT_DIR = ROOT_DIR
  } else if (!getFilesStore().AVAILABLE_DIRS.has(changeDir)) {
    PROMPT_INSTANCE.reply = `No such directory!`
  } else {
    getCommandPromptStore().CURRENT_DIR += '/' + changeDir
  }
}

const handleCatCommand = () => {
  const file = commandSuffix(PROMPT_INSTANCE.command)
  if (!file) {
    PROMPT_INSTANCE.reply = 'Please provide file name to view!'
  } else if (!isFile(file)) {
    PROMPT_INSTANCE.reply = 'Not a file!'
  } else if (getFileRecursively(file)) {
    const fileContent = getFileRecursively(file)
    PROMPT_INSTANCE.reply = fileContent.toString()
  } else {
    PROMPT_INSTANCE.reply = `No such file: ${file}`
  }
}

const handleTopCommand = () => {
  // DUMMY top command rep of os
  if (performance.memory) {
    const memoryInfo = performance.memory

    // Convert bytes to megabytes (1 MB = 1024 * 1024 bytes)
    const bytesToMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(2)

    let message = ''
    message += '<strong>Memory Usage Summary:</strong><br>'
    message +=
      'JS Heap Size Limit: ' +
      bytesToMB(memoryInfo.jsHeapSizeLimit) +
      ' MB<br>'
    message +=
      'Total Allocated JS Heap Size: ' +
      bytesToMB(memoryInfo.totalJSHeapSize) +
      ' MB<br>'
    message +=
      'Currently Used JS Heap Size: ' +
      bytesToMB(memoryInfo.usedJSHeapSize) +
      ' MB<br>'

    PROMPT_INSTANCE.reply = marked.parse(message).toString()
  } else {
    PROMPT_INSTANCE.reply =
      'Memory information is not available in this browser.'
  }
}

const handlePwdCommand = () => {
  PROMPT_INSTANCE.reply = getCommandPromptStore().CURRENT_DIR
}

const handleHistoryCommand = () => {
  PROMPT_INSTANCE.reply = marked
    .parse(getCommandPromptStore().COMMAND_HISTORY.join('<br>'))
    .toString()
}

const handleTouchCommand = () => {
  const fileName = commandSuffix(PROMPT_INSTANCE.command)

  if (!fileName) {
    PROMPT_INSTANCE.reply = 'Please provide a filename for touch command.'
    return
  }
  if (isFile(fileName)) {
    useFilesStore().addFile(fileName, '', [getCurrentDirName()])
  } else {
    useFilesStore().addFolder(fileName, [getCurrentDirName()])
  }
}

const handleVimCommand = () => {
  const fileName = commandSuffix(PROMPT_INSTANCE.command)
  if (!fileName) {
    PROMPT_INSTANCE.reply = 'Please provide a filename to start editing.'
    return
  }
  getCommandPromptStore().VIM_EDITOR_VISIBLE = true
  getCommandPromptStore().VIM_EDITOR_FILENAME = fileName
  getCommandPromptStore().VIM_EDITOR_CONTENT = useFilesStore().getFile(
    fileName,
    [getCurrentDirName()]
  )
}

const handleClearLocalStorageCommand = () => {
  localStorage.clear()
}

const handleRemoveCommand = () => {
  const removeArgument = commandSuffixAll(PROMPT_INSTANCE.command)

  if (!removeArgument) {
    PROMPT_INSTANCE.reply =
      'Proper usage of rm command is with rm filename | rm -r folder_name'
  } else if (removeArgument.includes('-r')) {
    // If argument has -r means folder, delete everything recursively
    const folderName = removeArgument.split('-r')[1].trim()
    if (isFile(folderName)) {
      PROMPT_INSTANCE.reply = `File detected in command ${PROMPT_INSTANCE.command} while using -r option, please remove option -r to delete a file`
    } else {
      if (useFilesStore().deleteFolder(folderName)) {
        PROMPT_INSTANCE.reply = `Folder ${folderName} deleted successfully!`
      } else {
        PROMPT_INSTANCE.reply = `No such folder ${folderName} found!`
      }
    }
  } else {
    // remove file if no option provided
    const fileName = removeArgument
    if (isFile(fileName)) {
      if (useFilesStore().deleteFile(fileName)) {
        PROMPT_INSTANCE.reply = `File ${fileName} successfully deleted!`
      } else {
        PROMPT_INSTANCE.reply = `No such file ${fileName} found!`
      }
    } else {
      PROMPT_INSTANCE.reply = `Folder detected in command ${PROMPT_INSTANCE.command}, please use option -r to delete a folder`
    }
  }
  console.log('Handling remove command,...', PROMPT_INSTANCE)
}

const handleDefaultCheck = () => {
  if (!PROMPT_INSTANCE.command) {
    return //
  }
  if (!isInputCommandAllowed(PROMPT_INSTANCE.command)) {
    PROMPT_INSTANCE.reply = formatBadCommandMessage(PROMPT_INSTANCE.command)
    return
  }
}

const setAndSanitizePromptInstance = (promptInstance: PromptInstance) => {
  PROMPT_INSTANCE = promptInstance
  PROMPT_INSTANCE.command = promptInstance.command.trim()
}

const handleCommand = (promptInstance: PromptInstance): void => {
  if (!promptInstance.command) return

  setAndSanitizePromptInstance(promptInstance)
  getCommandPromptStore().COMMAND_HISTORY.push(promptInstance.command) // Store command with arguments and everything

  const command: Command | null = commandPrefix(PROMPT_INSTANCE.command)

  switch (command) {
    case Command.CLEAR:
      handleClearCommand()
      break
    case Command.HELP:
      handleHelpCommand()
      break
    case Command.LS:
      handleLsCommand()
      break
    case Command.CD:
      handleCdCommand()
      break
    case Command.CAT:
      handleCatCommand()
      break
    case Command.TOP:
      handleTopCommand()
      break
    case Command.PWD:
      handlePwdCommand()
      break
    case Command.HISTORY:
      handleHistoryCommand()
      break
    case Command.TOUCH:
      handleTouchCommand()
      break
    case Command.VIM:
      handleVimCommand()
      break
    case Command.REMOVE:
      handleRemoveCommand()
      break
    case Command.CLEAR_LOCALSTORAGE:
      handleClearLocalStorageCommand()
      break
    default:
      handleDefaultCheck()
      break
  }
}

export { handleCommand }
