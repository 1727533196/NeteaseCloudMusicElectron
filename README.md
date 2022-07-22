# Vue 3 + TypeScript + Vite

This template should help get you started developing with Vue 3 and TypeScript in Vite. The template uses Vue 3 `<script setup>` SFCs, check out the [script setup docs](https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup) to learn more.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Type Support For `.vue` Imports in TS

Since TypeScript cannot handle type information for `.vue` imports, they are shimmed to be a generic Vue component type by default. In most cases this is fine if you don't really care about component prop types outside of templates. However, if you wish to get actual prop types in `.vue` imports (for example to get props validation when using manual `h(...)` calls), you can enable Volar's Take Over mode by following these steps:

1. Run `Extensions: Show Built-in Extensions` from VS Code's command palette, look for `TypeScript and JavaScript Language Features`, then right click and select `Disable (Workspace)`. By default, Take Over mode will enable itself if the default TypeScript extension is disabled.
2. Reload the VS Code window by running `Developer: Reload Window` from the command palette.

You can learn more about Take Over mode [here](https://github.com/johnsoncodehk/volar/discussions/471).

# 项目仍在进行中
1. 可以获取用户创建菜单（我喜欢的音乐），可以播放，一些菜单的操作已完成
2. 搜索歌曲列表正在进行

# 和网易云音乐一样吗？
1. 现在很多音乐播放器会遇到歌曲没有版权的情况，开发项目的初衷就是为了解决这个问题，后期会集成多端搜索（网易云、qq音乐、酷我音乐）
````
当父组件通过模板 ref 的方式获取到当前组件的实例，获取到的实例会像这样 { a: number, b: number } (ref 会和在普通实例中一样被自动解包)
项目里集成了components文件下自动引入,您可以无需引入直接使用即可（推荐引用,这样可以让ts更好的识别类型）

vite 提供了两种模式：具有开发服务器的开发模式（development）和生产模式（production）
组件中使用：
console.log(import.meta.env.VITE_APP_WEB_URL)

请求器一共有四种调用方式   配置型请求默认为get，其余三种默认都为post
  <R extends unknown, D>(config: AxiosRequestConfig & {data: R, params: R}): Promise<D>;
  <R extends unknown, D>(url: string, method?: Method, config?: AxiosRequestConfig & {data: R, params: R}): Promise<D>;
  <R extends unknown, D>(url: string, data: R, method?: Method): Promise<D>;
  <R extends unknown, D>(url: string, data: R, config?: AxiosRequestConfig): Promise<D>;
  
重写了audio的play和pause，让他们具有音量过渡效果
    开始播放的过渡时间比暂停长一点，这样效果感觉会更好些
````

```
已知bug：
    1. 音量静音获取有问题 -done
    2. 双击播放时会偶发出现上一首歌选中的背景颜色没去掉 -done
    3. 当自动切换到下一首歌时，背景颜色没有过来，字体颜色颜色没问题 -done
    4. 当切歌时会因为音量过渡原因延迟重置进度条长度 （暂停和播放icon也会有这个问题） -done
    5. 当音乐还没有加载完成时，应该给进度条设置禁用 （目前没有设置，点击进度条快进时，等音乐加载完成进度条会重置）
    
需要优化:
    1. 应该给每个列表分区保存ids, 目前都是共同的,会导致切换其他列表ids也变换
    2. 在关闭应用时保存当前歌曲id,以及播放进度
    3. 一上来自动选中上一次播放歌单的列表
    4. 暂停/播放 开启音乐淡入淡出 (暂停播放已完成，切歌时应该也加上) -done
    5. 优化滚动条样式 -done
    6. Uncaught (in promise): The play() request was interrupted by a call to pause()
    7. 播放当前歌曲时，再次双击播放进度应该调整为当前
    8. 每次在获取歌单列表时，应该也同时获取歌单信息

实现顺序
    1. 播放器
        1. 实现播放顺序  (随机播放 & 顺序播放 & 列表循环 & 单曲循环) -done
        2. 取消/添加喜欢 -done
    1. 实现歌单信息 -done  （操作还没有完成）
    2. 布局左侧菜单,先写死
    3. 歌单列表操作
    4. 搜索

```
