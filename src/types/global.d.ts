import {MusicPlayerInstanceType} from "@/components/MusicPlayer/index.vue";

export interface IElectronAPI {
    platform: string;
}

declare global {
    interface Window{
        electronAPI: IElectronAPI
        $audio: MusicPlayerInstanceType
    }
    let $audio: Window['$audio'];
}
