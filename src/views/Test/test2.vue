<script setup lang="ts">
import {getUserAccountFn} from "@/utils/userInfo";
import {ref} from "vue";
import {codeLogin, sendCodePhone} from "@/utils/useLogin";

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
</script>

<template>
  <div>
    <el-button @click="getUserAccountHandler">获取账号信息</el-button>
    <el-input placeholder="输入手机号" v-model="phone"></el-input>
    <el-input placeholder="输入验证码" v-model="code"></el-input>
    <el-button @click="sendPhoneHandler" type="primary">发送验证码</el-button>
    <el-button @click="loginHandler" type="primary">登录</el-button>
  </div>
</template>

<style scoped>

</style>