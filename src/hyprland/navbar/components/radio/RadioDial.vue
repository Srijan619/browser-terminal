<template>
    <div :class="$style.radioDial">
        <div :class="$style.dialNeedle" :style="{ transform: `rotate(${rotation}deg)` }"></div>
        <div :class="$style.dialLabels">
            <span>{{ min }}</span>
            <span>{{ mid }}</span>
            <span>{{ max }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    rotation: number
    range: [number, number]
}>()

const min = computed(() => props.range[0])
const max = computed(() => props.range[1])
const mid = computed(() => Math.round((props.range[0] + props.range[1]) / 2))
</script>

<style module>
.radioDial {
    width: 50px;
    height: 50px;
    background: #111;
    border: 2px solid var(--color-border);
    border-radius: var(--radius-round);
    position: relative;
    flex-shrink: 0;
    transition: border-color var(--transition-fast);
}

.dialNeedle {
    position: absolute;
    width: 2px;
    height: 20px;
    background: var(--color-accent);
    left: calc(50% - 1px);
    bottom: 50%;
    transform-origin: bottom center;
    transition: transform var(--transition-slow);
}

.dialLabels {
    position: absolute;
    width: 100%;
    bottom: 4px;
    display: flex;
    justify-content: space-around;
    font-size: 8px;
    color: var(--color-text-muted);
}
</style>
