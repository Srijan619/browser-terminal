<template>
    <div
        :class="$style.wrapper"
        :title="`${percentage.toFixed(1)}% - ${state}`"
    >
        <div :class="$style.progressBackground">
            <div
                :class="$style.progressBar"
                :style="{ width: `${percentage}%` }"
            />
            <span v-if="isCharging" :class="$style.chargingIcon"></span>
            <span :class="$style.percentageText"
                >{{ Math.round(percentage) }}%</span
            >
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    percentage: number
    state: string
}>()

const isCharging = computed(() => props.state.toLowerCase() === 'charging')
</script>

<style module>
.wrapper {
    position: relative;
    width: 50px;
    height: 12px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 4px;
    overflow: hidden;
    background: rgba(255, 255, 255, 0.05);
}

.progressBackground {
    width: 100%;
    height: 100%;
    background-color: rgba(255, 255, 255, 0.05);
}

.progressBar {
    height: 100%;
    background-color: #61afef;
    transition: width 0.3s ease;
}

.chargingIcon {
    position: absolute;
    top: -1px;
    left: 45%;
    transform: translateX(-50%);
    font-size: 10px;
    color: #e5c07b;
}

.percentageText {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 10px;
    color: white;
    pointer-events: none;
}
</style>
