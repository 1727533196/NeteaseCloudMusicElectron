import {reactive} from "vue";
import {PlayList} from "@/api/musicList";

export const paths = ['/home', '/fm', '/video', '/follow', '/local', '/lately', '/play-list', '/cloud']
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
const fontSize = 13
export const needUseComparisonPaths = ['/home', '/fm', '/video', '/follow', '/local', '/lately', '/cloud']
export const originAsideMenuConfig: MenuConfig[] = [
  {
    title: false,
    mark: false,
    list: [
      {
        name: '为我推荐',
        icon: '',
        path: '/home',
        fontSize,
        id: 1,
      },
      {
        name: '云音乐精选',
        icon: '',
        path: '/fm',
        fontSize,
        id: 2,
      },
      {
        name: '博客',
        icon: '',
        path: '/video',
        fontSize,
        id: 3,
      },
      {
        name: '社区',
        icon: '',
        path: '/follow',
        fontSize,
        id: 4,
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
        path: '/local',
        id: 5,
      },
      {
        name: '最近播放',
        icon: '',
        path: '/lately',
        id: 6,
      },
      {
        name: '我的音乐云盘',
        icon: '',
        path: '/cloud',
        id: 7,
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
        path: '/play-list',
        id: 8,
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