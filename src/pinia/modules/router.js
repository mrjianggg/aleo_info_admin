import { asyncRouterHandle } from '@/utils/asyncRouter'
import { emitter } from '@/utils/bus.js'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const notLayoutRouterArr = []
const keepAliveRoutersArr = []
const nameMap = {}

const formatRouter = (routes, routeMap, parent) => {
  routes && routes.forEach(item => {
    item.parent = parent
    item.meta.btns = item.btns
    item.meta.hidden = item.hidden
    if (item.meta.defaultMenu === true) {
      if (!parent) {
        item = { ...item, path: `/${item.path}` }
        notLayoutRouterArr.push(item)
      }
    }
    routeMap[item.name] = item
    if (item.children && item.children.length > 0) {
      formatRouter(item.children, routeMap, item)
    }
  })
}

const KeepAliveFilter = (routes) => {
  routes && routes.forEach(item => {
    // 子菜单中有 keep-alive 的，父菜单也必须 keep-alive，否则无效。这里将子菜单中有 keep-alive 的父菜单也加入。
    if ((item.children && item.children.some(ch => ch.meta.keepAlive) || item.meta.keepAlive)) {
      item.component && item.component().then(val => {
        keepAliveRoutersArr.push(val.default.name)
        nameMap[item.name] = val.default.name
      })
    }
    if (item.children && item.children.length > 0) {
      KeepAliveFilter(item.children)
    }
  })
}

export const useRouterStore = defineStore('router', () => {
  const keepAliveRouters = ref([])
  const asyncRouterFlag = ref(0)
  const setKeepAliveRouters = (history) => {
    const keepArrTemp = []
    history.forEach(item => {
      if (nameMap[item.name]) {
        keepArrTemp.push(nameMap[item.name])
      }
    })
    keepAliveRouters.value = Array.from(new Set(keepArrTemp))
  }
  emitter.on('setKeepAlive', setKeepAliveRouters)

  const asyncRouters = ref([])
  const routeMap = ({})
  // 从后台获取动态路由
  const SetAsyncRouter = async() => {
    asyncRouterFlag.value++
    const baseRouter = [{
      path: '/layout',
      name: 'layout',
      component: 'view/layout/index.vue',
      meta: {
        title: '底层layout'
      },
      children: []
    }]
    const asyncRouter = [
        {
            "ID": 1,
            "CreatedAt": "2022-12-12T14:39:40.788+08:00",
            "UpdatedAt": "2022-12-12T14:39:40.788+08:00",
            "parentId": "0",
            "path": "dashboard",
            "name": "dashboard",
            "hidden": false,
            "component": "view/dashboard/index.vue",
            "sort": 1,
            "meta": {
                "activeName": "",
                "keepAlive": false,
                "defaultMenu": false,
                "title": "首页",
                "icon": "HomeFilled",
                "closeTab": false
            },
            "authoritys": null,
            "menuBtn": null,
            "menuId": "1",
            "children": null,
            "parameters": [],
            "btns": null
        },
        {
            "ID": 2,
            "CreatedAt": "2022-12-12T14:39:40.788+08:00",
            "UpdatedAt": "2022-12-12T14:39:40.788+08:00",
            "parentId": "0",
            "path": "banner",
            "name": "banner",
            "hidden": false,
            "component": "view/bannerMsg/index.vue",
            "sort": 2,
            "meta": {
                "activeName": "",
                "keepAlive": false,
                "defaultMenu": false,
                "title": "Banner管理",
                "icon": "HelpFilled",
                "closeTab": false
            },
            "authoritys": null,
            "menuBtn": null,
            "menuId": "2",
            "children": null,
            "parameters": [],
            "btns": null
        },
        {
            "ID": 3,
            "CreatedAt": "2022-12-12T14:39:40.788+08:00",
            "UpdatedAt": "2022-12-12T14:39:40.788+08:00",
            "parentId": "0",
            "path": "dapp",
            "name": "dapp",
            "hidden": false,
            "component": "view/dapp/index.vue",
            "sort": 3,
            "meta": {
                "activeName": "",
                "keepAlive": false,
                "defaultMenu": false,
                "title": "Dapp管理",
                "icon": "StarFilled",
                "closeTab": false
            },
            "authoritys": null,
            "menuBtn": null,
            "menuId": "3",
            "children": null,
            "parameters": [],
            "btns": null
        },
        {
            "ID": 33,
            "CreatedAt": "2022-12-12T14:39:40.788+08:00",
            "UpdatedAt": "2022-12-12T14:39:40.788+08:00",
            "parentId": "0",
            "path": "info",
            "name": "info",
            "hidden": false,
            "component": "view/info/index.vue",
            "sort": 4,
            "meta": {
                "activeName": "",
                "keepAlive": false,
                "defaultMenu": false,
                "title": "通知管理",
                "icon": "BellFilled",
                "closeTab": false
            },
            "authoritys": null,
            "menuBtn": null,
            "menuId": "33",
            "children": null,
            "parameters": [],
            "btns": null
        },
        {
            "ID": 12,
            "CreatedAt": "2022-12-12T14:39:40.788+08:00",
            "UpdatedAt": "2022-12-12T14:39:40.788+08:00",
            "parentId": "0",
            "path": "example",
            "name": "example",
            "hidden": false,
            "component": "view/example/index.vue",
            "sort": 7,
            "meta": {
                "activeName": "",
                "keepAlive": false,
                "defaultMenu": false,
                "title": "示例文件",
                "icon": "management",
                "closeTab": false
            },
            "authoritys": null,
            "menuBtn": null,
            "menuId": "12",
            "children": [
                {
                    "ID": 13,
                    "CreatedAt": "2022-12-12T14:39:40.788+08:00",
                    "UpdatedAt": "2022-12-12T14:39:40.788+08:00",
                    "parentId": "12",
                    "path": "upload",
                    "name": "upload",
                    "hidden": false,
                    "component": "view/example/upload/upload.vue",
                    "sort": 5,
                    "meta": {
                        "activeName": "",
                        "keepAlive": false,
                        "defaultMenu": false,
                        "title": "媒体库（上传下载）",
                        "icon": "upload",
                        "closeTab": false
                    },
                    "authoritys": null,
                    "menuBtn": null,
                    "menuId": "13",
                    "children": null,
                    "parameters": [],
                    "btns": null
                },
                {
                    "ID": 14,
                    "CreatedAt": "2022-12-12T14:39:40.788+08:00",
                    "UpdatedAt": "2022-12-12T14:39:40.788+08:00",
                    "parentId": "12",
                    "path": "breakpoint",
                    "name": "breakpoint",
                    "hidden": false,
                    "component": "view/example/breakpoint/breakpoint.vue",
                    "sort": 6,
                    "meta": {
                        "activeName": "",
                        "keepAlive": false,
                        "defaultMenu": false,
                        "title": "断点续传",
                        "icon": "upload-filled",
                        "closeTab": false
                    },
                    "authoritys": null,
                    "menuBtn": null,
                    "menuId": "14",
                    "children": null,
                    "parameters": [],
                    "btns": null
                },
            ],
            "parameters": [],
            "btns": null
        }
    ]
    asyncRouter && asyncRouter.push({
      path: 'reload',
      name: 'Reload',
      hidden: true,
      meta: {
        title: 'AAAAAAAAAA',
        closeTab: true,
      },
      component: 'view/error/reload.vue'
    })
    formatRouter(asyncRouter, routeMap)
    baseRouter[0].children = asyncRouter
    if (notLayoutRouterArr.length !== 0) {
      baseRouter.push(...notLayoutRouterArr)
    }
    asyncRouterHandle(baseRouter)
    KeepAliveFilter(asyncRouter)
    asyncRouters.value = baseRouter
    console.log('asyncRouters===',asyncRouters);
    return true
  }

  return {
    asyncRouters,
    keepAliveRouters,
    asyncRouterFlag,
    SetAsyncRouter,
    routeMap
  }
})

