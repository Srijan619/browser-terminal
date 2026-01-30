<template>
    <div :class="$style.visualizerContainer">
        <div 
            v-for="i in count" 
            :key="i" 
            :class="[$style.vBar, isAnimating ? $style.animating : '']"
            :style="{ 
                height: `${Math.random() * (height - 5) + 5}px`, 
                animationDelay: `${i * 0.1}s`,
                width: `${width}px`
            }"
        ></div>
    </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
    isAnimating: boolean
    count?: number
    height?: number
    width?: number
}>(), {
    count: 12,
    height: 30,
    width: 4
})
</script>

<style module>
.visualizerContainer {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 3px;
    height: 30px;
    background: rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    padding: 5px;
}

.vBar {
    background: var(--color-primary);
    border-radius: 2px;
    opacity: 0.5;
    transition: background-color var(--transition-fast);
}

.vBar.animating {
    animation: bounce 0.5s ease-in-out infinite alternate;
    opacity: 1;
}

@keyframes bounce {
    0% { height: 5px; }
    100% { height: 25px; }
}
</style>
