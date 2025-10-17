<template>
    <div :class="$style.waybar">
        <div :class="[$style.section, $style.left]">
            <span :class="$style.item"> </span>
            <span :class="$style.item"> </span>
        </div>

        <div :class="[$style.section, $style.center]">
            <span :class="[$style.item, $style.time]">{{ time }}</span>
        </div>

        <div :class="[$style.section, $style.right]">
            <span :class="$style.icon">&#xf120;</span>

            <span :class="$style.icon">
                <!-- Bluetooth icon + status -->
                &#xf293; {{ bluetoothStatus }}
            </span>

            <span :class="$style.icon">
                <!-- Battery icon + level -->
                &#xf240; {{ batteryLevel }}%
            </span>

            <span :class="$style.icon">
                <!-- Wifi icon + status -->
                &#xf1eb; {{ wifiStatus }}
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const time = ref('')
const batteryLevel = ref('N/A')
const bluetoothStatus = ref('Unavailable')
const wifiStatus = ref('Unavailable')

function updateTime() {
    const now = new Date()
    time.value = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })
}

// Battery API setup
let battery: any = null

async function setupBattery() {
    if ('getBattery' in navigator) {
        battery = await (navigator as any).getBattery()
        function updateBatteryInfo() {
            batteryLevel.value = Math.round(battery.level * 100)
        }
        updateBatteryInfo()

        battery.addEventListener('levelchange', updateBatteryInfo)
    } else {
        batteryLevel.value = 'N/A'
    }
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

onMounted(() => {
    updateTime()
    setInterval(updateTime, 60000) // Update every minute

    setupBattery()
    setupBluetooth()
    setupWifi()
})

onBeforeUnmount(() => {
    if (battery) {
        battery.removeEventListener('levelchange', () => {})
    }
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
    white-space: nowrap;
}
</style>
