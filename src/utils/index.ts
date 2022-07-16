// 根据毫秒数格式化出分钟及其秒数
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