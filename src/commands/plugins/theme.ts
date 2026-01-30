import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { useCustomizationStore } from '../../stores/customizationStore'

export const themeCommand: CommandPlugin = {
    name: 'changeTheme',
    description: 'Change the terminal theme',
    execute: (args: string[], prompt: PromptInstance) => {
        const themeName = args[0]
        const store = useCustomizationStore()
        const availableThemes = store.availableThemes as string[]

        if (!themeName) {
            prompt.reply = `Usage: changeTheme <theme_name><br>Available themes: ${availableThemes.join(', ')}`
            return
        }

        if (availableThemes.includes(themeName)) {
            store.applyTheme(themeName as any)
            prompt.reply = `Theme changed to ${themeName} successfully!`
        } else {
            prompt.reply = `Theme '${themeName}' not found!<br>Available themes: ${availableThemes.join(', ')}`
        }
    }
}
