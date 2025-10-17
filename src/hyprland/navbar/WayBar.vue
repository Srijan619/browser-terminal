<template>
    <div :class="$style.waybar">
        <div :class="[$style.section, $style.left]">
            <span :class="$style.item"> </span>
            <span :class="$style.item"> </span>
        </div>

        <div :class="[$style.section, $style.center]">
            <span :class="[$style.item, $style.time]">{{ time }}</span>
            <NowPlayingIsland />
        </div>

        <div :class="[$style.section, $style.right]">
            <span
                :class="[
                    $style.icon,
                    bluetoothStatus === 'On' ? $style.active : $style.inactive,
                ]"
                title="Bluetooth"
            >
                &#xf293;
            </span>

            <span :class="[$style.icon, $style.active]" title="Battery">
                &#xf240;
            </span>

            <span
                :class="[
                    $style.icon,
                    wifiStatus === 'Connected'
                        ? $style.active
                        : $style.inactive,
                ]"
                title="WiFi"
            >
                &#xf1eb;
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NowPlayingIsland from './NowPlayingIsland.vue'

// INFO: Do me from rust to here
const time = ref('')
const bluetoothStatus = ref('Unavailable')
const wifiStatus = ref('Unavailable')

function updateTime() {
    const now = new Date()
    time.value = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })
}

// Bluetooth placeholder (no direct status available in browser)
function setupBluetooth() {
    // Browsers don’t expose Bluetooth status directly, so set placeholder or integrate native API if you want
    bluetoothStatus.value = 'Off' // Or "On" if you have native integration
}

// Wifi placeholder (no direct status available in browser)
function setupWifi() {
    // Browsers don’t expose WiFi connection status or signal strength
    wifiStatus.value = navigator.onLine ? 'Connected' : 'Offline'
}

onMounted(async () => {
    updateTime()
    setInterval(updateTime, 60000) // Update every minute

    setupBluetooth()
    setupWifi()
})
</script>

<style module>
.waybar {
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: 100%;

    display: flex;
    justify-content: space-between;
    align-items: center;

    /* 🔮 Glassmorphism styles */
    background-color: rgba(30, 30, 30, 0.35); /* translucent dark */
    backdrop-filter: blur(12px) saturate(1.8); /* the "frosted glass" effect */
    -webkit-backdrop-filter: blur(12px) saturate(1.8); /* Safari support */
    border-bottom: 1px solid rgba(255, 255, 255, 0.05); /* soft bottom border */
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3); /* subtle depth */

    color: #fff;
    font-size: 13px;
    padding: 0 15px;
    z-index: 999;
}

.section {
    display: flex;
    gap: 15px;
    align-items: center;
    margin-right: 2rem;
}

.center {
    flex: 1;
    justify-content: center;
    display: flex;
}

.item {
    white-space: nowrap;
}

.icon {
    transition:
        color 0.3s ease,
        opacity 0.3s ease;
}
/* Active: bright colored icons */
.active {
    color: #61afef; /* bright blue for active */
    opacity: 1;
}

/* Inactive: faded */
.inactive {
    color: #555; /* greyed out */
    opacity: 0.4;
}
</style>
