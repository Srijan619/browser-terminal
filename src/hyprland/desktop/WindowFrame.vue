<template>
    <div 
        ref="windowRef"
        class="window-frame" 
        :class="{ maximized: isMaximized, active: isActive }"
        :style="windowStyle"
        @mousedown="emitFocus"
    >
        <!-- Resize Handles -->
        <div class="resize-handle n" @mousedown.stop.prevent="startResize($event, 'n')"></div>
        <div class="resize-handle s" @mousedown.stop.prevent="startResize($event, 's')"></div>
        <div class="resize-handle e" @mousedown.stop.prevent="startResize($event, 'e')"></div>
        <div class="resize-handle w" @mousedown.stop.prevent="startResize($event, 'w')"></div>
        <div class="resize-handle ne" @mousedown.stop.prevent="startResize($event, 'ne')"></div>
        <div class="resize-handle nw" @mousedown.stop.prevent="startResize($event, 'nw')"></div>
        <div class="resize-handle se" @mousedown.stop.prevent="startResize($event, 'se')"></div>
        <div class="resize-handle sw" @mousedown.stop.prevent="startResize($event, 'sw')"></div>

        <!-- Title Bar -->
        <div class="title-bar" @dblclick="toggleMaximize" @mousedown="startDrag">
            <div class="title-info">
                <span class="app-icon"></span>
                <span class="title-text">{{ title }}</span>
            </div>
            
            <div class="window-controls">
                <button class="control-btn minimize" @click.stop="$emit('minimize')" title="Minimize">
                    
                </button>
                <button class="control-btn maximize" @click.stop="toggleMaximize" title="Maximize">
                    {{ isMaximized ? '' : '' }}
                </button>
                <button class="control-btn close" @click.stop="$emit('close')" title="Close">
                    
                </button>
            </div>
        </div>

        <!-- Window Content -->
        <div class="window-content">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useResizable } from '../../composables/useResizable'
import { useCustomizationStore } from '../../stores/customizationStore'
import { storeToRefs } from 'pinia'

const props = defineProps<{
    title: string
    isActive?: boolean
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'minimize'): void
    (e: 'focus'): void
}>()

const isMaximized = ref(false)
const windowRef = ref<HTMLElement | null>(null)
const customizationStore = useCustomizationStore()
const { WINDOW_BORDER_ACTIVE, WINDOW_BORDER_INACTIVE, WINDOW_BG_COLOR } = storeToRefs(customizationStore)

// Window State
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// Current Geometry
const geometry = ref({
    x: 100, 
    y: 100,
    width: 800,
    height: 500
})

const windowStyle = computed(() => {
    if (isMaximized.value) {
        return {}
    }
    return {
        top: `${geometry.value.y}px`,
        left: `${geometry.value.x}px`,
        width: `${geometry.value.width}px`,
        height: `${geometry.value.height}px`,
        transform: 'none'
    }
})

const emitFocus = () => {
    emit('focus')
}

const toggleMaximize = () => {
    isMaximized.value = !isMaximized.value
}

// --- Dragging ---
const startDrag = (event: MouseEvent) => {
    if (isMaximized.value) return
    emitFocus()
    
    isDragging.value = true
    const rect = windowRef.value?.getBoundingClientRect()
    if (rect) {
        dragOffset.value = {
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
        }
    }
    
    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
}

const onDrag = (event: MouseEvent) => {
    if (!isDragging.value) return
    
    geometry.value.x = event.clientX - dragOffset.value.x
    geometry.value.y = event.clientY - dragOffset.value.y
}

const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
}

const { startResize, isResizing } = useResizable(geometry, {
    onResizeStart: emitFocus
})

// Cleanup
onUnmounted(() => {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
})

onMounted(() => {
    // Initial centering
    const w = Math.max(700, window.innerWidth * 0.75)
    // Convert '75vw' to pixels approximately for the internal state
    // We switch to pixel-based state for resize logic to work smoothly
    geometry.value = {
        width: w,
        height: window.innerHeight * 0.65,
        x: (window.innerWidth - w) / 2,
        y: (window.innerHeight * 0.35) / 2
    }
})
</script>

<style scoped>
.window-frame {
    position: absolute;
    /* Removed min-width/height from here to let JS handle or use simple mins */
    min-width: 400px; 
    min-height: 300px;

    /* Hyprland Style */
    background-color: v-bind(WINDOW_BG_COLOR);
    backdrop-filter: blur(12px);
    
    border: 2px solid v-bind(WINDOW_BORDER_INACTIVE); /* Inactive border */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border-radius: 8px;
    
    display: flex;
    flex-direction: column;
    overflow: visible; /* Needed for resize handles if they sit outside, but ours sit inside/on-edge */
    
    /* Optimized Transitions: removed width/height transition during active manipulation usually, but keeping for smooth maximize */
    transition: border-color 0.2s ease, box-shadow 0.2s ease; 
    /* color: #cdd6f4; Handled by children mostly */
}

/* Active State */
.window-frame.active {
    border-color: v-bind(WINDOW_BORDER_ACTIVE); /* Hyprland Cyan */
    box-shadow: 0 0 15px rgba(51, 204, 255, 0.2), 0 10px 30px rgba(0, 0, 0, 0.5);
}

.window-frame.maximized {
    width: 100vw !important;
    height: 100vh !important;
    top: 0 !important;
    left: 0 !important;
    border-radius: 0;
    border: none;
    z-index: 1000;
}

/* Title Bar */
.title-bar {
    height: 32px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    background: transparent;
    user-select: none;
    cursor: default;
}

.title-info {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'JetBrainsMono Nerd Font', monospace;
    font-size: 13px;
    font-weight: 600;
    color: #a6adc8;
}

.app-icon { color: #89b4fa; }

/* Controls */
.window-controls { display: flex; gap: 6px; }
.control-btn {
    width: 20px; height: 20px;
    border-radius: 4px; border: none; background: transparent;
    color: #a6adc8;
    display: flex; justify-content: center; align-items: center;
    cursor: pointer;
    font-size: 12px;
}
.control-btn:hover { background: rgba(255,255,255,0.1); color: white; }
.control-btn.close:hover { background: #f38ba8; color: #1e1e2e; }

/* Content */
.window-content {
    flex: 1;
    overflow: hidden;
    position: relative;
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
}

/* Resize Handles */
.resize-handle {
    position: absolute;
    z-index: 999;
}
.resize-handle.n { top: -4px; left: 0; right: 0; height: 8px; cursor: n-resize; }
.resize-handle.s { bottom: -4px; left: 0; right: 0; height: 8px; cursor: s-resize; }
.resize-handle.e { top: 0; bottom: 0; right: -4px; width: 8px; cursor: e-resize; }
.resize-handle.w { top: 0; bottom: 0; left: -4px; width: 8px; cursor: w-resize; }

.resize-handle.ne { top: -4px; right: -4px; width: 12px; height: 12px; cursor: ne-resize; }
.resize-handle.nw { top: -4px; left: -4px; width: 12px; height: 12px; cursor: nw-resize; }
.resize-handle.se { bottom: -4px; right: -4px; width: 12px; height: 12px; cursor: se-resize; }
.resize-handle.sw { bottom: -4px; left: -4px; width: 12px; height: 12px; cursor: sw-resize; }
</style>
