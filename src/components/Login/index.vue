<script lang="ts" setup>
import {ref, onUnmounted} from 'vue'
import {loginQrCheck, loginQrCreate, loginQrKey} from "@/api/login";
import {ElMessage} from "element-plus";
import {getUserAccountFn} from "@/utils/userInfo";

const dialogVisible = ref(false)
const key = ref('')
const qrUrl = ref('')
const flag = ref(false) // 是否授权中
const isSucceed = ref(false)
let timer: NodeJS.Timer
const init = async () => {
  const { data:{unikey} } = await loginQrKey()
  key.value = unikey
  // 之前
  const { data:{qrimg} } = await loginQrCreate(key.value, true)
  qrUrl.value = qrimg
  // end 。。。

  timer = setInterval(async () => {
    // 800二维码不存在或已过期 801等待扫码  802授权中 803授权登陆成功
    const {code, message, cookie} = await loginQrCheck(key.value)
    if(code === 800) {
      clearInterval(timer)
      init()
    } else if(code === 802) {
      flag.value = true
    } else if(code === 803) {
      clearInterval(timer)
      isSucceed.value = true
      console.log('cookie', cookie)
      localStorage.setItem(`MUSIC_U`, cookie);
      ElMessage.success('授权登陆成功')
      dialogVisible.value = false
      getUserAccountFn()
    }
  }, 3000)
  return timer
}

onUnmounted(() => {
  clearInterval(timer)
})

const handleClose = () => {

}
const show = () => {
  init()
  dialogVisible.value = true
}

defineExpose({
  dialogVisible,
  show
})

</script>

<template>
  <el-dialog
      v-model="dialogVisible"
      title="登录"
      width="30%"
      :before-close="handleClose"
  >
    <div>
      <img v-if="!flag" :src="qrUrl" alt="" id="qr-img">
      <h1 v-else>{{isSucceed ? '授权登陆成功' : '授权中...'}}</h1>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">
          确认
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style lang="less" scoped>

</style>