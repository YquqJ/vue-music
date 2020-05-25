<template>
  <transition appear name="slide">
    <music-list 
      :title="title"
      :bgImage="bgImage"
      :songs="songs"
    >
    </music-list>
  </transition>
</template>

<script>
import MusicList from 'components/music-list/music-list'
import { mapGetters } from 'vuex'
import { getSongList } from 'api/recommend'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'

export default {
  data() {
    return {
      songs: []
    }
  },
  computed: {
    title() {
      return this.disc.dissname
    },
    bgImage() {
      return this.disc.imgurl
    },
    ...mapGetters([
      'disc'
    ])
  },
  created() {
    this._getSongList()
  },
  methods: {
    _getSongList() {
      if (!this.disc.dissid) {
        this.$router.push('/recommend')
        return
      }
      getSongList(this.disc.dissid).then(res => {
        if (res.code === 0) {
          processSongsUrl(this._normalizeList(res.cdlist[0].songlist)).then(res => {
            this.songs = res
          })
        }
      })
    },
    _normalizeList(list) {
      let ret = []
      list.forEach(item => {
        if (item.songid && item.albummid && isValidMusic(item)) {
          ret.push(createSong(item))
        }
      })
      return ret
    }
  },
  components: {
    MusicList
  }
}
</script>

<style lang="stylus" scoped>
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s
  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
    opacity: 0
</style>