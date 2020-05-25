<template>
  <scroll 
    class="suggest"
    :data="searchResult"
    :pullup="pullup"
    :beforeScroll="beforeScroll"
    @scrollToEnd="searchMore"
    @beforeScroll="listScroll"
    ref="suggest"
  >
    <ul class="suggest-list" v-show="searchResult.length">
      <li 
        class="suggest-item" 
        v-for="(item, index) in searchResult" 
        :key="index"
        @click="selectItem(item)"
      >
        <div class="icon">
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getDisplayName(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div class="no-result-wrapper" v-show="!searchResult.length && !hasMore">
      <no-result title="暂无搜索结果"></no-result>
    </div>
  </scroll>
</template>

<script>
import { search } from 'api/search'
import { createSong, isValidMusic, processSongsUrl } from 'common/js/song'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import { mapMutations, mapActions } from 'vuex'
import Singer from 'common/js/singer'
import NoResult from 'base/no-result/no-result'

const TYPE_SINGER = 'singer'
const perpage = 20

export default {
  data() {
    return {
      page: 1,
      searchResult: [],
      pullup: true,
      beforeScroll: true,
      hasMore: true
    }
  },
  props: {
    query: {
      type: String,
      default: ''
    },
    zhida: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    query() {
      this.search()
    }
  },
  methods: {
    getIconCls(item) {
      if (item.type === TYPE_SINGER) {
        return 'icon-mine'
      }
      return 'icon-music'
    },
    getDisplayName(item) {
      if (item.type === TYPE_SINGER) {
        return item.singername
      }
      return `${item.name}-${item.singer}`
    },
    search() {
      this.page = 1
      this.hasMore = true
      this.$refs.suggest.scrollTo(0, 0)
      search(this.query, this.page, this.zhida, perpage).then(res => {
        if (res.code === 0) {
          this._genSearchResult(res.data).then(result => {
            this.searchResult = result
            this._checkMore(res.data)
          })
        }
      })
    },
    searchMore() {
      if (!this.hasMore) {
        return
      }
      this.page++
      search(this.query, this.page, this.zhida, perpage).then(res => {
        if (res.code === 0) {
          this._genSearchResult(res.data).then(result => {
            this.searchResult = this.searchResult.concat(result)
            this._checkMore(res.data)
          })
        }
      })
    },
    selectItem(item) {
      if (item.type === TYPE_SINGER) {
        this.setSinger(new Singer({
          id: item.singermid,
          name: item.singername
        }))
        this.$router.push({
          path: `/search/${item.singermid}`
        })
      } else {
        this.insertSong({
          song: item
        })
      }
      this.$emit('select')
    },
    listScroll() {
      this.$emit('listScroll')
    },
    refresh() {
      this.$refs.suggest.refresh()
    },
    _checkMore(data = {}) {
      const { song } = data
      if (!song.list.length || ((this.page - 1) * perpage + data.curnum >= song.totalnum)) {
        this.hasMore = false
      }
    },
    _genSearchResult(data) {
      let ret = []
      const {
        song: { list = [] },
        zhida = {}
      } = data
      if (zhida.singerid) {
        ret.push({...zhida, ...{type: TYPE_SINGER}})
      }
      return processSongsUrl(this._normalizeSongs(list)).then(songs => {
        ret = ret.concat(songs)
        return ret
      })
    },
    _normalizeSongs(list) {
      let ret = []
      list.forEach(item => {
        if (isValidMusic(item)) {
          ret.push(createSong(item))
        }
      })
      return ret
    },
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    ...mapActions([
      'insertSong'
    ])
  },
  components: {
    Scroll,
    Loading,
    NoResult
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>