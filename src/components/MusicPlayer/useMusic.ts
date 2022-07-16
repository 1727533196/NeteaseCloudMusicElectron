import {likeMusicApi} from "@/api/musicList";
import {ElMessage} from "element-plus";
import usePlayList from "@/components/Aside/usePlayList";
import {useUserInfo} from "@/store";

export default () => {
  const store = useUserInfo()
  const likeMusic = async (id: number, isLike: boolean = true) => {
    try {
      const data = await likeMusicApi(id, isLike)
      const msg = isLike ? '添加喜欢成功' : '取消喜欢成功'
      const {getPlayListDetailFn} = usePlayList()
      getPlayListDetailFn(store.currentItem.id)
      ElMessage.success(msg)
    } catch (e: any) {
      ElMessage.error(e.msg)
    }
  }

  return {
    likeMusic
  }
}
