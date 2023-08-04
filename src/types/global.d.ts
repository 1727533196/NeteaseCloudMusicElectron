import {MusicPlayerInstanceType} from "@/components/MusicPlayer/index.vue";

declare global {
    interface Window{
        $audio: MusicPlayerInstanceType
        $login: any
    }
    const $audio: Window['$audio'];
    const electronAPI: Window['electronAPI'];
}

type Channel = 'maximize' | 'unmaximize' | 'minimize' | 'restore' | 'close'
declare module 'electron' {
    const ipcRenderer: {
        send: (channel: Channel) => void
    }
}