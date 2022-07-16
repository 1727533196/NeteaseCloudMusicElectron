import request from "@/utils/request";

export type profile = {
  avatarUrl: string // 用户头像
  backgroundUrl: string // 用户背景图片
  nickname: string // 用户昵称
  createTime: number
  vipType: number
  userId: number // 用户id
}
export interface getUserAccountRes {
  account: {
    anonimousUser: boolean // 是否匿名用户
    createTime: number
    vipType: number
    id: number // 用户id
  }
  code: number
  profile: profile
}
// 获取用户详情  通过指定的uid获取指定用户详情信息
export const getUserDetail = (uid: number) => request(`/user/detail?uid=${uid}`, 'get')

// 获取账号信息
export const getUserAccount = () => request<null, getUserAccountRes>('/user/account', 'get');