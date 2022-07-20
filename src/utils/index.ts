// 根据毫秒数格式化出分钟及其秒数 msec: 275573 = 04:35
export function formattingTime(msec: number) {
  let result = ''
  const sec = Math.floor(msec / 1000 % 60)
  const minute = Math.floor((msec / 1000 - sec) / 60)

  result = `${minute.toString().length <= 1
    ? '0'+minute : minute}:${sec.toString().length <= 1 ? '0'+sec : sec}`

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