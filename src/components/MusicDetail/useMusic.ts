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

export const useRhythm = (insertionEl: HTMLElement) => {
  const splitImg = (img: HTMLImageElement) => {
    const smallImageWidth = img.width / 2;
    const smallImageHeight = img.height / 2;
    console.log('smallImageWidth-->', smallImageWidth)
    console.log('smallImageHeight-->', smallImageHeight)
    const cutImagesData = [];
    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        const cutCanvas = document.createElement('canvas');
        cutCanvas.width = smallImageWidth;
        cutCanvas.height = smallImageHeight;
        const cutCtx = cutCanvas.getContext('2d')!;

        cutCtx.drawImage(
          img,
          x * smallImageWidth,
          y * smallImageHeight,
          smallImageWidth,
          smallImageHeight,
          0,
          0,
          smallImageWidth,
          smallImageHeight
        );

        const smallImageDataUrl = cutCanvas.toDataURL("image/png");
        cutImagesData.push(smallImageDataUrl);
        const smallImage = new Image();
        smallImage.src = smallImageDataUrl;
        smallImage.classList.add('cut-image');
        insertion(smallImage)
      }
    }
  }

  const insertion = (smallImage: HTMLImageElement) => {
    insertionEl.appendChild(smallImage)
  }

  return {
    splitImg,
  }
}







