/**
 * Created by LangK on 2016/12/19.
 */

export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: function (resolve) {
      require(['./components/home.vue'], resolve)
    }
  }
]
