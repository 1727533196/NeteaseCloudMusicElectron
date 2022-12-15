<script setup lang="ts" name="Header">
import {useUserInfo} from "@/store";
import Search from '@/components/Search/index.vue'
import {handle} from "@/layout/BaseHeader/handle";
import {useFlags} from "@/store/flags";
import {useRouter} from "vue-router";

const flags = useFlags()
const store = useUserInfo()
const router = useRouter()
const {maximize, unmaximize, minimize, restore, close} = handle()

const maximizeOrUnmaximize = () => {
  flags.isMaximize ? unmaximize() : maximize()
}
const gotoDetail = () => {
  router.push({
    path: '/detail',
    query: {
      uid: store.profile.userId,
    }
  })
}
</script>

<template>
  <div :class="['window-container', {'no-drag':flags.isOpenSearch}]">
    <div class="left no-drag"></div>
    <div class="center no-drag">
      <Search/>
    </div>
    <div class="right no-drag">
      <div @click="gotoDetail" :style="{backgroundImage: `url(${store.profile.avatarUrl})`}" class="head-portraits"></div>
      <div class="nickname">{{store.profile.nickname}}</div>
      <div class="operator">
        <div class="handler" @click="minimize">
          <i class="iconfont icon-weibiaoti-"></i>
        </div>
        <div class="handler" @click="maximizeOrUnmaximize">
          <i :class="['iconfont', flags.isMaximize ? 'icon-3zuidahua-3' : 'icon-3zuidahua-1']"></i>
        </div>
        <div style="margin-right: 13px" class="handler" @click="close">
          <i class="iconfont icon-guanbi"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.window-container {
  height: 60px;
  width: 100%;
  position: relative; // 子元素 的 z-index 小于父元素时，仍然显示在 父元素 上面: 父元素position:relative;z-index:1,子元素position:开启定位;z-index:10，就可以做到子元素在父元素之上了
  top: 0;
  z-index: auto;
  background-color: rgb(34,34,37);
  border-bottom: 2px rgb(176,34,34) solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    background-image: url("@/assets/bg-logo.png");
    width: 125px;
    height: 30px;
    .bgSetting();
    cursor: pointer;
    margin-left: 15px;
  }
  .center {
  }
  .right {
    margin-right: 15px;
    display: flex;
    align-items: center;
    .head-portraits {
      border-radius: 50%;
      width: 30px;
      height: 30px;
      background: url("https://p1.music.126.net/siSjcSLr8ybRZ3VUpC-9hg==/109951165504329717.jpg");
      .bgSetting();
      margin-right: 6px;
    }
    .nickname {
      max-width: 80px;
      .textOverflow();;
      color: rgb(165,167,168);
      font-size: 12px;
      margin-right: 30px;
    }
    .operator {
      display: flex;
      align-items: center;
      position: relative;
      z-index: 2006;
      .handler {
        margin-right: 20px;
        cursor: pointer;
        &:hover {
          color: rgb(30,204,148);
        }
      }
      .iconfont.icon-weibiaoti- {
        font-size: 29px;
      }
    }

  }
}

</style>