<script setup lang="ts" name="detail">
import {useRoute, useRouter} from 'vue-router'
import UserDetailCard from '@/components/UserDetailCard/index.vue'
import {getUserDetail, Profile} from "@/api/user";
import {reactive, ref, watch} from "vue";
import {province} from 'province-city-china/data'

const router = useRouter()
const route = useRoute()

watch(() => route.fullPath, () => {
  if(route.path === '/detail') {
    init()
  }
}, {
  immediate: true,
})

interface State {
  userInfo: Profile
  identify: {
    level: number
  }
}
const state = reactive<State>({
  userInfo: {} as Profile,
  identify: {} as {
    level: number
  },
})
const location = ref<string>()

function init() {
  const {uid} = route.query as {uid: number | null}
  if(uid) {
    getUserDetailHandler(uid)
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


</script>

<template>
  <div class="user-detail-container">
    <UserDetailCard
        :location="location"
        :identify="state.identify"
        :user-info="state.userInfo"
    ></UserDetailCard>
    <div class="list-container"></div>
  </div>

</template>

<style lang="less" scoped>
.user-detail-container {
  height: 100%;
  .list-container {
    padding: 20px;
    border-radius: 20px;
    width: calc(93vw - 180px);
    //width: 95%;
    background-color: rgba(255,255,255,.05);
    margin: 30px auto;
    min-height: 500px;
    box-shadow: 0 5px 15px 5px rgba(0, 0, 0, 0.1);
    transition: 0.3s;
  }
}
</style>