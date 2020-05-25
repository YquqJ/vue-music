import storage from 'good-storage'

const SEARCH_KEY = '__search__'
const MAX_SEARCH_LEN = 15

const PLAY_KEY = '__play__'
const MAX_PLAY_LEN = 200

const FAVORITE_KEY = '__favorite__'
const MAX_FAVORITE_LEN = 100

// 将元素插入数组中
function insertArray(arr, val, compare, maxLen) {
  let index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}

// 从数组中删除一个元素
function deleteFromArray(arr, compare) {
  let index = arr.findIndex(compare)
  arr.splice(index, 1)
}

export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, MAX_SEARCH_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function savePlay(song) {
  let playHistory = storage.get(PLAY_KEY, [])
  insertArray(playHistory, song, (item) => {
    return item.id === song.id
  }, MAX_PLAY_LEN)
  storage.set(PLAY_KEY, playHistory)
  return playHistory
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

export function saveFavorite(song) {
  let list = storage.get(FAVORITE_KEY, [])
  insertArray(list, song, (item) => {
    return song.id === item.id
  }, MAX_FAVORITE_LEN)
  storage.set(FAVORITE_KEY, list)
  return list
}

export function deleteFavorite(song) {
  let list = storage.get(FAVORITE_KEY, [])
  deleteFromArray(list, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, list)
  return list
}

export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}