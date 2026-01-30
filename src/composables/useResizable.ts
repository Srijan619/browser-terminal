import { ref, onUnmounted, type Ref } from 'vue'

export interface Geometry {
    x: number
    y: number
    width: number
    height: number
}

interface ResizableConfig {
    minWidth?: number
    minHeight?: number
    onResizeStart?: () => void
    onResizeEnd?: () => void
}

export function useResizable(
    initialGeometry: Ref<Geometry>,
    config: ResizableConfig = {}
) {
    const isResizing = ref(false)
    const resizeDirection = ref('')
    const initialResize = ref({ x: 0, y: 0, width: 0, height: 0, top: 0, left: 0 })

    const minWidth = config.minWidth ?? 400
    const minHeight = config.minHeight ?? 300

    const startResize = (event: MouseEvent, direction: string) => {
        if (config.onResizeStart) config.onResizeStart()

        isResizing.value = true
        resizeDirection.value = direction

        initialResize.value = {
            x: event.clientX,
            y: event.clientY,
            width: initialGeometry.value.width,
            height: initialGeometry.value.height,
            top: initialGeometry.value.y,
            left: initialGeometry.value.x
        }

        document.addEventListener('mousemove', onResize)
        document.addEventListener('mouseup', stopResize)
    }

    const onResize = (event: MouseEvent) => {
        if (!isResizing.value) return

        const deltaX = event.clientX - initialResize.value.x
        const deltaY = event.clientY - initialResize.value.y
        const dir = resizeDirection.value

        let newWidth = initialResize.value.width
        let newHeight = initialResize.value.height
        let newX = initialResize.value.left
        let newY = initialResize.value.top

        // Horizontal
        if (dir.includes('e')) {
            newWidth = Math.max(minWidth, initialResize.value.width + deltaX)
        } else if (dir.includes('w')) {
            const w = Math.max(minWidth, initialResize.value.width - deltaX)
            newX = initialResize.value.left + (initialResize.value.width - w)
            newWidth = w
        }

        // Vertical
        if (dir.includes('s')) {
            newHeight = Math.max(minHeight, initialResize.value.height + deltaY)
        } else if (dir.includes('n')) {
            const h = Math.max(minHeight, initialResize.value.height - deltaY)
            newY = initialResize.value.top + (initialResize.value.height - h)
            newHeight = h
        }

        initialGeometry.value = {
            x: newX,
            y: newY,
            width: newWidth,
            height: newHeight
        }
    }

    const stopResize = () => {
        isResizing.value = false
        if (config.onResizeEnd) config.onResizeEnd()
        document.removeEventListener('mousemove', onResize)
        document.removeEventListener('mouseup', stopResize)
    }

    onUnmounted(() => {
        document.removeEventListener('mousemove', onResize)
        document.removeEventListener('mouseup', stopResize)
    })

    return {
        isResizing,
        startResize
    }
}
