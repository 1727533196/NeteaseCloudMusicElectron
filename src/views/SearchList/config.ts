import {formattingTime} from "@/utils";
import {GetMusicDetailData} from "@/api/musicList";

export const header = [
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
  {
    title: '热度',
    width: '10%',
    slot(data: GetMusicDetailData) {
      return `<div style="overflow: hidden;height: 6px;width: 100%;border-radius: 5px;background-color: #373737">
         <div style="height: 100%;background-color: #444444;width: ${data.pop}%">
         </div>
      </div>`
    },
  },
]