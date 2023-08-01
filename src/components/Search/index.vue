<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRouter} from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import useSearch from "@/components/Search/useSearch";
import {searchHotDetail, searchMultimatch, searchSuggest} from "@/api/search";
import List from './List.vue'
import {useFlags} from "@/store/flags";
import {useMusicAction} from "@/store/music";

const state = reactive({
  scoreList: [],
  keywordsList: {},
})
const loading = ref(false)
const router = useRouter()
const keywords = ref('');
const showSuggest = ref(false)
const {search} = useSearch()
const flags = useFlags()
const model = ref<'hot' | 'keywords'>("hot")
const music = useMusicAction()

const searchHandler = (item: string | object, key?: 'allMatch' | 'songs' | 'artists' | 'albums' | 'playlists') => {
  console.log('111-->', 111, key, model.value, item)

  if(model.value === "hot") {
    router.push(`/search?key=${item.searchWord}`)
  } else {
    if(key === "allMatch") {
      router.push(`/search?key=${item.keyword}`)
    } else if(key === 'songs') {
      music.getMusicUrlHandler(item.id)
    } else if(key === 'artists') {
      router.push(`/singer-page?id=${item.id}`)
    } else if(key === 'albums') {
      router.push(`/play-list?id=${item.id}&type=album`)
    } else if(key === "playlists") {
      router.push(`/play-list?id=${item.id}`)
    }
  }
}

const focusHandler = async () => {
  showSuggest.value = true
  flags.isOpenSearch = true
  if(!state.scoreList.length) {
    loading.value = true
  }
  const res =  await searchHotDetail()
  loading.value = false
  state.scoreList = res.data
}
const blurHandler = () => {
  setTimeout(() => {
    flags.isOpenSearch = false
    showSuggest.value = false
  },300)
}
let timer: NodeJS.Timeout
const inputHandler = () => {
  // clearTimeout(timer)
  if(keywords.value === '') {
    model.value = 'hot'
    focusHandler()
    return
  }
  // timer = setTimeout(async () => {
    model.value = keywords.value === '' ? 'hot' : 'keywords'
    getSearchSuggest(keywords.value)
  // }, 500)
}
// 高亮元素
const hig = (result: object) => {
  if(!Object.keys(result)) {
    return
  }
  const regExp = new RegExp(keywords.value)
  const len = result.order.length
  for (let i = 0; i < len; i++) {
    const key = result.order[i]
    const list = result[key]
    if(key === 'allMatch') {
      list.forEach(item => {
        item.text = item.keyword.replace(regExp, `<span style="color:lightskyblue">${keywords.value}</span>`)
      })
    } else {
      list.forEach(item => {
        item.text = item.name.replace(regExp, `<span style="color:lightskyblue">${keywords.value}</span>`)
      })
    }
  }
}
const getSearchSuggest = async (keywords: string) => {
  loading.value = true
  state.keywordsList = {}
  const [suggest, songs] = await Promise.all([searchSuggest(keywords) ,searchSuggest(keywords, 'mobile')])
  // 单曲、专辑、歌手、歌单
  if(Object.keys(suggest)) {
    state.keywordsList = suggest.result
  }
  // 猜你想搜
  if(Object.keys(songs)) {
    state.keywordsList.allMatch = songs.result.allMatch
    if(!state.keywordsList.order) {
      state.keywordsList.order = []
    }
    state.keywordsList.order.unshift('allMatch')
  }
  hig(state.keywordsList)
  loading.value = false
}
</script>

<template>
  <div class="search-container">
    <el-icon
      @click="searchHandler(keywords)"
      class="search-icon"
      size="18px"
      color="rgba(255, 255, 255, 0.5)"
    >
      <Search />
    </el-icon>
    <input
      v-model.trim="keywords"
      @keydown.stop
      @focus="focusHandler"
      @blur="blurHandler"
      @input="inputHandler"
      class="search"
      placeholder="林俊杰"
    />
    <div v-loading="loading" v-show="showSuggest" class="suggest">
      <List :model="model" @click="searchHandler" :keywordsList="state.keywordsList" :list="state.scoreList"/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search-container {
  position: relative;
  padding: 0 15px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.06);
  box-sizing: border-box;
  display: flex;
  align-items: center;

  .search-icon {
    position: relative;
    top: 1px;
    margin-right: 10px;
    cursor: pointer;
  }
  .search {
    border: none;
    box-shadow: none;
    width: 230px;
    height: 37px;
    outline: none;
    box-sizing: border-box;
    background-color: transparent;
    font-size: 14px;
    color: white;
    font-weight: 800;
  }
  :deep(.suggest) {
    position: absolute;
    border-radius: 10px;
    width: 400px;
    height: 77vh;
    background-color: rgb(45,45,56);
    transform: translateX(-50%) translateY(100%);
    left: 50%;
    bottom: -3vh;
    z-index: 10;
    overflow: hidden;
    .el-loading-mask {
      background: transparent;
    }
  }
}
</style>