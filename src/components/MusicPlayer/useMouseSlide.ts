import {reactive, Ref, ref, watch} from "vue";
import CurrentTime from './compoents/CurrentTime.vue';
import {useUserInfo} from "@/store";

export interface State {
  width: number // 当前进度条的百分比进度
  height: number // 当前音量高度百分比
  progress: boolean // 鼠标是否进入进度条
  volume: boolean // 鼠标是否进入音量调节
  left: number
  top: number
  current: 'progress' | 'volume'
  isMute: boolean
  currentTime: number // 当前播放到时间
}
export default (audio: Ref<HTMLAudioElement>,
                plan: Ref<InstanceType<typeof CurrentTime>>,
                volume: Ref<{volume: HTMLDivElement}>) => {
  const isDown = ref(false)
  const store = useUserInfo()
  const state = reactive<State>({
    width: 0,
    height: 0,
    progress: false,
    volume: false,
    left: 0,
    top: 0,
    current: 'progress',
    isMute: false,
    currentTime: 0,
  })
  let mouseIsEnter = false;
  let timer: NodeJS.Timeout

  // 初始化
  watch(audio, (value) => {
    const volume = Number(localStorage.getItem('volume') || 1)
    state.height = volume * 100
    value.volume = volume
    state.isMute = volume === 0
  })
  const timeupdate = () => {
    if(isDown.value){
      return
    }
    state.currentTime = audio.value!.currentTime
    state.width = (audio.value!.currentTime / audio.value!.duration) * 100
  }
  const volumechange = () => {
    // state.height = (audio.value!.volume / volume.value!.offsetHeight) * 100
  }
  const volumeHandler = (target: boolean) => {
    const volume = Number(localStorage.getItem('volume') || 1)
    state.isMute = target
    console.log('volume', volume, target)
    state.height = target ? 0 : volume * 100
    audio.value!.volume = target ? 0 : 1
    localStorage.setItem('volume', String(audio.value!.volume))
  }
  const mouseenterHandler = (target: 'progress' | 'volume' = 'progress') => {
    state[target] = true
  }
  const mouseleaveHandler = (target: 'progress' | 'volume' = 'progress') => {
    if(isDown.value && state.current === 'volume') {
      return
    }
    state[target] = false
  }
  const mousedownHandler = (e: MouseEvent, target: 'progress' | 'volume' = 'progress') => {
    if(target === 'progress') {
      const x = e.clientX - plan.value!.plan.offsetLeft;
      state.width = (x / plan.value!.plan.offsetWidth) * 100;
      audio.value!.currentTime = state.width * audio.value!.duration / 100
    } else if(target === 'volume') {
      const y = Math.abs(e.clientY - volume.value!.volume.getBoundingClientRect().bottom);
      state.height = y / volume.value!.volume.offsetHeight * 100
      audio.value!.volume = y / volume.value!.volume.offsetHeight
      clearTimeout(timer)
      timer = setTimeout(() => {
        localStorage.setItem('volume', String(audio.value!.volume))
        store.volume = audio.value!.volume
      }, 50)
    }
  }

  const circleDown = (e: MouseEvent, target: 'progress' | 'volume' = 'progress') => {
    state.current = target
    if(target === 'progress') {
      state.left = e.clientX - plan.value!.plan.offsetLeft
    } else if(target === 'volume') {
      state.top = e.clientY
      state.volume = true
    }
    isDown.value = true
  }
  const mouseupHandler = () => {
    mouseIsEnter = true
  }
  document.addEventListener('mousemove', (e) => {
    if(!isDown.value) {
      return
    }
    if(state.current === 'progress') {
      const {offsetLeft, offsetWidth} = plan.value.plan
      const width = ((e.clientX - offsetLeft) / offsetWidth * 100)
      state.width = width >= 100 ? 100 : width
    } else if(state.current === 'volume') {
      const {offsetHeight} = volume.value!.volume
      const height = Math.min((volume.value!.volume.getBoundingClientRect().bottom - e.clientY) / offsetHeight * 100, 100)
      state.height = height < 0 ? 0 : height
      audio.value!.volume = state.height / 100
      clearTimeout(timer)
      timer = setTimeout(() => {
        localStorage.setItem('volume', String(audio.value!.volume))
        store.volume = audio.value!.volume
      }, 50)
    }
  })
  document.addEventListener('mouseup', (e) => {
    if(!isDown.value) {
      return
    }
    state.volume = mouseIsEnter
    mouseIsEnter = false
    isDown.value = false
    state.current === 'progress' &&
      (audio.value!.currentTime = state.width * audio.value!.duration / 100)
  })

  return {
    state,
    timeupdate,
    mouseenterHandler,
    mouseleaveHandler,
    mousedownHandler,
    circleDown,
    volumeHandler,
    volumechange,
    mouseupHandler,
  }
}