import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ViewType = 'LOCKSCREEN' | 'DESKTOP' | 'TERMINAL'

export const useViewStore = defineStore('view', () => {
    const currentView = ref<ViewType>('LOCKSCREEN')
    const isTestingMode = ref(false)

    const setView = (view: ViewType) => {
        currentView.value = view
    }

    const initialize = () => {
        const initialView = import.meta.env.VITE_INITIAL_VIEW?.toUpperCase()

        switch (initialView) {
            case 'DESKTOP':
                currentView.value = 'DESKTOP'
                isTestingMode.value = true
                break
            case 'TERMINAL':
                currentView.value = 'TERMINAL'
                isTestingMode.value = true
                break
            case 'LOCKSCREEN':
            default:
                currentView.value = 'LOCKSCREEN'
                break
        }
    }

    // Initialize immediately
    initialize()

    return {
        currentView,
        isTestingMode,
        setView
    }
})
