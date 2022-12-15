<script setup lang="ts" name="detail">
import {useRoute, useRouter} from 'vue-router'
import UserDetailCard from '@/components/UserDetailCard/index.vue'
import {getArtistDetail, getUserDetail} from "@/api/user";
import {reactive, watch} from "vue";

const router = useRouter()
const route = useRoute()

watch(() => route.fullPath, () => {
  if(route.path === '/detail') {
    init()
  }
}, {
  immediate: true,
})

const state = reactive({
  userInfo: {},
  identify: {},
})

function init() {
  const {uid} = route.query as {uid: number | null}
  if(uid) {
    getArtistDetailHandler(uid)
  }
}

async function getArtistDetailHandler(uid: number) {
  const {data} = await getArtistDetail(uid)
  state.userInfo = data.user
  state.identify = data.identify
}

</script>

<template>
  <UserDetailCard :identify="state.identify" :user-info="state.userInfo"></UserDetailCard>
  <div>userDetail</div>
</template>

<style scoped>

</style>