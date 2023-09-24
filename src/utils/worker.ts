import {animation} from "@/utils/index";

let pause: (isPause: boolean) => void
onmessage = function (event) {
  const data  = event.data
  if(data.pause) {
    // 关闭上一次
    pause && pause(data.val)
  } else if(data.transition) {
    pause = animation(data.transition, (elapsed, done) => {
      if(done) {
        pause(true)
      }
      postMessage({
        elapsed, done, transition: data.transition
      })
    })
  }
}

