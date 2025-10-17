<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// Reactive time string
const currentTime = ref('')

// Format time like "12:45:07 PM"
function formatTime(date: Date): string {
    return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    })
}

let interval: number

onMounted(() => {
    currentTime.value = formatTime(new Date())
    interval = setInterval(() => {
        currentTime.value = formatTime(new Date())
    }, 1000)
})

onUnmounted(() => {
    clearInterval(interval)
})

const lit = ref(false)

function handleMouseEnter() {
    lit.value = true
}

function handleMouseLeave() {
    lit.value = false
}
</script>

<template>
    <div class="container">
        <!-- Overlay to dim background -->
        <div class="overlay"></div>

        <div class="lock-screen">
            <span class="time">{{ currentTime }}</span>
            <span class="hint">Press space to unlock</span>
        </div>
        <div
            class="room-overlay"
            :class="{ lit: lit }"
            @mouseenter="handleMouseEnter"
            @mouseleave="handleMouseLeave"
        ></div>
    </div>
</template>

<style scoped>
.container {
    height: 100vh;
    background-image: url('future_town.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
}

/* Dark overlay for dim effect */
.overlay {
    position: absolute;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.5); /* semi-transparent black */
    z-index: 1;
}

.room-overlay {
    position: absolute;
    top: 35%;
    right: 70.5%;
    width: 30px;
    height: 35px;
    transform: scale(1.2);
    border-radius: 6px;
    background-color: rgba(245, 194, 10, 0); /* Fully transparent initially */
    box-shadow: 0 0 0 rgba(245, 194, 10, 0); /* No glow */
    z-index: 2;
    transition: transform 0.3s ease;
}

.room-overlay.lit {
    background-color: rgba(245, 194, 10, 0.4); /* soft light */
    box-shadow: 0 0 10px 6px rgba(245, 194, 10, 0.5); /* glowing effect */
}

.lock-screen {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    color: white;
    text-align: center;
}

.time {
    font-size: 4rem;
    font-weight: bold;
    margin-bottom: 1rem;
}

.hint {
    font-size: 1.2rem;
    opacity: 0.7;
}
</style>
