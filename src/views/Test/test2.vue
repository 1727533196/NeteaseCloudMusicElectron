<script setup lang="ts">
import {getUserAccountFn} from "@/utils/userInfo";
import { onUnmounted, ref } from "vue";
import {codeLogin, sendCodePhone} from "@/utils/useLogin";
import {loginQrCheck, loginQrCreate, loginQrKey, loginStatus} from "@/api/login";
import { setCookies } from "@/utils/cookies";
import { ElMessage } from "element-plus/es";
import request from "@/utils/request";

const phone = ref('')
const code = ref('')
const getUserAccountHandler = () => {
  getUserAccountFn()
}
const sendPhoneHandler = () => {
  sendCodePhone(phone.value)
}
const loginHandler = () => {
  codeLogin(phone.value, code.value).then(data => {
    console.log('data', data)
  })
}

const key = ref('')
const qrUrl = ref('')
const flag = ref(false) // 是否授权中
const isSucceed = ref(false)
let timer: NodeJS.Timer
const init = async () => {
  const { data:{unikey} } = await loginQrKey()
  key.value = unikey
  const { data:{qrimg} } = await loginQrCreate(key.value, true)
  qrUrl.value = qrimg

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
      const cookies = cookie.replace('HTTPOnly', '')
      setCookies(cookies);
      ElMessage.success('授权登陆成功')
      loginStatus()
    }
  }, 3000)
  return timer
}
init()

onUnmounted(() => {
  clearInterval(timer)
})

</script>

<template>
  <div style="display: flex;justify-content: center">
    <div class="test" >
      <el-button @click="getUserAccountHandler">获取账号信息</el-button>
      <el-input placeholder="输入手机号" v-model="phone"></el-input>
      <el-input placeholder="输入验证码" v-model="code"></el-input>
      <el-button @click="sendPhoneHandler" type="primary">发送验证码</el-button>
      <el-button @click="loginHandler" type="primary">登录</el-button>
    </div>
    <div>
      <img v-if="!flag" :src="qrUrl" alt="" id="qr-img">
      <h1 v-else>{{isSucceed ? '授权登陆成功' : '授权中...'}}</h1>
    </div>
  </div>
</template>

<style lang="less" scoped>
.test {
  >*+*{
    margin-top: 10px;
  }
}
</style>