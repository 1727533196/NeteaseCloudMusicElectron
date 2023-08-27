import ColorThief from 'colorthief'

let pointer = 1
export function gradualChange(img: HTMLImageElement) {
  const gradual1 = document.querySelector('#gradual1') as HTMLDivElement
  const gradual2 = document.querySelector('#gradual2') as HTMLDivElement
  if(img) {
    const colorThief = new ColorThief()
    const rgb = colorThief.getPalette(img, 2) as Array<Array<string>>
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