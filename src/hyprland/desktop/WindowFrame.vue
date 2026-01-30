<template>
    <div 
        ref="windowRef"
        class="window-frame" 
        :class="{ maximized: isMaximized }"
        :style="windowStyle"
    >
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

defineProps<{
    title: string
}>()

defineEmits<{
    (e: 'close'): void
    (e: 'minimize'): void
}>()

const isMaximized = ref(false)
const windowRef = ref<HTMLElement | null>(null)

// Dragging State
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const position = ref({ x: 100, y: 100 }) // Initial position

const windowStyle = computed(() => {
    if (isMaximized.value) {
        return {}
    }
    return {
        top: `${position.value.y}px`,
        left: `${position.value.x}px`,
        transform: 'none' // Remove any centering transforms if present
    }
})

const toggleMaximize = () => {
    isMaximized.value = !isMaximized.value
}

// Drag Handlers
const startDrag = (event: MouseEvent) => {
    if (isMaximized.value) return
    
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
    
    position.value = {
        x: event.clientX - dragOffset.value.x,
        y: event.clientY - dragOffset.value.y
    }
}

const stopDrag = () => {
    isDragging.value = false
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
}

// Cleanup just in case
onUnmounted(() => {
    document.removeEventListener('mousemove', onDrag)
    document.removeEventListener('mouseup', stopDrag)
})

onMounted(() => {
    // Calculate initial center position based on 75vw width and 65vh height
    const width = Math.max(700, window.innerWidth * 0.75)
    
    position.value = {
        x: (window.innerWidth - width) / 2,
        y: (window.innerHeight * 0.35) / 2 // Centering vertically (1 - 0.65) / 2
    }
})
</script>

<style scoped>
.window-frame {
    /* Absolute positioning for drag */
    position: absolute;
    /* Removed fixed width/height percents to allow explicit sizing or defaults */
    width: 75vw;
    height: 65vh;
    min-height: 500px;
    min-width: 700px;

    /* Hyprland / Glassmorphism Style */
    background-color: rgba(20, 20, 20, 0.85);
    backdrop-filter: blur(12px) saturate(1.8);
    -webkit-backdrop-filter: blur(12px) saturate(1.8);
    
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
    border-radius: 12px;
    
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: width 0.3s cubic-bezier(0.25, 0.8, 0.25, 1), 
                height 0.3s cubic-bezier(0.25, 0.8, 0.25, 1),
                border-radius 0.3s ease;
    color: #cdd6f4; /* Hyprland Text Color */
}

/* Maximized State */
.window-frame.maximized {
    width: 100vw !important;
    height: 100vh !important;
    border-radius: 0;
    border: none;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100; /* Ensure it covers everything */
}

/* Title Bar */
.title-bar {
    height: 38px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 12px;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    user-select: none;
    cursor: default; /* Could be move cursor if draggable */
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

.app-icon {
    color: #89b4fa;
}

/* Controls */
.window-controls {
    display: flex;
    gap: 8px;
}

.control-btn {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: none;
    background: transparent;
    color: #a6adc8;
    font-family: 'JetBrainsMono Nerd Font', monospace;
    font-size: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.control-btn:hover {
    background: rgba(255, 255, 255, 0.1);
    color: #fff;
}

.control-btn.close:hover {
    background: #f38ba8; /* Hyprland Red */
    color: #1e1e2e;
}

.control-btn.maximize:hover {
    background: #f9e2af; /* Hyprland Yellow */
    color: #1e1e2e;
}

.control-btn.minimize:hover {
    background: #a6e3a1; /* Hyprland Green */
    color: #1e1e2e;
}

/* Content Area */
.window-content {
    flex: 1;
    overflow: hidden;
    position: relative;
    /* Ensure content considers frame borders */
    display: flex;
    flex-direction: column;
}
</style>
