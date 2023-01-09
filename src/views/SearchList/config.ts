import {formattingTime} from "@/utils";
import {GetMusicDetailData} from "@/api/musicList";
import {Columns} from "@/components/SongList/index.vue";

export const columns: Columns[] = [
  {
    title: '',
    width: '45px',
    type: 'index',
    class: 'empty',
  },
  {
    title: '',
    width: '45px',
    type: 'handle',
    class: 'handle',
    icon: ['love'],
  },
  {
    title: '标题',
    prop: 'name',
    width: '40%',
    class: 'title',
    type: 'title',
  },
  {
    title: '歌手',
    prop: 'ar',
    width: '20%',
    class: 'singer',
    type: 'singer',
  },
  {
    title: '专辑',
    prop: 'al.name', // 嵌套取值
    width: '20%',
    class: 'album',
  },
  {
    title: '时间',
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
