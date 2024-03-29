import ColorThief from 'colorthief'
import {randomNum} from "@/utils";

let pointer = 1

export function colorExtraction(img: HTMLImageElement) {
  const colorThief = new ColorThief()
  return colorThief.getPalette(img) as Array<Array<string>>
}

export function gradualChange(img: HTMLImageElement, rgb: Array<Array<string>>) {
  const gradual1 = document.querySelector('#gradual1') as HTMLDivElement
  const gradual2 = document.querySelector('#gradual2') as HTMLDivElement
  if(img) {
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
  const style = document.createElement('style')
  const splitImg = (img: HTMLImageElement) => {
    const smallImageWidth = img.width / 2;
    const smallImageHeight = img.height / 2;
    const cutImagesData = [];
    let index = 0
    insertionEl.innerHTML = ''
    style.innerHTML = ''

    for (let y = 0; y < 2; y++) {
      for (let x = 0; x < 2; x++) {
        const cutCanvas = document.createElement('canvas');
        cutCanvas.width = smallImageWidth;
        cutCanvas.height = smallImageHeight;
        const cutCtx = cutCanvas.getContext('2d')!;
        index++

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
        smallImage.classList.add(`cut-image`);
        const deg = randomNum(0, 360)
        smallImage.style.transform = `rotate(${deg}deg)`;

        style.innerHTML += `
         @keyframes cut-rotate${index} {
          from {
            transform: rotate(${deg}deg);
          }

          to {
            transform: rotate(${deg + 360}deg);
          }
        }
        `
        smallImage.style.animation = `cut-rotate${index} 10s infinite linear`
        insertion(smallImage)
      }
    }
    document.head.appendChild(style)
  }

  const insertion = (smallImage: HTMLImageElement) => {
    insertionEl.appendChild(smallImage)
  }

  return {
    splitImg,
  }
}







