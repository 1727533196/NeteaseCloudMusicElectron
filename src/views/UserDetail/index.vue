<script setup lang="ts" name="detail">
import {useRoute, useRouter} from 'vue-router'
import UserDetailCard from '@/components/UserDetailCard/index.vue'
import {getUserDetail, Profile} from "@/api/user";
import {onUnmounted, reactive, ref, watch} from "vue";
import {province} from 'province-city-china/data'
import UserDetailList from '@/components/UserDetailList/index.vue'
import {list} from "@/views/UserDetail/config";
import {getUserPlayList, PlayList} from "@/api/musicList";
import {useUserInfo} from "@/store";

interface State {
  userInfo: Profile
  identify: {
    level: number
  }
  playList: PlayList[]
  allPlayList: PlayList[]
}

const router = useRouter()
const route = useRoute()
const store = useUserInfo()
const state = reactive<State>({
  userInfo: {} as Profile,
  identify: {} as {
    level: number
  },
  playList: [],
  allPlayList: [],
})
const userId = ref<number>()
const location = ref<string>()
const activeName = ref<TabsName>(list[0].name as TabsName)
let timer: NodeJS.Timer

watch(() => route.fullPath, () => {
  if(route.path === '/detail') {
    init()
  }
}, {
  immediate: true,
})
function init() {
  const {uid} = route.query as {uid: number | null}
  if(uid) {
    userId.value = +uid
    getUserDetailHandler(uid)
    getUserSongListHandler(uid)
    clearInterval(timer)
    timer = setInterval(() => {
      getUserSongListHandler(uid)
    }, 3000)
  }
}
onUnmounted(() => {
  clearInterval(timer)
})

// 获取用户详情
async function getUserDetailHandler(uid: number) {
  const {profile, level} = await getUserDetail(uid)
  state.userInfo = profile
  state.identify = {
    level,
  }
  location.value = province.find(item => +item.code === state.userInfo.province)!.name
}

// 获取指定用户歌单
async function getUserSongListHandler(uid: number) {
  const {playlist} = await getUserPlayList(uid)
  state.allPlayList = playlist
  state.playList = getCurrentTabsList(activeName.value)
}
type TabsName = 'createSongList' | 'collectSongList' | 'createSpecial'
const getCurrentTabsList = (name: TabsName) => {
  return state.allPlayList.filter(item => {
    if(name === 'createSongList') {
      return userId.value === store.profile.userId ? !item.subscribed : !item.ordered
    } else if(name === 'collectSongList') {
      return userId.value === store.profile.userId ? item.subscribed : item.ordered
    }
    return false
  })
}

const tabChange = (name: TabsName) => {
  activeName.value = name
  state.playList = getCurrentTabsList(name)
}


</script>

<template>
  <div class="user-detail-container">
    <UserDetailCard
      :location="location"
      :identify="state.identify"
      :user-info="state.userInfo"
    />
    <UserDetailList
      v-model="activeName"
      @tabChange="tabChange"
      :playList="state.playList"
      :list="list"
      :userId="userId"
    />
  </div>

</template>

<style lang="less" scoped>
.user-detail-container {
  height: 100%;

}
</style>