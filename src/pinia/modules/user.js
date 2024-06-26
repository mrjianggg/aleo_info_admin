import { login, getUserInfo, setSelfInfo } from '@/api/user'
import service from '@/utils/request'
import { jsonInBlacklist } from '@/api/jwt'
import router from '@/router/index'
import { ElLoading, ElMessage } from 'element-plus'
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import { useRouterStore } from './router'
import cookie from 'js-cookie'

export const useUserStore = defineStore('user', () => {
  const loadingInstance = ref(null)


  const UserInfo = {
      "ID": 1,
      "CreatedAt": "2022-12-12T14:39:40.947+08:00",
      "UpdatedAt": "2022-12-12T14:39:40.949+08:00",
      "uuid": "02d50155-4829-489f-8843-376ce0ac4e3c",
      "userName": "admin",
      "nickName": "Mr.奇淼",
      "sideMode": "dark",
      "headerImg": "https://qmplusimg.henrongyi.top/gva_header.jpg",
      "baseColor": "#fff",
      "activeColor": "#1890ff",
      "authorityId": 888,
      "authority": {
          "CreatedAt": "2022-12-12T14:39:40.776+08:00",
          "UpdatedAt": "2022-12-12T14:39:40.951+08:00",
          "DeletedAt": null,
          "authorityId": 888,
          "authorityName": "普通用户",
          "parentId": 0,
          "dataAuthorityId": null,
          "children": null,
          "menus": null,
          "defaultRouter": "dashboard"
      },
      "authorities": [
          {
              "CreatedAt": "2022-12-12T14:39:40.776+08:00",
              "UpdatedAt": "2022-12-12T14:39:40.951+08:00",
              "DeletedAt": null,
              "authorityId": 888,
              "authorityName": "普通用户",
              "parentId": 0,
              "dataAuthorityId": null,
              "children": null,
              "menus": null,
              "defaultRouter": "dashboard"
          },
          {
              "CreatedAt": "2022-12-12T14:39:40.776+08:00",
              "UpdatedAt": "2022-12-12T14:39:40.955+08:00",
              "DeletedAt": null,
              "authorityId": 8881,
              "authorityName": "普通用户子角色",
              "parentId": 888,
              "dataAuthorityId": null,
              "children": null,
              "menus": null,
              "defaultRouter": "dashboard"
          },
          {
              "CreatedAt": "2022-12-12T14:39:40.776+08:00",
              "UpdatedAt": "2022-12-12T14:39:40.953+08:00",
              "DeletedAt": null,
              "authorityId": 9528,
              "authorityName": "测试角色",
              "parentId": 0,
              "dataAuthorityId": null,
              "children": null,
              "menus": null,
              "defaultRouter": "dashboard"
          }
      ],
      "phone": "17611111111",
      "email": "333333333@qq.com",
      "enable": 1
  }
  
  const userInfo = ref({
    uuid: '',
    nickName: '',
    headerImg: '',
    authority: {},
    sideMode: 'dark',
    activeColor: 'var(--el-color-primary)',
    baseColor: '#fff'
  })
  
  const token = ref(window.localStorage.getItem('token') || cookie.get('token') || '')
  const setUserInfo = (val) => {
    userInfo.value = val
  }

  const setToken = (val) => {
    token.value = val
  }


  const ResetUserInfo = (value = {}) => {
    userInfo.value = {
      ...userInfo.value,
      ...value
    }
  }
  /* 获取用户信息*/
  const GetUserInfo = async() => {
    const res = 
    {
        "code": 0,
        "data": {
            "userInfo": UserInfo
        },
        "msg": "获取成功"
    }
    if (res.code === 0) {
      setUserInfo(res.data.userInfo)
    }
    return res
  }


  
  /* 登录*/
  const LoginIn = async(loginInfo) => {
    loadingInstance.value = ElLoading.service({
      fullscreen: true,
      text: '登录中，请稍候...',
    })
    try {
      await service({ url: '/auth/login', method: 'post', data: loginInfo }).then(async res=>{
        if (res.code === 0) {
          console.log('res===--',res);
          setUserInfo(UserInfo)
          setToken(res.result.token)
          const routerStore = useRouterStore()
          await routerStore.SetAsyncRouter()
          const asyncRouters = routerStore.asyncRouters
          asyncRouters.forEach(asyncRouter => {
            router.addRoute(asyncRouter)
          })
  
          if (!router.hasRoute(userInfo.value.authority.defaultRouter)) {
            ElMessage.error('请联系管理员进行授权')
          } else {
            await router.replace({ name: userInfo.value.authority.defaultRouter })
          }
  
          loadingInstance.value.close()
  
          const isWin = ref(/windows/i.test(navigator.userAgent))
          if (isWin.value) {
            window.localStorage.setItem('osType', 'WIN')
          } else {
            window.localStorage.setItem('osType', 'MAC')
          }
          return true
        }
      })
      return

    } catch (e) {
      loadingInstance.value.close()
    }
    loadingInstance.value.close()
  }
  /* 登出*/
  const LoginOut = async() => {
    ClearStorage()
    router.push({ name: 'Login', replace: true })
    window.location.reload()
    // const res = await jsonInBlacklist()
    // if (res.code === 0) {
    //   await ClearStorage()
    //   router.push({ name: 'Login', replace: true })
    //   window.location.reload()
    // }
  }
  /* 清理数据 */
  const ClearStorage = async() => {
    token.value = ''
    sessionStorage.clear()
    localStorage.clear()
    cookie.remove('token')
  }
  /* 设置侧边栏模式*/
  const changeSideMode = async(data) => {
    const res = await setSelfInfo({ sideMode: data })
    if (res.code === 0) {
      userInfo.value.sideMode = data
      ElMessage({
        type: 'success',
        message: '设置成功'
      })
    }
  }

  const mode = computed(() => userInfo.value.sideMode)
  const sideMode = computed(() => {
    if (userInfo.value.sideMode === 'dark') {
      return '#191a23'
    } else if (userInfo.value.sideMode === 'light') {
      return '#fff'
    } else {
      return userInfo.value.sideMode
    }
  })
  const baseColor = computed(() => {
    if (userInfo.value.sideMode === 'dark') {
      return '#fff'
    } else if (userInfo.value.sideMode === 'light') {
      return '#191a23'
    } else {
      return userInfo.value.baseColor
    }
  })
  const activeColor = computed(() => {
    return 'var(--el-color-primary)'
  })

  watch(() => token.value, () => {
    window.localStorage.setItem('token', token.value)
  })

  return {
    userInfo,
    token,
    ResetUserInfo,
    GetUserInfo,
    LoginIn,
    LoginOut,
    changeSideMode,
    mode,
    sideMode,
    setToken,
    baseColor,
    activeColor,
    loadingInstance,
    ClearStorage
  }
})
