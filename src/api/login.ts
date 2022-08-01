import request from "../utils/request";
import {getUserAccountRes} from "@/api/user";

interface PhoneLoginRes extends getUserAccountRes {
  token: string
  cookie: string
}

// 发送验证码
export const captchaLogin = (phone: string) =>
  request<{phone: string}, {code: number, data: boolean}>(`/captcha/sent`, {phone})

// 登录
export const phoneLogin = (phone: string, captcha:string) =>
    request<{phone: string, captcha: string}, PhoneLoginRes>(`/login/cellphone`, {phone, captcha})