<template>
  <div class="search-box">
    <i class="icon-search"></i>
    <input ref="input" class="box" v-model="query" :placeholder="placeholder" type="text">
    <i v-show="query" @click="clear" class="icon-dismiss"></i>
  </div>
</template>

<script>
import { debounce } from 'common/js/util'

export default {
  data() {
    return {
      query: ''
    }
  },
  props: {
    placeholder: {
      typeL: String,
      default: '搜索歌曲、歌手'
    }
  },
  created() {
    this.$watch('query', debounce(() => {
      this.$emit('queryChange', this.query)
    }, 200))
  },
  methods: {
    setQuery(k) {
      this.query = k
    },
    clear() {
      this.query = ''
    },
    blurInput() {
      this.$refs.input.blur()
    }
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      outline: 0
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>