import {formattingTime} from "@/utils";
import {Columns} from "@/components/SongList/index.vue";
import {GetMusicDetailData} from "@/api/musicList";

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
    width: '20%',
    class: 'album',
    processEl(h, data) {
      return h('div', (data.al || {}).name || data.album || '未知专辑')
    },
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
]