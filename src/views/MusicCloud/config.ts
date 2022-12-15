import {formattingTime} from "@/utils";
import {Header} from "@/components/SongList/index.vue";

export const header: Header[] = [
  {
    title: '',
    width: '45px',
    type: 'index',
    class: 'empty',
    key: 'empty'
  },
  {
    title: '',
    width: '45px',
    type: 'handle',
    class: 'handle',
    key: 'handle'
  },
  {
    title: '标题',
    prop: 'name',
    width: '40%',
    class: 'title',
    key: 'title'
  },
  {
    title: '歌手',
    prop: 'ar',
    width: '20%',
    class: 'singer',
    key: 'singer',
  },
  {
    title: '专辑',
    width: '20%',
    class: 'album',
    key: 'album',
    slot: (row) => {
      return (
        `<div>${(row.al || {}).name || row.album || '未知专辑'}</div>`
      ) as unknown as HTMLElement
    },
  },
  {
    title: '时间',
    prop: 'dt',
    width: '10%',
    class: 'time',
    key: 'time',
    process: (val: number) => {
      return formattingTime(val)
    }
  },
]