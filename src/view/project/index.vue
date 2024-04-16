<template>
  <div>
    <div class="aleo-table-box">
      <div class="flex justify-between items-center">
        <div class="aleo-btn-list">
          <el-input v-model="seachVal" style="width: 240px" placeholder="请输入Project Name" />
        </div>
        <!-- <div class="aleo-btn-list">
          <el-button type="primary" icon="plus" @click="addInfo">添加</el-button>
        </div> -->
      </div>
      <el-table
        :data="filterBy(tableData,seachVal)"
        row-key="id"
      >

        <el-table-column min-width="60" label="#" type="index" :index="indexMethod" />

        <el-table-column align="left" label="Project Name" prop="name"/>

        <el-table-column
          align="left"
          label="Website"
        >
          <template #default="scope">
            <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ scope.row.website }}</div>
          </template>
        </el-table-column>
        
        <el-table-column
          align="left"
          label="提交时间"
        >
          <template #default="scope">
            {{ formatTime(scope.row.createTime) }}
          </template>
        </el-table-column>

        <el-table-column align="left" label="状态" prop="status"/>

        <el-table-column
          align="right"
          fixed="right"
          label="操作"
          width="200"
        >
          <template #default="scope">
            <el-button
              v-if="scope.row.status === '待审核'"
              icon="stamp"
              type="primary"
              link
              @click="openEdit(scope.row)"
            >审核</el-button>
            <el-button
              v-else
              icon=""
              type="primary"
              link
              @click="openEdit(scope.row)"
            >查看详情</el-button>
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
      width="600"
      v-model="addInfoDialog"
      :title="itemInfo.status === '待审核' ? '审核':'查看详情'"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:60vh;overflow:auto;padding:0 12px;">
        <el-form
          ref="userForm"
          :rules="rules"
          :model="itemInfo"
          label-width="120px"
        >
            <el-form-item
              label="Project Name"
              prop="name"
            >
              <el-input v-model="itemInfo.name" />
            </el-form-item>

            <el-form-item
              label="Category"
              prop="name"
            >
              <el-input v-model="itemInfo.category" />
            </el-form-item>

            <el-form-item
              label="Description"
              prop="desc"
            >
              <!-- <el-input v-model="itemInfo.desc" /> -->
              <el-input v-model="itemInfo.desc" type="textarea" />
            </el-form-item>

            <el-form-item
              label="Twitter"
              prop="twitter"
            >
              <el-input v-model="itemInfo.twitter" />
            </el-form-item>

            <el-form-item
              label="Website"
              prop="website"
            >
              <el-input v-model="itemInfo.website" />
            </el-form-item>

            <el-form-item
              label="Email"
              prop="email"
            >
              <el-input v-model="itemInfo.email" />
            </el-form-item>

            <el-form-item
              label="Telegram"
            >
              <el-input v-model="itemInfo.telegram" />
            </el-form-item>

            <el-form-item
              label="Discord"
            >
              <el-input v-model="itemInfo.discord" />
            </el-form-item>

            <el-form-item
              label="Github"
            >
              <el-input v-model="itemInfo.github" />
            </el-form-item>

            <el-form-item
              label="Whitepaper"
            >
              <el-input v-model="itemInfo.whitepaper" />
            </el-form-item>

            <el-form-item
              label="More"
            >
              <el-input v-model="itemInfo.more" />
            </el-form-item>

        </el-form>

      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" v-if="dialogFlag === 'add'" plain @click="enterAddUserDialog">确 定</el-button>
          <el-button type="primary" v-if="itemInfo.status === '待审核'" plain @click="enterAddUserDialog('通过')">通 过</el-button>
          <el-button type="danger" v-if="itemInfo.status === '待审核'" plain @click="enterAddUserDialog('拒绝')">拒 绝</el-button>
          <el-button @click="closeAddUserDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>


  </div>
</template>

<script setup>
import { formatTime } from '@/utils/date'
import service from '@/utils/request'

import { ref, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'Project',
})

const indexMethod = (index) => {
  return (index+1)
}
const tableData = ref([])
// 分页


// 查询
const getTableData = async() => {
  service({url: '/project/list',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      tableData.value = res.result
    }
  })
}

// watch(() => tableData.value, () => {
//   setAuthorityIds()
// })


getTableData()

const filterBy = (curMiPageData,value)=>{
  if(!curMiPageData){
      curMiPageData = [];
  }
  return curMiPageData.filter(function(item){
    return item.name.match(value);
  })
}

const deleteUserFunc = async(row) => {
  ElMessageBox.confirm('此操作将删除该条数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(async() => {
    await service({url: `/project/${row._id}`,method: 'delete'}).then(async(res)=>{
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

const rules = ref({
  name: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请输入Category', trigger: 'blur' }
  ],
  desc: [
    { required: true, message: '请输入Description', trigger: 'blur' }
  ],
  twitter: [
    { required: true, message: '请输入Twitter', trigger: 'blur' }
  ],
  website: [
    { required: true, message: '请输入Website', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入Email', trigger: 'blur' }
  ],
})
const userForm = ref(null)
const enterAddUserDialog = async(status) => {
  userForm.value.validate(async valid => {
    if (valid) {
      if (dialogFlag.value === 'add') {
        itemInfo.value.status = '待审核';
        service({url: '/project/add',method: 'post',data:itemInfo.value}).then(async(res)=>{
          if (res.code === 0) {
            ElMessage({ type: 'success', message: '创建成功' })
            await getTableData()
            closeAddUserDialog()
          }
        })
      }
      if (dialogFlag.value === 'edit') {
        let info = {
          ...itemInfo.value,
          status
        }
        service({url: `/project/${itemInfo.value._id}`,method: 'put',data:info}).then(async(res)=>{
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

const seachVal = ref('')
const seach = ()=>{

}


const typesData = ref()
const addTypes = ref([])


const inputValue = ref('')
const inputVisible = ref(false)
  const InputRef = ref(null)
const handleClose = (tag) => {
  addTypes.value.splice(addTypes.value.indexOf(tag), 1)
}
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    InputRef.value.input.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value) {
    addTypes.value.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}


const addInfoDialog = ref(false)
const closeAddUserDialog = () => {
  userForm.value.resetFields()
  itemInfo.value = {}
  addInfoDialog.value = false
}

const dialogFlag = ref('add')

// 弹窗相关
let itemInfo = ref({
  name: '',
  category: '',
  desc: '',
  twitter: '',
  website: '',
  email: '',
  telegram: '',
  discord: '',
  github: '',
  whitepaper: '',
  more: '',
})

const addInfo = () => {
  itemInfo.value.name = ''
  itemInfo.value.category = ''
  itemInfo.value.desc = ''
  itemInfo.value.twitter = ''
  itemInfo.value.website = ''
  itemInfo.value.email = ''
  itemInfo.value.telegram = ''
  itemInfo.value.discord = ''
  itemInfo.value.github = ''
  itemInfo.value.whitepaper = ''
  itemInfo.value.more = ''

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
