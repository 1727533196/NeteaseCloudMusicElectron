<script lang="ts">
import {ref, h, withDirectives, resolveDirective, defineComponent, resolveComponent, PropType, watch} from "vue"
import {useRouter} from "vue-router"
import {lookup} from '@/utils'
import {GetMusicDetailData, PlayList} from "@/api/musicList"
import {useUserInfo} from "@/store"
import useMusic from "@/components/MusicPlayer/useMusic"
import {useMusicAction} from "@/store/music"
import Pagination from '@/components/Pagination/index.vue'

export interface Columns {
  title: string
  icon?: string[]
  prop?: string
  on?: object
  style?: object
  width?: string
  type?: 'index' | 'handle' | 'singer' | 'title' | 'album'
  class?: string
  processEl?: (createVNode: typeof h, arg: any, index: number) => any
}

interface Props {
  list: GetMusicDetailData[] // 列表信息
  songs: GetMusicDetailData // 播放器正在播放的歌曲信息
  // header: Header[]
  columns: Columns[]
  loading?: boolean // 是否加载中
  ids?: number[] // 歌曲id列表
  listInfo?: PlayList // 歌单信息
  scroll?: boolean // 是否显示滚动条
}

export const indiviEl = (config: Columns, type: 1 | 2,value: any) => {
  const ClsasNames = {
    1: 'title-item',
    2: 'item',
  }
  return h('div', {
    style: {...config.style, width: config.width},
    class: [ClsasNames[type], config.class],
    ...config.on,
  }, value)
}

export default defineComponent({
  props: {
    list: {
      type: Array as () => GetMusicDetailData[],
      required: true,
    },
    songs: {
      type: Object as PropType<GetMusicDetailData>,
      required: true,
    },
    columns: {
      type: Array as PropType<Columns[]>,
      required: true,
    },
    loading: Boolean,
    ids: Array as PropType<number[]>,
    listInfo: Object as PropType<PlayList>,
    scroll: Boolean, // 是否显示滚动条
    isPaging: { // 是否需要分页
      type: Boolean,
      default: false,
    },
    total: Number, // 总数
    pageSize: { // 每页显示的最大数量
      type: Number,
      default: 50,
    },
    currentPage: { // 当前页数
      type: Number,
      default: 1,
    },
    isLoadingEndflyback: { // 等待loading开始移至滚动条为最上方
      type: Boolean,
      default: false,
    },
  },
  emits: ['play', 'current-change', 'update:modelValue'], // 播放歌曲
  setup(props, {emit, attrs}) {
    const store = useUserInfo()
    const music = useMusicAction()
    const {likeMusic} = useMusic()
    const id = ref(0)

    const formatCount = (index: number) => {
      return index.toString().length > 1 ? index : '0' + index
    }
    const playHandler = (item: GetMusicDetailData, index: number) => {
      // 歌曲相同的情况下, 如果当前双击的歌曲不是当前正在播放的歌单歌曲,那应该播放
      if(music.runtimeList.id === music.currentItem.id) {
        // 没暂停，双击当前应该什么都不做
        if($audio.isPlay && props.songs.id === item.id) {
          return
        }
        // 暂停，双击应该继续播放。
        if(!$audio.isPlay && props.songs.id === item.id) {
          return $audio.play()
        }
      }
      // 判断与当前歌单是否相同
      if(music.runtimeList.id !== music.currentItem.id && props.ids && props.listInfo) {
        // 如果不相同就更新 当前歌单
        music.updateRuntimeList({tracks:props.list, ...props.listInfo}, props.ids)
      }
      id.value = item.id
      emit('play', item.id, index)
    }
    const mousedownHandler = (item: GetMusicDetailData) => {
      id.value = item.id
    }
    const isLike = (item: GetMusicDetailData) => {
      return store.userLikeIds.includes(item.id)
    }
    const activeText = (item: GetMusicDetailData) => {
      if(props.listInfo) {
        return item.id === props.songs.id && (props.listInfo.id === music.runtimeList.id)
      } else {
        return item.id === props.songs.id
      }
    }


    const router = useRouter()
    const userDetail = (id: number) => {
      router.push(`/detail?uid=${id}`)
    }
    const renderPagination = () => {
      return props.isPaging && props.total ? h(Pagination, {
        background: true,
        total: props.total,
        pageSize: props.pageSize,
        currentPage: props.currentPage,
        onCurrentChange: (page: number) => emit('current-change', page),
      }) : ''
    }

    watch(() => props.loading, (val) => {
      if(props.isLoadingEndflyback && val) {
        document.querySelector('.main')!.scrollTop = 0
      }
    })

    const loadingDiretive = resolveDirective('loading')!
    const input = resolveComponent('ElInput')
    const val = ref('')

    return () => {
      return h('div', {
          style: {
            overflowY: props.scroll ? 'auto' : 'visible',
          },
          class: 'container',
        },
        [
          // h(input, {
          //   modelValue: val.value,
          //   'onUpdate:modelValue': (value: string) => emit('update:modelValue', value)
          // }),
          h('div', {class:'title-container', style: {}}, props.columns.map(config => {
            return indiviEl(config, 1, config.title)
          })),
          h('div', {class:'list-container'}, props.list.map((data, i) => {
            return h('div', {
              ondblclick: () => playHandler(data, i),
              onMousedown: () => mousedownHandler(data),
              key: data.id,
              class: 'list',
              style: {background: data.id === id.value ? 'rgba(255, 255, 255, 0.08)'
                  : i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'none'}
            }, props.columns.map(config => {
              if(config.processEl) {
                return indiviEl(config, 2, config.processEl(h, data, i))
              }
              else if(config.icon) {
                return indiviEl(config, 2, config.icon.map(val => {
                  const result = isLike(data)
                  if(val === 'love') {
                    return h('i', {
                      onClick: () => likeMusic(data.id, !result),
                      class: ['iconfont', result ? 'icon-xihuan1' : 'icon-xihuan'],
                    })
                  }
                }))
              }
              else if(!config.type && config.prop) {
                return indiviEl(config, 2, lookup(data, config.prop))
              }
              else if(config.type) {
                if(config.type === 'index') {
                  return indiviEl(config, 2, formatCount(props.isPaging
                    ? props.pageSize * (props.currentPage-1) + (i + 1) :
                    i + 1)
                  )
                } else if(config.type === 'singer') {
                  if(!data.ar) {
                    return indiviEl(config, 2, data.artist)
                  }
                  const len = data.ar.length - 1
                  return indiviEl(config, 2, data.ar.map((ar, index) => {
                    return [h('span', {
                      onClick: () => ar.id && userDetail(ar.id),
                      class: [ar.id && 'name'],
                      style: {cursor: ar.id ? 'pointer' : 'default', color: ar.id ? '' : 'rgba(150, 150, 150, 0.60)'}
                    }, ar.name || data.artist || '未知艺人'), (index < len ? ' ·/ ' : '')]
                  }))
                } else if(config.type === 'title') {
                  return indiviEl({
                    ...config,
                    style: {
                      ...config.style,
                      color: activeText(data) ? 'rgb(255,60,60)' : ''
                    }
                  }, 2, lookup(data, config.prop))
                } else if(config.type === 'album') {
                  return indiviEl(config, 2, lookup(data, config.prop) || '未知专辑')
                }
              }
            }))
          })),
          // <el-pagination background layout="prev, pager, next" :total="1000" />
          renderPagination(),
          withDirectives(h('div', {
            class:'loading',
            style: {
              display: props.loading ? 'block' : 'none',
            }}), [
            [loadingDiretive, props.loading]
          ]),
        ]
      )
    }
  },
})
</script>

<style lang="less" scoped>
.container {
  margin-top: 20px;
  flex: 1;
  position: relative;
  .loading {
    position: absolute;
    z-index: 99;
    top: 0;
    height: 100%;
    width: 100%;
    :deep(.el-loading-mask) {
      background-color: #2b2b2b;

      .el-loading-spinner {
        position: fixed;
        top: 50%;
        transform: translateY(-50%);
      }
    }
  }
  .empty {
    width: 50px;
  }
  .handle {
    width: 45px;
    margin-right: 20px;
  }
  .title {
    width: 40%;
    color: @text;
    margin-right: 40% - 38px;
    .textOverflow();;
  }
  .singer {
    width: 20%;
    .textOverflow();;
    margin-right: 20% - 19px;
    .name {
      cursor: pointer;
      &:hover {
        color: @text;
      }
    }

  }
  .album {
    width: 20%;
    .textOverflow();;
    margin-right: 20% - 19px;
  }
  .time {
    width: 10%;
  }
  .title-container {
    padding: 0 25px;
    display: flex;
    font-size: 14px;
    height: 35px;
    color: @darkText;
    justify-content: space-around;
    .title-item {
      text-align: left;
    }
    .title-item.title {
      color: @darkText;
    }
  }
  .list {
    padding: 0 25px;
    justify-content: space-around;
    font-size: 14px;
    display: flex;
    height: 35px;
    color: @darkText;
    align-items: center;
    .item {
      text-align: left;
    }
    .handle {
      font-size: 18px;
      cursor: pointer;
      .icon-xihuan1 {
        font-size: 18px;
        color: #eb4141;
        margin-left: 4px;
      }
      .icon-xihuan {
        color: #a5a7a8;
        font-size: 19px;
        margin-left: 4px;
      }
    }

    .title {
      color: @text;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.06) !important;
    }
  }
}
</style>