<script setup lang="ts" name="Header">
import {useUserInfo} from "@/store";
import Search from '@/components/Search/index.vue'
import {handle} from "@/layout/BaseHeader/handle";
import {useFlags} from "@/store/flags";
import {useRoute, useRouter} from "vue-router";
import {computed} from "vue";

const flags = useFlags()
const store = useUserInfo()
const router = useRouter()
const route = useRoute()
const {maximize, unmaximize, minimize, restore, close} = handle()

const maximizeOrUnmaximize = () => {
  flags.isMaximize ? unmaximize() : maximize()
}

const back = () => {
  if(backIsDisable.value) {
    return
  }
  router.back()
}
const go = () => {
  if(goIsDisable.value) {
    return
  }
  router.go(1)
}
const backIsDisable = computed(() => {
  return +route.query.count! === 1
})
const goIsDisable = computed(() => {
  return +route.query.count! === flags.maxCount
})
</script>

<template>
  <div :class="['window-container', {'no-drag':flags.isOpenSearch}]">
    <div class="left no-drag"></div>
    <div class="center no-drag">
      <div class="flip">
        <el-icon :class="{disable: backIsDisable}" @click="back"><ArrowLeft /></el-icon>
        <el-icon :class="{disable: goIsDisable}" @click="go"><ArrowRight /></el-icon>
      </div>
      <Search/>
    </div>
    <div class="right no-drag">
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
  z-index: 10  ;
  //background-color: @bgColor;
  //border-bottom: 2px rgb(176,34,34) solid;
  display: flex;
  align-items: center;
  justify-content: space-between;
  .left {
    //background-image: url("@/assets/bg-logo.png");
    width: 0px;
    height: 30px;
    .bgSetting();
    cursor: pointer;
    margin-left: 15px;
  }
  .center {
    margin-right: 20%;
    display: flex;
    align-items: center;
    .flip {
      display: flex;
      align-items: center;
      margin-right: 20px;
      justify-content: space-between;
      width: 60px;
      .el-icon {
        cursor: pointer;
        background-color: rgba(255,255,255,0.01);
        border-radius: 50%;
        height: 25px;
        width: 25px;
      }
      .disable.el-icon {
        cursor: default;
        color: @moreDark;
      }
    }
  }
  .right {
    margin-right: 15px;
    display: flex;
    align-items: center;

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