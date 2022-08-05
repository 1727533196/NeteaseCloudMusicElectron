import request from "@/utils/request";

export type Banner = {
  encodeId: string
  imageUrl: string
  scm: string
  song: null
  targetId: number
  targetType: number
  titleColor: string // 右下角背景颜色
  typeTitle: string // 右下角文字
  url: string | null // 网页跳转链接，一般是商品之类的
}
interface BannerRes {
  code: number
  banners: Array<Banner>
}

export const banner = () => request<null, BannerRes>('/banner')