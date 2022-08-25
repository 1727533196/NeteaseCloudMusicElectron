import {MusicPlayerInstanceType} from "@/components/MusicPlayer/index.vue";

export interface IElectronAPI {
    loadPreferences: () => Promise<void>,
    platform: string;
    maximize: () => void,
    unmaximize: () => void,
    minimize: () => void,
    restore: () => void,
    close: () => void,
}

declare global {
    interface Window{
        electronAPI: IElectronAPI
        $audio: MusicPlayerInstanceType
    }
    const $audio: Window['$audio'];
    const electronAPI: Window['electronAPI'];
}
