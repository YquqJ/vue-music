
// 获取min与max之间的随机整数,包括min，max
function getRandomIndex(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

// 洗牌  将数组中的元素打乱重排
export function shuffle(list) {
  let _arr = list.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomIndex(0, i)
    let t = _arr[j]
    _arr[j] = _arr[i]
    _arr[i] = t
  }
  return _arr
}

// 防抖
export function debounce(func, delay) {
  let timer

  return function(...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}