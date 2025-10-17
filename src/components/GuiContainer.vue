<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import MainLockScreen from '../hyprland/lockscreen/MainLockScreen.vue'
import Desktop from '../hyprland/desktop/Desktop.vue'

// Controls which screen is shown
const lockScreenActive = ref(true)

function handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'Space' && lockScreenActive.value) {
        lockScreenActive.value = false
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
            <MainLockScreen v-if="lockScreenActive" class="lockscreen" />
        </transition>

        <!-- Desktop slides in after unlock -->
        <transition name="slide-up">
            <Desktop v-if="!lockScreenActive" class="desktop" />
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

.fade-leave-active {
    transition: opacity 0.8s ease;
}
.fade-leave-from {
    opacity: 1;
}
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
