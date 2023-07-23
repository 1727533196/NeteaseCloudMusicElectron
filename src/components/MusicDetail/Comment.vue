<script setup lang="ts">
import {calculateIsToday, formatDate, toggleImg} from "@/utils";
import {computed, onMounted, reactive, ref, watch} from "vue";
import {useMusicAction} from "@/store/music";
import {getCommentMusic} from "@/api/musicList";
import {useRouter} from "vue-router";
import {useFlags} from "@/store/flags";

interface Props {

}
const props = defineProps<Props>()
const defaultImg = '/src/assets/defaultBg.png'
const music = useMusicAction()
const flags = useFlags()
const router = useRouter()
const imgEl = ref<HTMLDivElement>()
const page = ref(1)
const state = reactive({
  comments: [],
})

const bg = computed(() => {
  return music.songs.al?.picUrl || defaultImg
})
const currentTab = ref<string>()
onMounted(() => {
  watch(bg, (val) => {
    toggleImg(val).then(img => {
      imgEl.value!.style.backgroundImage = `url(${img.src})`
    })
  })
})
const getCommentMusicFn = async (id: number, page: number) => {
  const {comments, code} = await getCommentMusic(id, page)
  if(code === 200) {
    state.comments = comments
  }
}
watch(() => music.songs.id, (value) => {
  getCommentMusicFn(value, page.value)
})
const gotoUserDetail = (uid: number) => {
  flags.isOpenDetail = false
  router.push({
    path: '/detail',
    query: {
      uid
    }
  })
}

</script>

<template>
  <div class="comment">
    <div class="comment-box">
      <div class="info">
        <div ref="imgEl" class="bg-img"></div>
        <div class="song-info">
          <div class="song-name">{{music.songs.name}}</div>
          <div class="singers">
            <div class="singer-info">
              <span v-for="(item, index) in music.songs.ar">歌手: {{item.name + (index < music.songs.ar.length-1? '/' : '')}}</span>
            </div>
            <div class="album">专辑: {{(music.songs.al || {}).name}}</div>
          </div>
        </div>
      </div>
      <div class="comment-content">
        <tabs v-model="currentTab">
          <tab-pane label="评论" value="comment">
            <div class="comment-content-box">
              <div class="title">精彩评论</div>
              <div @wheel.stop class="content">
                <div v-for="item in state.comments" class="content-line">
                  <div @click="gotoUserDetail(item.user.userId)" :style="{backgroundImage: `url(${item.user.avatarUrl})`}" class="photo"></div>
                  <div class="right-box">
                    <div class="comment-text">
                      <div @click="gotoUserDetail(item.user.userId)" class="name">{{ item.user.nickname }}: </div>
                      <div class="text">{{item.content}}</div>
                    </div>
                    <div class="handle-box">
                      <div class="time">{{item.timeStr}}</div>
                      <div class="operation">
                        <el-icon><Star /></el-icon>
                        <div class="operator-line"></div>
                        <el-icon><ChatDotSquare /></el-icon>
                      </div>
                    </div>
                  </div>
                  <div class="line"></div>
                </div>
              </div>
            </div>
          </tab-pane>
          <tab-pane label="详情" value="details"></tab-pane>
        </tabs>
      </div>
    </div>

  </div>
</template>

<style scoped lang="less">
:deep(.el-tab-pane),:deep(.el-tabs__content),:deep(.el-tabs) {
  height: 100%;
}
.comment {
  height: 100%;
  width: 100%;
  position: fixed;
  transform: translateY(100%);
  background-color: @bgColor;
  .comment-box {
    padding: 80px 0 0 50px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    flex-flow: column;
    height: 100%;
    .info {
      display: flex;
      margin-bottom: 30px;
      .song-info {
        display: flex;
        flex-direction: column;
        font-size: 13px;
        .song-name {
          font-size: 36px;
          margin-bottom: 20px;
          //margin-top: 10px;
        }
        .singers {
          display: flex;
          align-items: center;
          .singer-info {
            display: flex;
            align-items: center;
            margin-right: 20px;
          }
        }
      }
      .bg-img {
        transition: 1s background;
        width: 130px;
        height: 130px;
        border-radius: 10px;
        .bgSetting();
        margin-right: 20px;
      }
    }
    .comment-content {
      height: 100%;
      //flex: 1;
      :deep(.el-tabs__item) {
        margin-right: 30px;
      }
      .comment-content-box {
        height: 100%;
        //display: flex;
        //flex-flow: column;
        .title {
          font-size: 18px;
          margin-bottom: 20px;
        }
        .content {
          overflow: auto;
          max-height: 100%;
          padding-right: 40px;
          //flex: 1;
          .content-line {
            display: flex;
            align-items: center;
            position: relative;
            padding-bottom: 25px;
            width: 100%;
            padding-top: 25px;
            .line {
              position: absolute;
              bottom: 0;
              left: 0;
              height: 1px;
              width: 100%;
              background-color: rgba(255,255,255,0.08);
            }
            .photo {
              cursor: pointer;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: #42b983;
              margin-right: 20px;
              .bgSetting()
            }
            .right-box {
              display: flex;
              flex-direction: column;
              align-content: space-around;
              width: 100%;
              .comment-text {
                display: flex;
                font-size: 13px;
                margin-bottom: 6px;
                .name {
                  color: #0086b3;
                  cursor: pointer;
                  margin-right: 5px;
                }
                .text {

                }
              }
              .handle-box {
                display: flex;
                justify-content: space-between;
                .time {
                  font-size: 13px;
                }
                .operation {
                  position: relative;
                  top: 4px;
                  display: flex;
                  align-items: center;
                  .operator-line {
                    width: 1.5px;
                    height: 15px;
                    background-color: rgba(255,255,255,0.05);
                    margin: 0 10px;
                  }
                  .el-icon {
                    cursor: pointer;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>