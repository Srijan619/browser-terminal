<template>
    <div :class="$style.trackInfo">
        <div :class="$style.stationName">{{ stationName }}</div>
        <div :class="$style.scrollingTextContainer">
            <div :class="$style.scrollingText">
                {{ trackDisplay }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    stationName: string
    trackDisplay: string
}>()
</script>

<style module>
.trackInfo {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}

.stationName {
    color: var(--color-primary);
    font-size: 10px;
    font-weight: bold;
    letter-spacing: 1px;
    margin-bottom: 4px;
    transition: color var(--transition-fast);
}

.scrollingTextContainer {
    overflow: hidden;
    position: relative;
    width: 100%;
}

.scrollingText {
    white-space: nowrap;
    font-size: 13px;
    font-weight: 500;
    animation: scroll 15s linear infinite;
    display: inline-block;
}

@keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-50%); }
}
</style>
