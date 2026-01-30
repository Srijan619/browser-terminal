<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue'
import MainLockScreen from '../hyprland/lockscreen/MainLockScreen.vue'
import Desktop from '../hyprland/desktop/Desktop.vue'
import { useViewStore } from '../stores/viewStore'

const viewStore = useViewStore()

function handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space' && viewStore.currentView === 'LOCKSCREEN') {
        viewStore.setView('DESKTOP')
    }
}

onMounted(() => {
    window.addEventListener('keydown', handleKeyDown)
})

onBeforeUnmount(() => {
    window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
    <div class="screen">
        <!-- Lock screen fades out -->
        <transition name="fade">
            <MainLockScreen v-if="viewStore.currentView === 'LOCKSCREEN'" class="lockscreen" />
        </transition>

        <!-- Desktop slides in after unlock -->
        <transition name="slide-up">
            <Desktop v-if="viewStore.currentView === 'DESKTOP' || viewStore.currentView === 'TERMINAL'" class="desktop" />
        </transition>
    </div>
</template>

<style scoped>
.screen {
    width: 100vw;
    height: 100vh;
    overflow: hidden;
    background-color: black;
    position: relative;
}

.fade-leave-active,
.fade-enter-active {
    transition: opacity 0.8s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

/* --- Desktop slide-up --- */
.slide-up-enter-active {
    transition: transform 0.8s ease;
}
.slide-up-enter-from {
    transform: translateY(100%);
}
.slide-up-enter-to {
    transform: translateY(0);
}

/* Layers */
.lockscreen,
.desktop {
    position: absolute;
    inset: 0;
}
</style>
