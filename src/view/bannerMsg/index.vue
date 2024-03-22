<template>
  <div>
    <div class="aleo-table-box">
      <div class="aleo-btn-list">
        <el-button type="primary" icon="plus" @click="addUser">添加</el-button>
        <el-button @click="openDrag" icon="Sort" class=" ml-2">排序</el-button>
      </div>
      <el-table
        :data="tableData"
        row-key="ID"
      >
        
        <el-table-column min-width="60" label="顺序" type="index" :index="indexMethod" />
        <el-table-column align="left" label="Banner名称" min-width="150" prop="userName"/>
        <el-table-column
          align="left"
          label="PC图"
          min-width="200"
        >
          <template #default="scope">
            <CustomPic
              :width="200"
              :picType="'img'"
              :pic-src="scope.row.headerImg"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="移动端图"
          min-width="200"
        >
          <template #default="scope">
            <CustomPic
              :width="200"
              :picType="'img'"
              :pic-src="scope.row.headerImg"
            />
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="链接"
          min-width="150"
          prop="nickName"
        />
        <el-table-column
          align="left"
          label="更新时间"
          min-width="180"
          prop="phone"
        />

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
      <div class="gva-pagination">
        <el-pagination
          :current-page="page"
          :page-size="pageSize"
          :page-sizes="[10, 30, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </div>
    <el-dialog
      v-model="addUserDialog"
      title="用户"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-form
          ref="userForm"
          :rules="rules"
          :model="dataList"
          label-width="100px"
        >
          <el-form-item
            label="Banner名称"
            prop="userName"
          >
            <el-input v-model="dataList.userName" />
          </el-form-item>

          <el-form-item
            label="链接"
            prop="nickName"
          >
            <el-input v-model="dataList.nickName" />
          </el-form-item>

          <el-form-item
            label="PC图"
            label-width="100px"
            prop="headerImg"
          >
            <div
              style="display:inline-block"
              @click="openHeaderChange"
            >
              <img
                v-if="dataList.headerImg"
                alt="PC图"
                class="header-img-box"
                :src="(dataList.headerImg && dataList.headerImg.slice(0, 4) !== 'http')?path+dataList.headerImg:dataList.headerImg"
              >
              <div
                v-else
                class="header-img-box"
              >从媒体库选择</div>
              <ChooseImg
                ref="chooseImg"
                :target="dataList"
                :target-key="`headerImg`"
              />
            </div>
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


    <Drag ref="dragEl" @childEvent="childEvent" :data="tableData" :id="'ID'" :showImg="'headerImg'" />
  </div>
</template>

<script setup>

import {
  getUserList,
  register,
  deleteUser
} from '@/api/user'
import Drag from '@/components/drag/index.vue' 
import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import { setUserInfo } from '@/api/user.js'

import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'Banner',
})

const path = ref(import.meta.env.VITE_BASE_API + '/')

const indexMethod = (index) => {
  return '#'+(index+1)
}
const page = ref(1)
const total = ref(0)
const pageSize = ref(10)
const tableData = ref([])
// 分页
const handleSizeChange = (val) => {
  pageSize.value = val
  getTableData()
}

const handleCurrentChange = (val) => {
  page.value = val
  getTableData()
}

// 查询
const getTableData = async() => {
  const table = await getUserList({ page: page.value, pageSize: pageSize.value })
  if (table.code === 0) {
    tableData.value = table.data.list
    total.value = table.data.total
    page.value = table.data.page
    pageSize.value = table.data.pageSize
  }
}

// watch(() => tableData.value, () => {
//   setAuthorityIds()
// })


getTableData()

const chooseImg = ref(null)
const openHeaderChange = () => {
  chooseImg.value.open()
}

const childEvent = (val)=>{
  console.log('childEvent===',val);
}

const dragEl = ref(null)
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
    const res = await deleteUser({ id: row.ID })
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '删除成功!'
      })
      if (tableData.value.length === 1 && page.value > 1) {
        page.value--
      }
      await getTableData()
    }
  })
}

// 弹窗相关
let dataList = ref({
  userName: '',
  nickName: '',
  headerImg: ''
})

const rules = ref({
  userName: [
    { required: true, message: '请输入Banner名称', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入链接', trigger: 'blur' }
  ],
  headerImg: [
    { required: true, message: '请上传PC图', trigger: 'blur' }
  ],
})
const userForm = ref(null)
const enterAddUserDialog = async() => {
  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...dataList.value
      }
      if (dialogFlag.value === 'add') {
        const res = await register(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '创建成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
      if (dialogFlag.value === 'edit') {
        const res = await setUserInfo(req)
        if (res.code === 0) {
          ElMessage({ type: 'success', message: '编辑成功' })
          await getTableData()
          closeAddUserDialog()
        }
      }
    }
  })
}

const addUserDialog = ref(false)
const closeAddUserDialog = () => {
  userForm.value.resetFields()
  dataList.value = {}
  addUserDialog.value = false
}

const dialogFlag = ref('add')

const addUser = () => {
  dataList.value.userName = ''
  dataList.value.nickName = ''
  dataList.value.headerImg = ''
  dialogFlag.value = 'add'
  addUserDialog.value = true
}


const openEdit = (row) => {
  dialogFlag.value = 'edit'
  dataList.value = JSON.parse(JSON.stringify(row))
  addUserDialog.value = true
}

</script>

<style lang="scss">
  .header-img-box {
    @apply w-52 h-52 border border-solid border-gray-300 rounded-xl flex justify-center items-center cursor-pointer;
 }
</style>
