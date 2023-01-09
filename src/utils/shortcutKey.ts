//  快捷键配置文件

const keydownHandler = (event: KeyboardEvent) => {
  console.log('Y---> event.code', event.code)
  // 空格暂停|播放
  switch (event.code) {
    case 'Space' :
      event.preventDefault()
      if($audio.isPlay) {
        $audio.pause()
      } else {
        $audio.play()
      }
      break
    case 'ArrowRight':
    case 'ArrowLeft' :
      console.log('Y---> 111', 1)
      event.code === 'ArrowRight' ? $audio.time += 10 : $audio.time -= 10

      break
  }

}
// 案件配置
document.body.addEventListener('keydown', keydownHandler)


export {}