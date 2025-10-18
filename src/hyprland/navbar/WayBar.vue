<template>
    <div :class="$style.waybar">
        <div :class="[$style.section, $style.left]">
            <span :class="$style.item"> </span>
            <button :class="$style.item" @click="$emit('openTerminal')">
                
            </button>
        </div>

        <div :class="[$style.section, $style.center]">
            <span :class="[$style.item, $style.time]">{{ time }}</span>
            <NowPlayingIsland
                :wifi="wifiInfo"
                :bluetooth="bluetoothInfo"
                :battery="batteryInfo"
            />
        </div>

        <div :class="[$style.section, $style.right]">
            <span
                :class="[
                    $style.icon,
                    bluetoothInfo.power ? $style.active : $style.inactive,
                ]"
                title="Bluetooth"
            >
                
            </span>

            <BatteryStatus
                :percentage="batteryInfo.percentage"
                :state="batteryInfo.state"
            />

            <span
                :class="[
                    $style.icon,
                    wifiInfo.is_connected ? $style.active : $style.inactive,
                ]"
                :title="
                    wifiInfo.ssid
                        ? `WiFi: ${wifiInfo.ssid}`
                        : 'WiFi: Disconnected'
                "
            >
                
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NowPlayingIsland from './NowPlayingIsland.vue'
import BatteryStatus from './components/BatteryStatus.vue'

const time = ref('')
const wifiInfo = ref({
    ssid: null as string | null,
    signal_strength: null as number | null,
    is_connected: false,
    bssid: null as string | null,
    mac_address: null as string | null,
    channel: null as string | null,
    security: null as string | null,
    phy_mode: null as string | null,
    mcs_index: null as number | null,
    nss: null as number | null,
    tx_rate: null as string | null,
    noise: null as number | null,
    country_code: null as string | null,
})
const bluetoothInfo = ref({
    power: false,
    discoverable: false,
    connectable: false,
    scanning: false,
    devices: [] as Array<{
        name: string | null
        address: string
        paired: boolean
        connected: boolean
    }>,
})
const batteryInfo = ref({
    percentage: 0,
    state: 'Charging' || 'Duscharging',
    warning_level: '',
})

function updateTime() {
    const now = new Date()
    time.value = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
    })
}

async function fetchSystemInfo() {
    try {
        const [wifiRes, bluetoothRes, batteryRes] = await Promise.all([
            fetch('http://127.0.0.1:3000/wifi').then((res) => res.json()),
            fetch('http://127.0.0.1:3000/bluetooth').then((res) => res.json()),
            fetch('http://127.0.0.1:3000/battery').then((res) => res.json()),
        ])
        wifiInfo.value = wifiRes
        bluetoothInfo.value = bluetoothRes
        batteryInfo.value = batteryRes
    } catch (error) {
        console.error('Failed to fetch system info:', error)
    }
}

onMounted(() => {
    updateTime()
    setInterval(updateTime, 60000) // Update every minute
    fetchSystemInfo()
    setInterval(fetchSystemInfo, 5000) // Update system info every 5 seconds
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
    background-color: rgba(30, 30, 30, 0.35);
    backdrop-filter: blur(12px) saturate(1.8);
    -webkit-backdrop-filter: blur(12px) saturate(1.8);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
    color: #fff;
    font-family: 'JetBrainsMono Nerd Font', monospace;
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

.active {
    color: #61afef;
    opacity: 1;
}

.inactive {
    color: #555;
    opacity: 0.4;
}
</style>
