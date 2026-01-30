import type { CommandPlugin } from '../types'
import type { PromptInstance } from '../../types'
import { marked } from 'marked'

export const topCommand: CommandPlugin = {
    name: 'top',
    description: 'Display system summary (mock)',
    execute: (args: string[], prompt: PromptInstance) => {
        if (performance && (performance as any).memory) {
            const memoryInfo = (performance as any).memory

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

            prompt.reply = marked.parse(message).toString()
        } else {
            prompt.reply = 'Memory information is not available in this browser.'
        }
    }
}
