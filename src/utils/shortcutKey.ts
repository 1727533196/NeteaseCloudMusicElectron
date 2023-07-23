//  快捷键配置文件

const keydownHandler = (event: KeyboardEvent) => {
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
      event.code === 'ArrowRight' ? $audio.time += 10 : $audio.time -= 10

      break
  }

}
// 按键配置
document.body.addEventListener('keydown', keydownHandler)

export {}