<script setup lang="ts">
import {useRouter} from "vue-router";
import {PlayList} from "@/api/musicList";
import Card from '@/components/Card/index.vue'
import img from '@/assets/img.jpg'
import {computed} from "vue";

type List = {label: string, name: string}[]
interface Props {
  list: List
  modelValue: string
  playList: PlayList[]
}
const emit = defineEmits(['tabChange', 'update:modelValue'])
const props = defineProps<Props>()
const router = useRouter()

const cardClickHandler = (item: PlayList) => {
  console.log(item)
  router.push({
    path: '/play-list',
    query: {
      id: item.id
    }
  })
}

const val = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  },
})

</script>

<template>
  <div class="list-container">
    <tabs
      @tabChange="emit('tabChange', $event)"
      v-model="val"
    >
      <tab-pane
        v-for="item in props.list"
        :label="item.label"
        :name="item.name"
      >
        <div class="play-list">
          <card
            v-if="val === 'createSongList'"
            :picUrl="img"
            class="item"
            name="我的听歌排行"
            is-click
            is-start-icon
          ></card>
          <card
            v-for="playItem in playList"
            @click="cardClickHandler(playItem)"
            class="item"
            :pic-url="playItem.coverImgUrl"
            :name="playItem.name"
            is-click
            is-start-icon
          ></card>
        </div>
      </tab-pane>
    </tabs>
  </div>
</template>

<style lang="less" scoped>
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
  .play-list {
    padding-top: 15px;
    display: grid;
    //第一个属性：行与行间隔，第二个属性列与列间隔
    grid-gap: 20px 20px;
    //内容整体平均分布
    justify-content: space-between;
    //单元格的大小是固定的，但是容器的大小不确定。如果希望每一行（或每一列）容纳尽可能多的单元格，这时可以使用auto-fill关键字表示自动填充
    grid-template-columns: repeat(auto-fill, calc(15vw - 20px));
  }
}
</style>