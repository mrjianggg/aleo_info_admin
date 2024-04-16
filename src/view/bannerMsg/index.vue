<template>
  <div>
    <div class="aleo-table-box">
      <div class="aleo-btn-list">
        <el-button type="primary" icon="plus" @click="addInfo">添加</el-button>
        <el-button @click="openDrag" icon="Sort" class=" ml-2">排序</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="_id"
      >
        
        <el-table-column min-width="60" label="顺序" type="index" :index="indexMethod" />
        <el-table-column align="left" label="Banner名称" min-width="150" prop="name"/>
        <el-table-column
          align="left"
          label="PC图"
          min-width="200"
        >
          <template #default="scope">
            <el-image class="w-52 h-52" :src="scope.row.img" :preview-src-list="[scope.row.img]" hide-on-click-modal preview-teleported :fit="'scale-down'" />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="移动端图"
          min-width="200"
        >
          <template #default="scope">
            <el-image class="w-52 h-52" :src="scope.row.imgMobile" :preview-src-list="[scope.row.imgMobile]" hide-on-click-modal preview-teleported :fit="'scale-down'" />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="链接"
          min-width="150"
          prop="url"
        />

        <el-table-column
          align="left"
          label="更新时间"
          width="180"
        >
          <template #default="scope">
            {{ formatTime(scope.row.updateTime) }}
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          fixed="right"
          label="操作"
          width="200"
        >
          <template #default="scope">
            <el-button
              icon="edit"

              type="primary"
              link
              @click="openEdit(scope.row)"
            >编辑</el-button>
            <el-button
              icon="delete"
              type="danger"
              link
              @click="deleteUserFunc(scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>

      </el-table>

    </div>
    <el-dialog
      v-model="addInfoDialog"
      :title="dialogFlag === 'add' ?'添加':'编辑'"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-form
          ref="userForm"
          :rules="rules"
          :model="itemInfo"
          label-width="100px"
        >
          <el-form-item
            label="Banner名称"
            prop="name"
          >
            <el-input v-model="itemInfo.name" />
          </el-form-item>

          <el-form-item
            label="链接"
            prop="url"
          >
            <el-input v-model="itemInfo.url" />
          </el-form-item>

          <el-form-item
            label="PC图"
            label-width="100px"
            prop="img"
          >
            <UploadImg @fn="(url)=>{itemInfo.img = url}" :url="itemInfo.img" />
          </el-form-item>

          <el-form-item
            label="移动端图"
            label-width="100px"
          >
            <UploadImg @fn="(url)=>{itemInfo.imgMobile = url}" :url="itemInfo.imgMobile" />
          </el-form-item>


        </el-form>

        

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAddUserDialog">取 消</el-button>
          <el-button
            type="primary"
            @click="enterAddUserDialog"
          >确 定</el-button>
        </div>
      </template>
    </el-dialog>


    <Drag ref="dragEl" @childEvent="childEvent" :data="tableData" :id="'_id'" :showImg="'img'" />
  </div>
</template>

<script setup>

import { formatTime } from '@/utils/date'
import service from '@/utils/request'
import Drag from '@/components/drag/index.vue' 
import UploadImg from '@/components/upload/uploadImg.vue'

import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'Banner',
})

const indexMethod = (index) => {
  return '#'+(index+1)
}
const tableData = ref([])


// 查询
const getTableData = async() => {
  service({url: '/banner/list',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      tableData.value = res.result
    }
  })
}



// watch(() => tableData.value, () => {
//   setAuthorityIds()
// })


getTableData()

const dragEl = ref(null)

const childEvent = (val)=>{
  const result = val.map((item,index) => {
    return {
      rank: index+1,
      _id: item._id
    }
  });
  
  service({url: '/banner/resetRank',method: 'post',data:result}).then(async(res)=>{
    if (res.code === 0) {
      ElMessage({ type: 'success', message: '操作成功' })
      dragEl.value.cancel()
      await getTableData()
    }
  })
}


const openDrag = () => {
  dragEl.value.open()
}


const deleteUserFunc = async(row) => {
  ElMessageBox.confirm('此操作将删除该条数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(async() => {
    await service({url: `/banner/${row._id}`,method: 'delete'}).then(async(res)=>{
      if (res.code === 0) {
        ElMessage({
          type: 'success',
          message: '删除成功!'
        })
        await getTableData()
      }
    })
  })
}

// 弹窗相关
let itemInfo = ref({
  name: '',
  url: '',
  img: '',
  imgMobile: ''
})

const rules = ref({
  name: [
    { required: true, message: '请输入Banner名称', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入链接', trigger: 'blur' }
  ],
  img: [
    { required: true, message: '请上传PC图', trigger: 'blur' }
  ],
})
const userForm = ref(null)
const enterAddUserDialog = async() => {
  userForm.value.validate(async valid => {
    if (valid) {
      if (dialogFlag.value === 'add') {
        service({url: '/banner/add',method: 'post',data:itemInfo.value}).then(async(res)=>{
          if (res.code === 0) {
            ElMessage({ type: 'success', message: '创建成功' })
            await getTableData()
            closeAddUserDialog()
          }
        })

      }
      if (dialogFlag.value === 'edit') {
        service({url: `/banner/${itemInfo.value._id}`,method: 'put',data:itemInfo.value}).then(async(res)=>{
          if (res.code === 0) {
            ElMessage({ type: 'success', message: '编辑成功' })
            await getTableData()
            closeAddUserDialog()
          }
        })
      }
    }
  })
}

const addInfoDialog = ref(false)
const closeAddUserDialog = () => {
  userForm.value.resetFields()
  itemInfo.value = {}
  addInfoDialog.value = false
}

const dialogFlag = ref('add')

const addInfo = () => {
  itemInfo.value.name = ''
  itemInfo.value.url = ''
  itemInfo.value.img = ''
  itemInfo.value.imgMobile = ''
  dialogFlag.value = 'add'
  addInfoDialog.value = true
}


const openEdit = (row) => {
  dialogFlag.value = 'edit'
  itemInfo.value = JSON.parse(JSON.stringify(row))
  addInfoDialog.value = true
}

</script>

<style lang="scss">
  .header-img-box {
    @apply w-52 h-52 border border-solid border-gray-300 rounded-xl flex justify-center items-center cursor-pointer;
 }
</style>
