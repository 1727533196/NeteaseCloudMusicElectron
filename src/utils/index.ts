// 根据毫秒数格式化出分钟及其秒数 msec: 275573 = 04:35
export function formattingTime(msec: number) {
  let result = ''
  const sec = Math.floor(msec / 1000 % 60)
  const minute = Math.floor((msec / 1000 - sec) / 60)

  result = `${minute.toString().length <= 1
    ? '0'+minute : minute}:${sec.toString().length <= 1 ? '0'+sec : sec}`

  return result
}
// interface Test {
//   name: `${'P'}${string}`
// }

// 时间反序列化 timeFormat: '11:02.410' = 662.41/s     5 * 60 = 300 + 02.410
export function timeDeserialize(timeFormat: string) {
  const timeArr: string[] = timeFormat.split(':') // [11, 02, 41]
  let result: number = 0
  for(let i = 0; i < timeArr.length; i++) {
    if(i === 0) {
      result += +timeArr[i] * 60
    } else if(i === 1) {
      result += +`${timeArr[i]}`
    }
  }
  return result
}
const test: {notSupportedScroll?: boolean} = {}
// 格式化歌词字符串
export function formatLyric(lyric: string) {
  const result: Array<{time: number | boolean, text: string, line: number}> & {notSupportedScroll?: boolean} = []
  const lyricArr = lyric.split(/\n/)
  lyricArr.pop() // 删除最后一行多余的

  // 会出现这两种情况, 所以要做处理
  // [00:24.46]春雨后太阳缓缓的露出笑容;  lyricArr[i].split(']') => ['[00:24.46', '春雨后太阳缓缓的露出笑容']
  // [03:05.32][01:28.24]这个夏天 融化了整个季节  => ['[03:05.32', '[01:28.24', '这个夏天 融化了整个季节']
  let isSort = false
  let overlookCount = -1
  for (let i = 0; i < lyricArr.length; i++) {
    if(lyricArr[i][0] === '{') {
      overlookCount++
      continue
    }
    let lyricItem = lyricArr[i].split(']')
    const text = lyricItem.pop() as string
    const index = i - overlookCount
    if(lyricItem[0] === undefined) {
      result.push({ time: false, text: lyricArr[i], line: index })
      result.notSupportedScroll = true
      continue
    }
    // [00:24.46]春雨后太阳缓缓的露出笑容 这种情况就可以直接赋值
    if(lyricItem.length > 1) {
      isSort || (isSort = true)
      for (let i = 0; i < lyricItem.length; i++) {
        const time = timeDeserialize(lyricItem[i].replace('[', ''))
        result.push({ time, text, line: index })
      }
    } else {
      const time = timeDeserialize(lyricItem[0].replace('[', ''))
      result.push({ time, text, line: index })
    }
  }
  if(isSort) {
    result.sort((a, b) => (a.time as number - (b.time as number)))
    for (let i = 0; i < result.length; i++) {
      result[i].line = i + 1
    }
  }

  return result
}

export type Yrc = {
  time: number
  duration: number
  yrc: Array<{
    text: string
    transition: number
    cursor: number
    width: number | string
  }>
}
// 解析逐字歌词
export function parseYrc(yrc: string) {
  type info = {
    "t": number,
    "c": [
      {
        "tx": string
      },
      {
        "tx": string,
        "li": string,
        "or": string
      },
      {
        "tx": string
      },
      {
        "tx": string
      }
    ]
  }
  const result:Yrc[] = []
  let obj = {
    time: 0,
    duration: 0,
    line: 0,
    yrc: [],
  }

  let startIndex = 0
  let endIndex = 0
  let present = '' // 当前扫描到的标识
  let index = 1 // 每行歌词的index
  let startCount = 0 // 当前扫描到的{数量
  let endCount = 0 // 当前扫描到的}数量
  let isEnd = true
  for (let i = 0; i < yrc.length; i++) {
    const target = yrc[i]
    if(target === '{') {
      if(isEnd) {
        startIndex = i
        // obj = { time: 0, duration: 0, line: 0, yrc: [] }
      }
      startCount++
      isEnd = false
      present = '{'

    } else if(target === '}') {
      endCount++
      if(startCount === endCount) {
        endIndex = i
        isEnd = true
        startCount = 0
        endCount = 0
        // const str = JSON.parse(yrc.slice(startIndex, endIndex + 1)) as info
        // obj.time = str.t / 1000
        // obj.duration = str.t / 1000
        // obj.line = index++
        // let temp = {
        //   text: '',
        //   transition: 0,
        //   cursor: 0,
        // }
        // str.c.forEach(item => {
        //   temp.text += item.tx
        //
        // })
        // temp.transition = index === 2 ? str.t : (str.t / 1000) - result[index - 3].time
        // temp.cursor = str.t / 1000
        // obj.yrc = [temp]
        // result.push(obj)
        // if(index === 3) {
        //   result[0].duration = obj.time
        //   result[0].yrc[0].transition = obj.time
        // }
      }

    } else if(target === '[' && isEnd) {

      startIndex = i
      present = '['
      obj = { time: 0, duration: 0, line: 0, yrc: [] }
      result.push(obj)

    } else if(target === ']' && isEnd) {

      endIndex = i
      const timeArr = yrc.slice(startIndex+1, endIndex).split(',')
      obj.time = +timeArr[0] / 1000
      obj.duration = +timeArr[1] / 1000
      obj.line = index++

    } else if(target === '(' && isEnd) {

      startIndex = i
      present = '('

    } else if(target === ')' && isEnd) {
      endIndex = i
      const timeArr = yrc.slice(startIndex+1, endIndex).split(',')
      let text: string = '';
      let isBlank = false

      for (let o = i+1; o < yrc.length; o++) {
        if(['[', '('].includes(yrc[o])) {
          break
        }
        text += yrc[o]
      }
      obj.yrc.push({
        text: text,
        transition: timeArr[1] / 1000,
        cursor: timeArr[0] / 1000,
        width: 0,
        isBlank,
      })
    }

  }
  return result
}

// 随机产生指定范围数
export function randomNum(minNum: number,maxNum: number, decimals = false){
  if(decimals) {
    return Math.random() * (maxNum - minNum) + minNum;
  }
  return Math.floor(Math.random()*(maxNum-minNum+1)+minNum)
}


/*
* 首先Array(1,2,3,4)，你知道的吧,生成一个数组[1,2,3,4]
  然后是apply的问题,要求第二个参数是一个数组
  那么Array.apply(null,[1,2,3,4])生成的和上述的一样的[1,2,3,4]数组
  但apply有个奇怪的地方,当第二个参数是一个带有length属性的对象时,会当成一个数组使用
  所以Array.apply(null,{length:4})生成[undefined,undefined,undefined,undefined]
  相当于Array.apply(null,[undefined,undefined,undefined,undefined])

  +'1' 可以使string转为number
* */
// 格式化时间戳 YY-MM-DD hh:mm:ss = 2016-06-19 10:05:44    'YY-MM-DD hh:mm:ss' | 'YY-MM-DD'
export function formatDate(timestamp: number, format: string) {
  const date = new Date(timestamp)
  const year = date.getFullYear(),
    month = date.getMonth() + 1, // 月份是从0开始的
    day = date.getDate(),
    hour = date.getHours(),
    min = date.getMinutes(),
    sec = date.getSeconds()
  const preArr = Array.apply(null, Array(10)).map((item, index) => {
    return '0'+index
  })
  const result = format.replace(/YY/g, ''+year)
                       .replace(/MM/g, preArr[month] || ''+month)
                       .replace(/DD/g, preArr[day] || ''+day)
                       .replace(/hh/g, preArr[hour] || ''+hour)
                       .replace(/mm/g, preArr[min] || ''+min)
                       .replace(/ss/g, preArr[sec] || ''+sec)
  return result
}

// 获取当前月份的第几天
export function varDayim() {
  return new Date().getDate()
}

// 嵌套取值
export function lookup(obj: object, key: string | undefined): any {
  if(!key) {
    return ''
  }
  if(!key.includes('.')) {
    return obj[key as keyof typeof obj]
  }
  let temp = obj
  key.split('.').forEach(item => {
    temp = temp[item as keyof typeof obj]
  })
  return temp
}

// 切换图片过渡 (防止图片闪烁
export function toggleImg(src: string): Promise<HTMLImageElement> {
  const img = new Image()
  img.src = src;
  img.crossOrigin = 'Anonymous';
  img.width = document.body.clientWidth
  img.height = document.body.clientHeight
  return new Promise((resolve) => {
    img.onload = () => {
      resolve(img)
    }
  })
}

// 计算出合适的间隙
export function suitableSpace(el: Element, itemEl: Element, count: number): number {
  const totalWidth = el.clientWidth
  const itemWidth = itemEl.clientWidth * count
  const width = totalWidth - itemWidth
  const suitableMargin = width / (count - 1)

  return suitableMargin - 1
}

// 是否处于今天
export function calculateIsToday(timestamp: number): boolean {
  // 把今天的日期时分秒设置为00:00:00, 返回一个时间戳
  const todayDate = new Date().setHours(0,0,0,0)
  const paramsDate = new Date(timestamp).setHours(0,0,0,0)

  return todayDate === paramsDate
}

// 解析路径参数
export function parsePathQuery(path: string) {
  const result = {
    path: path,
    query: {

    } as {[key:string]: any}
  }
  const index = path.indexOf('?')
  if(index === -1) {
    return result
  }
  result.path = path.slice(0,index)
  const queryArr = path.slice(index+1).split('&')
  queryArr.forEach(item => {
    const index = item.indexOf('=')
    const key = item.slice(0, index)
    const value = item.slice(index + 1)
    result.query[key] = value
  })
  return result
}

// 根据时间执行总时长    !!!! 请注意，当done为true时，必须调用pause来中断函数执行
export function animation(time: number, cb: (elapsed: number, done: boolean) => void): (isPause: boolean) => void {
  let start: number | undefined;
  let intervalId: number | undefined;
  let elapsed = 0;
  let paused = false;

  function step() {
    if (!paused) {
      elapsed = Date.now() - (start ?? Date.now());
      const done = elapsed >= time;
      if (done) {
        cb(time, true);
        clearInterval(intervalId);
      } else {
        cb(elapsed, false);
      }
    }
  }

  start = Date.now();
  intervalId = setInterval(step, 0); // 模拟 requestAnimationFrame 的频率

  return (isPause: boolean) => {
    if (isPause) {
      paused = true;
    } else {
      if (paused) {
        paused = false;
        start = Date.now() - elapsed; // 重置开始时间
      }
    }
  };
}
// const element = document.getElementById("box1");
// animation(10000, (elapsed) => {
//   const count = elapsed / 10000 * 100
//   element.style.width = `${count}%`;
// })


export function rgbToHsl(r: number, g: number, b: number) {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if(max == min){
    h = s = 0; // achromatic
  }else{
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch(max){
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h, s, l];
}

export function isGoodColor(r: number, g: number, b: number) {
  let hsl = rgbToHsl(r, g, b);
  let h = hsl[0], s = hsl[1], l = hsl[2];
  // 过滤掉过亮或过暗，过饱和或过淡的颜色
  if (l < 0.2 || l > 0.8 || s < 0.2 || s > 0.8) {
    return false;
  }
  return true;
}
export function findBestColors(colors: Array<Array<string>>, num: number): Array<Array<string>> {
  let goodColors = colors.filter(color => isGoodColor(...color));
  console.log(goodColors, colors)
  if (goodColors.length < num) {
    let badColors = colors.filter(color => !isGoodColor(...color));
    goodColors = [...goodColors, ...badColors.slice(0, num - goodColors.length)];
  }

  let bestColors = [];
  for (let i = 0; i < num; i++) {
    let bestColor;
    let maxDifference = 0;
    for (let j = 0; j < goodColors.length; j++) {
      let color = goodColors[j];
      let minDifference = bestColors.reduce((min, bestColor) => {
        let hsl1 = rgbToHsl(...bestColor);
        let hsl2 = rgbToHsl(...color);
        let difference = Math.abs(hsl1[1] - hsl2[1]) + Math.abs(hsl1[2] - hsl2[2]);
        return Math.min(min, difference);
      }, Infinity);
      if (minDifference > maxDifference) {
        maxDifference = minDifference;
        bestColor = color;
      }
    }
    bestColors.push(bestColor);
    let index = goodColors.indexOf(bestColor);
    goodColors.splice(index, 1);
  }

  return bestColors;
}

// 获取屏幕刷新率
export const getScreenFps = (() => {
  // 先做一下兼容性处理
  const nextFrame = ([
    window.requestAnimationFrame,
    window.webkitRequestAnimationFrame,
    window.mozRequestAnimationFrame
  ]).find(fn => fn)
  if (!nextFrame) {
    console.error('requestAnimationFrame is not supported!')
    return
  }
  return (targetCount = 50) => {
    // 判断参数是否合规
    if (targetCount < 1) throw new Error('targetCount cannot be less than 1.')
    const beginDate = Date.now()
    let count = 0
    return new Promise(resolve => {
      (function log() {
        nextFrame(() => {
          if (++count >= targetCount) {
            const diffDate = Date.now() - beginDate
            const fps = (count / diffDate) * 1000
            return resolve(fps)
          }
          log()
        })
      })()
    })
  }
})()