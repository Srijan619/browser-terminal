import { ref, computed, onMounted, onUnmounted } from 'vue'
import { RADIO_STATIONS } from '../config/radioConfigs'

export function useRadio() {
    const currentStationIndex = ref(0)
    const isPlaying = ref(false)
    const audioRef = ref<HTMLAudioElement | null>(null)
    const currentTrack = ref({ artist: 'Loading...', title: '' })
    const dialRotation = ref(-45)

    const currentStation = computed(() => RADIO_STATIONS[currentStationIndex.value])

    const currentTrackDisplay = computed(() => {
        const { artist, title } = currentTrack.value
        if (artist && title) return `${artist} - ${title}`
        return title || artist || 'Loading...'
    })

    async function fetchMetadata() {
        const station = currentStation.value
        if (!station.metadataUrl) return

        try {
            // Special handling for NPR-style JSON
            if (station.id === 'jazz24') {
                const res = await fetch(station.metadataUrl)
                const data = await res.json()
                const song = data.onNow?.song || {}
                currentTrack.value = {
                    artist: song.artistName || 'Unknown Artist',
                    title: song.trackName || 'Unknown Track'
                }
            } else {
                // Generic fallback for other stations
                currentTrack.value = { artist: station.name, title: 'Streaming Live' }
            }

            // Random dial wiggle on metadata update
            dialRotation.value = -45 + (Math.random() * 90)
        } catch (e) {
            console.error('Failed to fetch radio metadata:', e)
            currentTrack.value = { artist: 'Error', title: 'Live Stream' }
        }
    }

    function togglePlay() {
        if (!audioRef.value) return

        if (isPlaying.value) {
            audioRef.value.pause()
        } else {
            audioRef.value.play()
        }
        isPlaying.value = !isPlaying.value
    }

    function nextStation() {
        currentStationIndex.value = (currentStationIndex.value + 1) % RADIO_STATIONS.length
        resetAudio()
    }

    function prevStation() {
        currentStationIndex.value = (currentStationIndex.value - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length
        resetAudio()
    }

    function resetAudio() {
        if (!audioRef.value) return
        audioRef.value.pause()
        audioRef.value.load()
        if (isPlaying.value) {
            audioRef.value.play()
        }
        fetchMetadata()
    }

    let intervalId: number | undefined

    onMounted(() => {
        fetchMetadata()
        intervalId = setInterval(fetchMetadata, 30_000) as unknown as number
    })

    onUnmounted(() => {
        if (intervalId) clearInterval(intervalId)
        if (audioRef.value) audioRef.value.pause()
    })

    return {
        audioRef,
        currentStation,
        currentTrack,
        currentTrackDisplay,
        isPlaying,
        dialRotation,
        togglePlay,
        nextStation,
        prevStation,
        fetchMetadata
    }
}
