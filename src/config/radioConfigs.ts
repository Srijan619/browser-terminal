export interface RadioStation {
    id: string
    name: string
    streamUrl: string
    metadataUrl: string
    dialRange: [number, number]
    frequencyLabel: string
}

export const RADIO_STATIONS: RadioStation[] = [
    {
        id: 'jazz24',
        name: 'JAZZ 24',
        streamUrl: 'https://knkx-live-a.edge.audiocdn.com/6285_128k?aw_0_1st.playerid=jazz24.org&uuid=vyfp1tf56',
        metadataUrl: 'https://api.composer.nprstations.org/v1/widget/5182a213e1c801ca005dbe32/now?format=json&style=v2&show_song=true',
        dialRange: [88, 108],
        frequencyLabel: '88.1 FM',
    },
    {
        id: 'kexp',
        name: 'KEXP 90.3',
        streamUrl: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
        metadataUrl: 'https://api.kexp.org/v2/plays/?limit=1', // Placeholder, real usage might need parsing
        dialRange: [90, 92],
        frequencyLabel: '90.3 FM',
    },
    {
        id: 'somafm-groovesalad',
        name: 'SomaFM Groove Salad',
        streamUrl: 'https://ice1.somafm.com/groovesalad-128-mp3',
        metadataUrl: 'https://somafm.com/songs/groovesalad.xml', // Parsing XML might be needed
        dialRange: [95, 105],
        frequencyLabel: 'Ambient',
    },
]
