<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import useSearch from "@/components/Search/useSearch";

const router = useRouter()
const keywords = ref('');

const {search} = useSearch()

const searchHandler = () => {
  router.push('/search')
  search(keywords.value)
}

</script>

<template>
  <div class="search-container">
    <el-icon
      @click="searchHandler"
      class="search-icon"
      size="15px"
      color="white"
    >
      <Search />
    </el-icon>
    <input
      v-model="keywords"
      class="search"
      placeholder="搜索内容"
    />
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
}
</style>