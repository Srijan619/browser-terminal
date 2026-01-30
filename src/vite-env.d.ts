/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_INITIAL_VIEW: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}
