import {onMounted} from 'vue';
import {getScreenFps} from '@/utils';


export type ListenerName = 'changeSong' | 'handleFirstLoad' | 'handleTimeUpdate' | 'cutSong'

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
    // 歌曲资源切换完成时
    audio.value?.addEventListener('loadeddata', () => {
      playSomethingListener('handleTimeUpdate')
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
    cutSong: [],
  }
  const tempListener = {
    changeSong: [], // 歌曲切换
    handleFirstLoad: [], //  首次设置src，进行初始化操作
    handleTimeUpdate: [], // timeupdate
    cutSong: [],
  }

  const addListener = (listener: ListenerName, cb) => {
    listenerObj[listener].push(cb)
    tempListener[listener].push(cb)
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
  const pauseSomethingListener = (listener: ListenerName) => {
    tempListener[listener] = listenerObj[listener]
    listenerObj[listener] = []
  }
  const playSomethingListener = (listener: ListenerName) => {
    listenerObj[listener] = tempListener[listener] || []
  }

  return {
    addListener,
    executeListener,
    pauseSomethingListener,
    playSomethingListener,
  }
}