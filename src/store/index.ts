import { defineStore } from 'pinia'
import {Profile} from "@/api/user";
import {PlayList} from "@/api/musicList";
import {asideMenuConfig, ListItem} from "@/layout/BaseAside/config";

export const useUserInfo = defineStore('userInfoId', {
  state: () => {
    return {
      profile: {
        avatarUrl: '', // 用户头像
        backgroundUrl: '', // 用户背景图片
        nickname: '', // 用户昵称
        createTime: null as null | number,
        vipType: null as null | number,
        userId: null as null | number, // 用户id
      },
      isLogin: false, // 是否登录
      userPlayListInfo: [] as PlayList[], // 用户歌单列表信息
      userLikeIds: [] as number[], // 用户喜欢列表ids
      volume: Number(localStorage.getItem('volume')) || 1, // 用户当前播放器音量
    }
  },
  actions: {
    updateProfile(val: Profile) {
      if(!val || !val.userId) {
        window.$login.show()
        this.$reset()
        return
      }
      type key = keyof typeof val
      for (const valKey in this.profile) {
        // @ts-ignore
        this.profile[valKey as key] = val[valKey as key]
      }
      localStorage.setItem('userId', String(this.profile.userId))
      this.isLogin = true
    },
    updateUserPlayList(val: PlayList[]) {
      this.userPlayListInfo = val

      const copyVal = JSON.parse(JSON.stringify(val)) as PlayList[]
      const myList: ListItem[] = []
      const subscribedList: ListItem[] = []
      copyVal.forEach(item => {
        if(item.subscribed) {
          subscribedList.push({...item, icon: '', path: "/play-list"})
        } else {
          myList.push({
            ...item,
            name: item.specialType === 5 ? '我喜欢的音乐' : item.name,
            // icon: item.specialType === 5 ? 'icon-xihuan' : '',
            icon: item.specialType === 5 ? '' : '',
            path: "/play-list"
          })
        }
      })
      let playItem = asideMenuConfig.find(item => item.mark === 'play')
      let subscribedListItem = asideMenuConfig.find(item => item.mark === 'subscribedList')
      myList.length && (playItem!.list = myList)
      subscribedList.length && (subscribedListItem!.list = subscribedList)
    },
    updateUserLikeIds(ids: number[]) {
      this.userLikeIds = ids
    },
  },
})

/*
export const useUserInfo = defineStore({
  id: 'counter',
  state: () => ({
    counter: 0
  }),
  getters: {
    doubleCount: (state) => state.counter * 2
  },
  actions: {
    increment() {
      this.counter++
    }
  }
})
 */
