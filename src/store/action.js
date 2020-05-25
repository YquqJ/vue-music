import * as types from './mutation-types'
import { playMode } from 'common/js/config'
import { shuffle } from 'common/js/util'
import { saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite } from 'common/js/cache'

// 查找歌曲对应的下标
function findIndex(list, song) {
  return list.findIndex(item => {
    return item.id === song.id
  })
}

// 点击歌曲播放
export const selectPlay = ({state, commit}, {list, index}) => {
  if (state.mode === playMode.random) {
    const shuffleList = shuffle(list)
    commit(types.SET_PLAYLIST, shuffleList)
    index = findIndex(shuffleList, list[index])
  } else {
    commit(types.SET_PLAYLIST, list)
  }
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENT_INDEX, index)
}

// 随机播放
export const randomPlay = ({commit, state}, {list}) => {
  commit(types.SET_SEQUENCE_LIST, list)
  commit(types.SET_PLAYING_STATE, true)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_CURRENT_INDEX, 0)
  commit(types.SET_PLAY_MODE, playMode.random)
  commit(types.SET_PLAYLIST, shuffle(list))
}

// 插入歌曲
export const insertSong = ({commit, state}, {song}) => {
  let playList = state.playlist.slice(0)
  let sequenceList = state.sequenceList.slice(0)
  let currentIndex = state.currentIndex

  // 记录当前播放歌曲
  let currentSong = playList[currentIndex]
  // 查找当前列表中是否有待插入的歌曲并返回其索引
  let fIndex = findIndex(playList, song)
  // 将歌曲插入列表
  currentIndex += 1
  playList.splice(currentIndex, 0, song)
  // 若是列表中已存在插入的歌曲
  if (fIndex > -1) {
    if (fIndex < currentIndex) {
      // 若相同歌曲在插入歌曲前面
      playList.splice(fIndex, 1)
      currentIndex--
    } else {
      // 若相同歌曲在插入歌曲后面
      playList.splice(fIndex + 1, 1)
    }
  }

  // 找到sequenceList当前歌曲下标，并在其后插入
  let currentSIndex = findIndex(sequenceList, currentSong) + 1
  let fSIndex = findIndex(sequenceList, song)
  sequenceList.splice(currentSIndex, 0, song)
  if (fSIndex > -1) {
    if (fSIndex < currentSIndex) {
      sequenceList.splice(fSIndex, 1)
    } else {
      sequenceList.splice(fSIndex + 1, 1)
    }
  }

  commit(types.SET_PLAYLIST, playList)
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  commit(types.SET_FULL_SCREEN, true)
  commit(types.SET_PLAYING_STATE, true)
}

// 搜索插入历史
export const saveSearchHistory = ({commit, state}, query) => {
  const searches = saveSearch(query)
  commit(types.SET_SEARCH_HISTORY, searches)
}

// 删除单条搜索历史
export const deleteSearchHistory = ({commit}, query) => {
  const searches = deleteSearch(query)
  commit(types.SET_SEARCH_HISTORY, searches)
}

// 清空搜索历史
export const clearSearchHistory = ({commit}) => {
  const searches = clearSearch()
  commit(types.SET_SEARCH_HISTORY, searches)
}

// 删除播放列表中单条歌曲
export const deleteSong = ({commit, state}, song) => {
  let sequenceList = state.sequenceList.slice()
  let playlist = state.playlist.slice()
  let currentIndex = state.currentIndex
  let fsIndex = findIndex(sequenceList, song)
  let fpIndex = findIndex(playlist, song)
  sequenceList.splice(fsIndex, 1)
  playlist.splice(fpIndex, 1)
  // 当删除一条歌曲时，相应的当前播放歌曲的下标也要移动，不然会乱套
  if (currentIndex > fpIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  commit(types.SET_SEQUENCE_LIST, sequenceList)
  commit(types.SET_PLAYLIST, playlist)
  commit(types.SET_CURRENT_INDEX, currentIndex)
  if (playlist.length === 0) {
    commit(types.SET_PLAYING_STATE, false)
  }
}

// 清空播放列表
export const deleteSongList = ({commit, state}) => {
  commit(types.SET_SEQUENCE_LIST, [])
  commit(types.SET_PLAYLIST, [])
  commit(types.SET_PLAYING_STATE, false)
  commit(types.SET_CURRENT_INDEX, -1)
}

// 将歌曲放入最近播放列表
export const setPlayHistory = ({commit}, song) => {
  commit(types.SET_PLAY_HISTORY, savePlay(song))
}

// 添加喜欢的歌曲
export const saveFavoriteList = ({commit}, song) => {
  commit(types.SET_FAVORITE_LIST, saveFavorite(song))
}

// 删除喜欢的歌曲
export const deleteFavoriteList = ({commit}, song) => {
  commit(types.SET_FAVORITE_LIST, deleteFavorite(song))
}