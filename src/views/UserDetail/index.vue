<script setup lang="ts" name="detail">
import {useRoute, useRouter} from 'vue-router'
import UserDetailCard from '@/components/UserDetailCard/index.vue'
import {getUserDetail, Profile} from "@/api/user";
import {reactive, ref, watch} from "vue";
import {province} from 'province-city-china/data'
import UserDetailList from '@/components/UserDetailList/index.vue'
import {list} from "@/views/UserDetail/config";
import {getUserPlayList, PlayList} from "@/api/musicList";

interface State {
  userInfo: Profile
  identify: {
    level: number
  }
  playList: PlayList[]
}

const router = useRouter()
const route = useRoute()
const state = reactive<State>({
  userInfo: {} as Profile,
  identify: {} as {
    level: number
  },
  playList: [],
})
const location = ref<string>()
const activeName = ref<string>(list[0].name)


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
    getUserDetailHandler(uid)
    getUserSongListHandler(uid)
  }
}

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
  state.playList = playlist
}


</script>

<template>
  <div class="user-detail-container">
    <UserDetailCard
      :location="location"
      :identify="state.identify"
      :user-info="state.userInfo"
    ></UserDetailCard>
    <UserDetailList
      v-model="activeName"
      :playList="state.playList"
      :list="list"></UserDetailList>
  </div>

</template>

<style lang="less" scoped>
.user-detail-container {
  height: 100%;

}
</style>