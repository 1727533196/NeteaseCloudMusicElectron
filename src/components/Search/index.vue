<script setup lang="ts">
import {reactive, ref} from "vue";
import {useRouter} from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import useSearch from "@/components/Search/useSearch";
import {searchHotDetail} from "@/api/search";
import List from './List.vue'
import {useFlags} from "@/store/flags";

const state = reactive({
  scoreList: []
})

const loading = ref(false)
const router = useRouter()
const keywords = ref('');
const showSuggest = ref(false)
const {search} = useSearch()
const flags = useFlags()

const searchHandler = (keyword: string) => {
  router.push(`/search?key=${keyword}`)
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
  },100)
}
</script>

<template>
  <div class="search-container">
    <el-icon
      @click="searchHandler(keywords)"
      class="search-icon"
      size="15px"
      color="white"
    >
      <Search />
    </el-icon>
    <input
      v-model="keywords"
      @focus="focusHandler"
      @blur="blurHandler"
      class="search"
      placeholder="搜索内容"
    />
    <div v-loading="loading" v-show="showSuggest" class="suggest">
      <List @click="searchHandler($event.searchWord)" :list="state.scoreList"/>
    </div>
  </div>
</template>

<style lang="less" scoped>
.search-container {
  position: relative;
  padding: 0 15px;
  border-radius: 20px;
  background-color: rgb(43,43,46);
  box-sizing: border-box;
  display: flex;
  align-items: center;

  .search-icon {
    position: relative;
    top: -1px;
    margin-right: 5px;
    cursor: pointer;
  }
  .search {
    border: none;
    box-shadow: none;
    width: 130px;
    height: 30px;
    outline: none;
    box-sizing: border-box;
    background-color: transparent;
    font-size: 12px;
    color: white;
  }
  :deep(.suggest) {
    position: absolute;
    width: 400px;
    height: 80vh;
    background-color: rgb(54,54,54);
    transform: translateX(-50%) translateY(100%);
    left: 50%;
    bottom: -30px;
    z-index: 10;
    overflow: auto;
    .el-loading-mask {
      background: transparent;
    }
  }
}
</style>