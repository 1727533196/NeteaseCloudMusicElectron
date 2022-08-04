import {reactive} from "vue";
import {PlayList} from "@/api/musicList";


export const paths = ['/home', '/fm', '/video', '/follow', '/local', '/lately', '/play-list']
export type ListItem = {
  name: string,
  icon: string,
  path: typeof paths[number]
  fontSize?: number
} & Partial<PlayList>
interface MenuConfig {
  title: '我的音乐' | '创建的歌单' | '收藏的歌单' | false,
  mark: 'my' | 'play' | 'subscribedList' | false,
  list: ListItem[]
}
const fontSize = 15
export const originAsideMenuConfig: MenuConfig[] = [
  {
    title: false,
    mark: false,
    list: [
      {
        name: '发现音乐',
        icon: '',
        path: '/home',
        fontSize,
      },
      {
        name: '私人FM',
        icon: '',
        path: '/fm',
        fontSize,
      },
      {
        name: '视频',
        icon: '',
        path: '/video',
        fontSize,
      },
      {
        name: '关注',
        icon: '',
        path: '/follow',
        fontSize
      },
    ],
  },
  {
    title: '我的音乐',
    mark: 'my',
    list: [
      {
        name: '本地与下载',
        icon: '',
        path: '/local'
      },
      {
        name: '最近播放',
        icon: '',
        path: '/lately'
      },
    ],
  },
  {
    title: '创建的歌单',
    mark: 'play',
    list: [
      {
        name: '我喜欢的音乐',
        icon: '',
        path: '/play-list'
      },
    ]
  },
  {
    title: '收藏的歌单',
    mark: 'subscribedList',
    list: []
  },
]

export const asideMenuConfig = reactive([...originAsideMenuConfig])