<script setup lang="ts">
import {toggleImg} from "@/utils";
import {computed, onMounted, ref, watch} from "vue";
import {useMusicAction} from "@/store/music";

interface Props {

}
const props = defineProps<Props>()
const defaultImg = '/src/assets/defaultBg.png'
const music = useMusicAction()
const imgEl = ref<HTMLDivElement>()

const bg = computed(() => {
  return music.songs.al?.picUrl || defaultImg
})
onMounted(() => {
  console.log(imgEl)
  watch(bg, (val) => {
    toggleImg(val).then(img => {
      imgEl.value!.style.backgroundImage = `url(${img.src})`
    })
  })
})

</script>

<template>
  <div class="comment">
    <div>
      <div ref="imgEl" class="bg-img"></div>
      <div>
        <div>{{music.songs.name}}</div>
        <div>
          <div class="singer">
            <span v-for="(item, index) in music.songs.ar">{{item.name + (index < music.songs.ar.length-1? '/' : '')}}</span>
          </div>
          <div class="album">{{(music.songs.al || {}).name}}</div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
.comment {
  height: 100%;
  width: 100%;
  position: fixed;
  transform: translateY(100%);
  background-color: @bgColor;
  .bg-img {
    transition: 1s background;
    width: 20vh;
    height: 20vh;
    border-radius: 5px;
    transform: translateX(3vw);
    .bgSetting();
  }
}
</style>