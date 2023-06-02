import 'vue-router'

declare module 'vue-router' {
  interface LocationQuery {
    uid?: number
    id: number
    count: number
  }
}
