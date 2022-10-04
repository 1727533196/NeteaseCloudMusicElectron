import {useFlags} from "@/store/flags";

export const handle = () => {
  const flags = useFlags();

  const maximize = () => {
    window.electronAPI.maximize()
    flags.isMaximize = true;
  }
  const unmaximize = () => {
    window.electronAPI.unmaximize()
    flags.isMaximize = false;
  }
  const minimize = () => {
    window.electronAPI.minimize()
    flags.isMinimize = true;
  }
  const restore = () => {
    window.electronAPI.restore()
    flags.isMinimize = false;
  }
  const close = () => {
    window.electronAPI.close()
  }

  return {
    maximize,
    unmaximize,
    minimize,
    restore,
    close,
  }
}