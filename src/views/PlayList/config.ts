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
    title: '操作',
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
    prop: 'al.name', // 嵌套取值
    width: '20%',
    class: 'album',
    key: 'album',
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