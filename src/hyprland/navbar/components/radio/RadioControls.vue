<template>
    <div :class="$style.controls">
        <button
            v-if="!isRadioOnly"
            :class="$style.controlButton"
            @click="$emit('prev')"
        >
            <span></span>
        </button>

        <button :class="[$style.controlButton, $style.playButton]" @click="$emit('toggle')">
            <span>
                <span v-if="isPlaying"></span>
                <span v-else></span>
            </span>
        </button>

        <button
            v-if="!isRadioOnly"
            :class="$style.controlButton"
            @click="$emit('next')"
        >
            <span></span>
        </button>
        
        <div :class="$style.radioKnob" @click="$emit('nextStation')">
            <div :class="$style.knobIndicator"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    isPlaying: boolean
    isRadioOnly?: boolean
}>()

defineEmits(['toggle', 'prev', 'next', 'nextStation'])
</script>

<style module>
.controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: auto;
}

.playButton {
    background: #333 !important;
    width: 32px;
    height: 32px;
    border-radius: var(--radius-round) !important;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #444 !important;
}

.controlButton {
    background: none;
    border: none;
    color: var(--color-text-base);
    font-size: 16px;
    cursor: pointer;
    transition: all var(--transition-fast);
}

.controlButton:hover {
    color: var(--color-primary);
    transform: scale(1.1);
}

.radioKnob {
    width: 24px;
    height: 24px;
    background: linear-gradient(145deg, #333, #111);
    border: 1px solid #444;
    border-radius: var(--radius-round);
    cursor: pointer;
    position: relative;
    box-shadow: 2px 2px 5px rgba(0,0,0,0.5);
}

.knobIndicator {
    position: absolute;
    width: 2px;
    height: 6px;
    background: #fff;
    top: 2px;
    left: 50%;
    transform: translateX(-50%);
}

.radioKnob:active {
    transform: rotate(30deg);
}
</style>
