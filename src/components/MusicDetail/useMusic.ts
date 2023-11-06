import ColorThief from 'colorthief'
import useMusic from "@/components/MusicPlayer/useMusic";
import {useMusicAction} from "@/store/music";

let pointer = 1
export function gradualChange(img: HTMLImageElement) {
  const music = useMusicAction()
  const gradual1 = document.querySelector('#gradual1') as HTMLDivElement
  const gradual2 = document.querySelector('#gradual2') as HTMLDivElement
  if(img) {
    const colorThief = new ColorThief()
    const rgb = colorThief.getPalette(img, 2) as Array<Array<string>>
    music.updateBgColor(rgb)
    if(pointer === 0) {
      gradual1.style.backgroundImage = `linear-gradient(rgb(${rgb[0]}), rgb(${rgb[1]}))`
      gradual1.style.opacity = '1'

      gradual2.style.opacity = '0'
      pointer = 1
    } else {
      gradual2.style.backgroundImage = `linear-gradient(rgb(${rgb[0]}), rgb(${rgb[1]}))`
      gradual2.style.opacity = '1'

      gradual1.style.opacity = '0'
      pointer = 0
    }

  } else {
    if(pointer === 0) {
      gradual1.style.backgroundImage = ``
      gradual1.style.opacity = '1'

      gradual2.style.opacity = '0'
      pointer = 1
    } else {
      gradual2.style.backgroundImage = ``
      gradual2.style.opacity = '1'

      gradual1.style.opacity = '0'
      pointer = 0
    }
  }
}

export const useRhythm = () => {
  const splitCount = 4
  const splitImg = (img: HTMLImageElement) => {
    for (let i = 0; i < splitCount; i++) {
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')!
      const { clientWidth, clientHeight } = document.body
      const px = Math.max(clientWidth, clientHeight) / 2
      canvas.width = px
      canvas.height = px

      if(i === 0) {
        context.drawImage(img, 0, 0)
      } else if(i === 1) {

      } else if(i === 2) {

      } else if(i === 3) {

      }
    }
  }

  return {
    splitImg,
  }
}







