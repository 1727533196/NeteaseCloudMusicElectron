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
  for (let i = 0; i < lyricArr.length; i++) {
    let lyricItem = lyricArr[i].split(']')
    const text = lyricItem.pop() as string
    if(lyricItem[0] === undefined) {
      result.push({ time: false, text: lyricArr[i], line: i+1 })
      result.notSupportedScroll = true
      continue
    }
    // [00:24.46]春雨后太阳缓缓的露出笑容 这种情况就可以直接赋值
    if(lyricItem.length > 1) {
      isSort || (isSort = true)
      for (let i = 0; i < lyricItem.length; i++) {
        const time = timeDeserialize(lyricItem[i].replace('[', ''))
        result.push({ time, text, line: i+1 })
      }
    } else {
      const time = timeDeserialize(lyricItem[0].replace('[', ''))
      result.push({ time, text, line: i+1 })
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

// 随机产生指定范围数
export function randomNum(minNum: number,maxNum: number){
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
// 格式化时间戳 YY-MM-DD hh:mm:ss = 2016-06-19 10:05:44
export function formatDate(timestamp: number, format: 'YY-MM-DD hh:mm:ss' | 'YY-MM-DD') {
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
  img.src = src
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
