<script setup lang="ts">
import {watch} from "vue"
import {useRoute, useRouter} from 'vue-router'
import UserDetailCard from '@/components/UserDetailCard/index.vue'
import {getArtistDetail } from "@/api/user";

const router = useRouter()
const route = useRoute()

init()

function init() {
  const {uid} = route.query as {uid: number | null}
  if(uid) {
    getArtistDetail(uid).then(res => {
      console.log('Y---> res', res)
    })
  }
}

</script>

<template>
  <UserDetailCard></UserDetailCard>
  <div>userDetail</div>
</template>

<style scoped>

</style>