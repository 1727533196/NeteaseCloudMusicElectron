import {formattingTime} from "@/utils";
import {GetMusicDetailData} from "@/api/musicList";
import {Columns} from "@/components/SongList/index.vue";

export const columns: Columns[] = [
  {
    title: '#',
    width: '45px',
    type: 'index',
    class: 'empty',
  },

  {
    title: '标题',
    prop: 'name',
    width: '40%',
    class: 'title',
    type: 'title',
  },
  {
    title: '专辑',
    prop: 'al.name', // 嵌套取值
    width: '20%',
    class: 'album',
  },
  {
    title: '喜欢',
    width: '45px',
    type: 'handle',
    class: 'handle',
    icon: ['love'],
  },
  {
    title: '时长',
    prop: 'dt',
    width: '10%',
    class: 'time',
    processEl: (h, data: GetMusicDetailData) => {
      return formattingTime(data.dt)
    }
  },
  {
    title: '热度',
    width: '10%',
    processEl(h, data: GetMusicDetailData) {
      return h('div', {
        style: {overflow: 'hidden', height: '6px', width: '100%', 'border-radius': '5px', 'background-color': '#373737'}
      }, h('div', {
        style: {height: '100%', 'background-color': '#444444', width: `${data.pop}%`}
      }))
    },
  },
]

export const tabsConfig = [
  {
    name: 'song',
    label: '单曲',
  },
  {
    name: 'singer',
    label: '歌手',
  },
  {
    name: 'album',
    label: '专辑',
  },
  {
    name: 'video',
    label: '视频',
  },
  {
    name: 'songList',
    label: '歌单',
  },
  {
    name: 'lyric',
    label: '歌词',
  },
  {
    name: 'podcast',
    label: '播客',
  },
  {
    name: 'voice',
    label: '声音',
  },
  {
    name: 'user',
    label: '用户',
  },
]
