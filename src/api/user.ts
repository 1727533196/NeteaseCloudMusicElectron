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

export type User = {
  userId: number
  signature: string // 签名
  userName: string
  nickname: string // 账号昵称
  vipType: number // vip类型
  userType: number
  backgroundUrl: string // 用户背景
  avatarUrl: string // 用户头像
}
export interface getArtistDetailRes {
  message: string,
  data: {
    artist: {

    },
    blacklist: boolean
    eventCount: number
    identify: {
      actionUrl: string // 请求网易云音乐的链接
      imageDesc: string // 标签
      imageUrl: string // 标签图片
    },
    preferShow: number
    secondaryExpertIdentiy: {}[]
    showPriMsg: boolean
    user: User
    videoCount: number
    vipRights: {}
  },
  code: number,
}
// 获取用户详情  通过指定的uid获取指定用户详情信息
export const getUserDetail = (uid: number) => request(`/user/detail?uid=${uid}`, 'get')

// 获取账号信息
export const getUserAccount = () => request<null, getUserAccountRes>('/user/account', 'get');

// 获取歌手详情
export const getArtistDetail = (id: number) => request<{id: number}, getArtistDetailRes>(`/artist/detail?id=${id}`, 'get')