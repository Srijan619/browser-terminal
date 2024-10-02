import { defineStore } from 'pinia'
import { ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { PromptInstance } from '../types'
import { handleCommand } from '../utils/commands'
import { WELCOME_MESSAGE } from '../staticMessages/welcomeMessage'

export const useCommandPromptStore = defineStore('commandPrompt', () => {
  const PROMPT_INSTANCES = ref<PromptInstance[]>([])
  const CURRENT_DIR = ref('~')
  const TERMINAL_MODE = ref('client')
  const COMMAND_HISTORY = ref<String[]>([])
  const VIM_EDITOR_VISIBLE = ref(false)
  const VIM_EDITOR_FILENAME = ref('')
  const VIM_EDITOR_CONTENT = ref('')
  const emptyPromptInstance = (): PromptInstance => {
    return {
      id: uuidv4(),
      command: '',
      reply: '',
      currentDir: CURRENT_DIR.value,
      enabled: true,
    } as PromptInstance
  }
  // Function to create a new prompt instance
  const createNewPromptInstance = (): void => {
    PROMPT_INSTANCES.value.push(emptyPromptInstance())
  }

  const createMessagePrompt = (message: string, cmd?: string): void => {
    const messagePromptInstance = emptyPromptInstance()
    messagePromptInstance.enabled = false
    messagePromptInstance.reply = message
    messagePromptInstance.command = cmd || ''
    PROMPT_INSTANCES.value.push(messagePromptInstance)
  }

  const reset = () => {
    PROMPT_INSTANCES.value = []
    createMessagePrompt(WELCOME_MESSAGE.toString(), 'cat bio.md')
    createMessagePrompt('Welcome to terminal: ' + TERMINAL_MODE.value)
    createNewPromptInstance()
  }

  const createNewPromptInstanceAndDisablePreviousInstance = (
    promptInstance?: PromptInstance
  ) => {
    // Create a new prompt after handling input
    createNewPromptInstance()
    if (promptInstance) {
      promptInstance.enabled = false // Disable input after handling input
    }
  }

  // Function to handle the enter keypress for a specific prompt
  const handleCommandInputEnter = (
    promptId: string,
    currentCommand: string
  ): void => {
    const promptInstance = PROMPT_INSTANCES.value.find(
      (instance) => instance.id === promptId
    )
    if (!promptInstance) return

    // Set the current command to the prompt instance
    promptInstance.command = currentCommand
    handleCommand(promptInstance)

    // Create a new prompt after handling input
    createNewPromptInstanceAndDisablePreviousInstance(promptInstance)
  }

  const handleCommandInputEnterServer = (
    promptId: string,
    currentCommand: string,
    callback: () => {}
  ): void => {
    const promptInstance = PROMPT_INSTANCES.value.find(
      (instance) => instance.id === promptId
    )
    if (!promptInstance) return

    // Set the current command to the prompt instance
    promptInstance.command = currentCommand
    callback()
  }

  // Initialize the first prompt instance
  reset()

  return {
    PROMPT_INSTANCES,
    CURRENT_DIR,
    TERMINAL_MODE,
    COMMAND_HISTORY,
    VIM_EDITOR_VISIBLE,
    VIM_EDITOR_FILENAME,
    VIM_EDITOR_CONTENT,
    handleCommandInputEnter,
    handleCommandInputEnterServer,
    createNewPromptInstanceAndDisablePreviousInstance,
    createMessagePrompt,
    reset,
  }
})
