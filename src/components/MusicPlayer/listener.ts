import {onMounted} from 'vue';
import {getScreenFps} from '@/utils';


export type ListenerName = 'changeSong' | 'handleFirstLoad' | 'handleTimeUpdate'

export const useListener = (audio: any) => {
  let fps = null
  function clearWatcher() {
    if(val > 115) {
      startMoveLyr()
    } else {
      setInterval(step, 1)
    }
  }

  function startMoveLyr() {
    executeListener('handleTimeUpdate')
    requestAnimationFrame(startMoveLyr)
  }

  function initWatcher() {
    getScreenFps().then(val => {
      console.log('fps:',val)
      fps = val
      if(val > 115) {
        startMoveLyr()
      } else {
        setInterval(() => {
          executeListener('handleTimeUpdate')
        }, 1)
      }
    })
  }

  onMounted(() => {
    console.log(audio.value)
    // 每次资源切换时执行，可以监听歌曲切换，不在使用watch
    audio.value?.addEventListener('loadeddata', () => {
      console.log('歌曲切换')
      executeListener('changeSong')
    })
    // 事件处理函数
    function onFirstLoad() {
      console.log('首次设置src，进行初始化操作...');
      executeListener('handleFirstLoad')
      initWatcher()
      audio.value?.removeEventListener('loadedmetadata', onFirstLoad)
    }

    // 监听loadedmetadata事件
    audio.value.addEventListener('loadedmetadata', onFirstLoad);
  })

  const listenerObj = {
    changeSong: [], // 歌曲切换
    handleFirstLoad: [], //  首次设置src，进行初始化操作
    handleTimeUpdate: [], // timeupdate
  }

  const addListener = (listener: ListenerName, cb) => {
    listenerObj[listener].push(cb)
  }
  const executeListener = (listener: ListenerName) => {
    const len = listenerObj[listener].length
    if(len < 1) {
      return
    }
    for(let i = 0; i < len; i++) {
      listenerObj[listener][i]()
    }
  }

  return {
    addListener
  }
}