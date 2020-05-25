<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box ref="searchBox" @queryChange="onQueryChange"></search-box>
    </div>
    <div class="shortcut-wrapper" ref="shortcutWarpper" v-show="!query">
      <scroll class="shortcut" ref="shortcutScroll" :data="shortcutData">
        <div>
          <div class="hot-key">
            <h1 class="title">热门搜索</h1>
            <ul>
              <li 
                class="item" 
                v-for="(item, index) in hotKeys"
                @click="addQuery(item.k)"
                :key="index">
                {{item.k}}
              </li>
            </ul>
          </div>
          <div class="search-history" v-show="searchHistory.length">
            <h1 class="title">
              <span class="text">搜索历史</span>
              <div class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </div>
            </h1>
            <SearchList 
              :searches="searchHistory"
              @select="addQuery"
              @delete="deleteOne"
            ></SearchList>
          </div>
        </div>
      </scroll>
    </div>
    <div class="search-result" ref="searchResult" v-show="query">
      <suggest 
        :query="query" 
        @listScroll="listScroll"
        @select="storageSearch"
        ref="suggest"
      ></suggest>
    </div>
    <confirm @cancel="cancel" @confirm="confirm" text="清空所有搜索历史？" ref="confirm"></confirm>
    <router-view></router-view>
  </div>
</template>

<script>
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import SearchList from 'base/search-list/search-list'
import Confirm from 'base/confirm/confirm'
import Scroll from 'base/scroll/scroll'
import { getHotkey } from 'api/search'
import { mapActions, mapGetters } from 'vuex'
import { playlistMixin, searchMixin } from 'common/js/mixin'

export default {
  mixins: [playlistMixin, searchMixin],
  data() {
    return {
      hotKeys: []
      // query: ''
    }
  },
  computed: {
    shortcutData() {
      return this.hotKeys.concat(this.searchHistory)
    },
    ...mapGetters([
      // 'searchHistory',
      'playlist'
    ])
  },
  watch: {
    query(newQuery) {
      if (!newQuery) {
        setTimeout(() => {
          this.$refs.shortcutScroll.refresh()
        }, 20)
      }
    }
  },
  created() {
    this._getHotkey()
  },
  methods: {
    // onQueryChange(query) {
    //   this.query = query
    // },
    // addQuery(k) {
    //   this.$refs.searchBox.setQuery(k)
    // },
    // listScroll() {
    //   this.$refs.searchBox.blurInput()
    // },
    // storageSearch() {
    //   this.saveSearchHistory(this.query)
    // },
    handlePlaylist() {
      const bottom = this.playlist.length ? '60px' : ''
      this.$refs.shortcutWarpper.style.bottom = bottom
      this.$refs.searchResult.style.bottom = bottom
      this.$refs.shortcutScroll.refresh()
      this.$refs.suggest.refresh()
    },
    // deleteOne(item) {
    //   this.deleteSearchHistory(item)
    // },
    showConfirm() {
      this.$refs.confirm.show()
    },
    cancel() {
      this.$refs.confirm.hide()
    },
    confirm() {
      this.clearSearchHistory()
      this.$refs.confirm.hide()
    },
    _getHotkey() {
      getHotkey().then(res => {
        if (res.code === 0) {
          this.hotKeys = res.data.hotkey.slice(0, 10)
        }
      })
    },
    ...mapActions([
      // 'saveSearchHistory',
      // 'deleteSearchHistory',
      'clearSearchHistory'
    ])
  },
  components: {
    SearchBox,
    Suggest,
    SearchList,
    Confirm,
    Scroll
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>