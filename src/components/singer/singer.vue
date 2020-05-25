<template>
  <div class="singer" ref="singer">
    <listview
      ref="list"
      @select="selectSinger"
      :data="singers">
    </listview>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import { SET_SINGER } from '../../store/mutation-types'
import { getSinger } from 'api/singer'
import { ERR_OK } from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'
import { playlistMixin } from 'common/js/mixin'

const HOT_NAME = '热门'
const HOT_LEN = 10

export default {
  mixins: [playlistMixin],
  data() {
    return {
      singers: []
    }
  },
  created() {
    this._getSinger()
  },
  methods: {
    handlePlaylist(playlist) {
      const bottom = playlist.length ? '60px' : ''
      this.$refs.singer.style.bottom = bottom
      this.$refs.list.refresh()
    },
    selectSinger(singer) {
      this.setSinger(singer)
      this.$router.push({
        path: `/singer/${singer.id}`
      })
    },
    // 获取歌手列表
    _getSinger() {
      getSinger().then(res => {
        if (res.code === ERR_OK) {
          this.singers = this._normalizeSinger(res.data.list || [])
        }
      })
    },
    // 处理歌手列表数据，按照热门和首字母分类
    _normalizeSinger(list) {
      const map = {
        hot: {
          title: HOT_NAME,
          list: []
        }
      }
      list.forEach((item, index) => {
        // 将前十条数据放入热门
        if (index < HOT_LEN) {
          map.hot.list.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 将歌手首字母分类聚合
        const key = item.Findex
        if (!map[key]) {
          map[key] = {
            title: key,
            list: []
          }
        }
        map[key].list.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 为了得到有序列表，我们需要处理 map
      let hot = []
      let ret = []
      for (let key in map) {
        const val = map[key]
        if (val.title === HOT_NAME) {
          hot.push(val)
        } else if (val.title.match(/[a-zA-Z]/)) {
          ret.push(val)
        }
      }
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      return hot.concat(ret)
    },
    ...mapMutations({
      setSinger: SET_SINGER
    })
  },
  components: {
    Listview
  }
}
</script>

<style lang="stylus" scoped>
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>