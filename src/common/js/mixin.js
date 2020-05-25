import { mapGetters, mapMutations, mapActions } from 'vuex'
import { playMode } from './config'
import { shuffle } from './util'
import * as types from '../../store/mutation-types'

// 底部迷你播放器显示时，需要动态改变scroll组件高度
export const playlistMixin = {
  computed: {
    ...mapGetters([
      'playlist'
    ])
  },
  mounted() {
    this.handlePlaylist(this.playlist)
  },
  activated() {
    this.handlePlaylist(this.playlist)
  },
  watch: {
    playlist(newVal) {
      this.handlePlaylist(newVal)
    }
  },
  methods: {
    handlePlaylist() {
      throw new Error('component must implement handlePlaylist function')
    }
  }
}

// 播放器播放模式切换
export const playerMixin = {
  computed: {
    iconMode() {
      return this.mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'
    },
    favoriteIcon () {
      return this.getFavoriteIcon(this.currentSong)
    },
    ...mapGetters([
      'mode',
      'currentSong',
      'sequenceList',
      'favoriteList'
    ])
  },
  methods: {
    // 改变播放模式
    changeMode() {
      const mode = (this.mode + 1) % 3
      this.setPlayMode(mode)
      let list = this.sequenceList
      if (mode === playMode.random) {
        // 随机模式将顺序列表洗牌洗乱
        list = shuffle(list)
      }
      this.resetCurrentSong(list)
      this.setPlaylist(list)
    },
    // 重新定位到当前播放的歌曲
    resetCurrentSong(list) {
      const index = list.findIndex(item => {
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(index)
    },
    isFavorite(song) {
      return this.favoriteList.findIndex(item => item.id === song.id) > -1
    },
    getFavoriteIcon(song) {
      return this.isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
    },
    toggleFavorite(song) {
      if (this.isFavorite(song)) {
        this.deleteFavoriteList(song)
      } else {
        this.saveFavoriteList(song)
      }
    },
    ...mapMutations({
      setPlaylist: types.SET_PLAYLIST,
      setCurrentIndex: types.SET_CURRENT_INDEX,
      setPlayMode: types.SET_PLAY_MODE
    }),
    ...mapActions([
      'saveFavoriteList',
      'deleteFavoriteList'
    ])
  }
}

// 搜索公用方法
export const searchMixin = {
  data() {
    return {
      query: '',
      refreshDelay: 100
    }
  },
  computed: {
    ...mapGetters([
      'searchHistory'
    ])
  },
  methods: {
    onQueryChange(query) {
      this.query = query
    },
    addQuery(k) {
      this.$refs.searchBox.setQuery(k)
    },
    listScroll() {
      this.$refs.searchBox.blurInput()
    },
    storageSearch() {
      this.saveSearchHistory(this.query)
    },
    deleteOne(item) {
      this.deleteSearchHistory(item)
    },
    ...mapActions([
      'saveSearchHistory',
      'deleteSearchHistory'
    ])
  }
}