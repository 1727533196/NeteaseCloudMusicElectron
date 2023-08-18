import {useFlags} from "@/store/flags";
// import {ipcRenderer} from 'electron'

export const handle = () => {
  const flags = useFlags();

  const maximize = () => {
    ipcRenderer.send('maximize')
    flags.isMaximize = true;
  }
  const unmaximize = () => {
    ipcRenderer.send('unmaximize')
    flags.isMaximize = false;
  }
  const minimize = () => {
    ipcRenderer.send('minimize')
    flags.isMinimize = true;
  }
  const restore = () => {
    ipcRenderer.send('restore')
    flags.isMinimize = false;
  }
  const close = () => {
    ipcRenderer.send('close')
  }

  return {
    maximize,
    unmaximize,
    minimize,
    restore,
    close,
  }
}