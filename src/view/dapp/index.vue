<template>
  <div>
    <div class="aleo-table-box">
      <div class="flex justify-between items-center">
        <div class="aleo-btn-list">
          <el-input v-model="seachVal" style="width: 240px" placeholder="请输入Dapp名称" />
        </div>
        <div class="aleo-btn-list">
          <el-button type="primary" icon="plus" @click="addInfo">添加</el-button>
          <el-button @click="addType" class="ml-2">分类管理</el-button>
        </div>
      </div>
      <el-table
        :data="filterBy(tableData,seachVal)"
        row-key="id"
      >

        <el-table-column min-width="60" label="序号" type="index" :index="indexMethod" />

        <el-table-column
          align="left"
          label="Logo"
          min-width="200"
        >
          <template #default="scope">
            <el-image class="w-52 h-52" :src="scope.row.logo" :preview-src-list="[scope.row.logo]" hide-on-click-modal preview-teleported :fit="'scale-down'" />
          </template>
        </el-table-column>

        <el-table-column align="left" label="Dapp名称" min-width="150" prop="name"/>

        <el-table-column
          align="left"
          label="类型"
          width="100"
        >
          <template #default="scope">
            <el-tag type="success">{{ scope.row.type }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column
          align="left"
          label="简介"
          width="180"
        >
          <template #default="scope">
            <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ scope.row.profile }}</div>
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="状态"
          width="100"
        >
          <template #default="scope">
              <el-switch 
                disabled
                style="--el-switch-on-color:#67C23A; --el-switch-off-color:#dedfe0;" 
                v-model="scope.row.status" 
                active-value="true"
                inactive-value="false"
                size="large"
                inline-prompt active-text="已上架" 
                inactive-text="已下架"
              />
          </template>
        </el-table-column>

        <el-table-column
          align="left"
          label="是否热门"
          width="100"
        >
          <template #default="scope">
              <el-switch 
                disabled
                style="--el-switch-on-color:#67C23A; --el-switch-off-color:#dedfe0;" 
                v-model="scope.row.hot" 
                size="large"
                active-value="true"
                inactive-value="false"
                inline-prompt active-text="是" 
                inactive-text="否"
              />
          </template>
        </el-table-column>
        
        <el-table-column
          align="left"
          label="跳转链接"
          width="180"
        >
          <template #default="scope">
            <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ scope.row.url }}</div>
          </template>
        </el-table-column>

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
          align="right"
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
      width="600"
      v-model="addInfoDialog"
      :title="dialogFlag === 'add' ? '添加':'编辑'"
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
          <el-row>
            <el-col :span="24">
              <el-form-item
                label="Dapp名称"
                prop="name"
              >
                <el-input v-model="itemInfo.name" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                label="简介"
                prop="profile"
              >
                <el-input v-model="itemInfo.profile" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                label="跳转链接"
                prop="url"
              >
                <el-input v-model="itemInfo.url" />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="是否热门"
                prop="hot"
              >
                <el-switch 
                  style="--el-switch-on-color:#67C23A; --el-switch-off-color:#dedfe0;" 
                  v-model="itemInfo.hot" 
                  size="large"
                  active-value="true"
                  inactive-value="false"
                  inline-prompt active-text="是" 
                  inactive-text="否"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="状态"
                prop="status"
              >
                <el-switch 
                  style="--el-switch-on-color:#67C23A; --el-switch-off-color:#dedfe0;" 
                  v-model="itemInfo.status" 
                  active-value="true"
                  inactive-value="false"
                  size="large"
                  inline-prompt active-text="已上架" 
                  inactive-text="已下架"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="类型"
                prop="type"
              >
                <el-select v-model="itemInfo.type" placeholder="">
                  <el-option
                    v-for="item in typesData"
                    :key="item"
                    :label="item"
                    :value="item"
                  />
                </el-select>
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="排序"
                prop="rank"
              >
                <el-input-number
                  v-model="itemInfo.rank"
                  :min="1"
                  :max="dialogFlag === 'add' ? (tableData.length+1):tableData.length"
                  @change="handleChange"
                />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                label="Logo"
                label-width="100px"
                prop="logo"
              >
                <UploadImg @fn="(url)=>{itemInfo.logo = url}" :url="itemInfo.logo" />
              </el-form-item>
            </el-col>

          </el-row>


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


    <el-dialog
      width="500"
      v-model="addTypeDialog"
      title="分类管理"
      :show-close="false"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
    >
      <div style="height:40vh;overflow:auto;padding:0 12px;">
        <div class="flex gap-4 flex-wrap">
          <el-tag
            v-for="tag in addTypes"
            :key="tag"
            closable
            :disable-transitions="false"
            @close="handleClose(tag)"
          >
            {{ tag }}
          </el-tag>
          <el-input
            v-if="inputVisible"
            ref="InputRef"
            v-model="inputValue"
            class="w-20"
            size="small"
            @keyup.enter="handleInputConfirm"
            @blur="handleInputConfirm"
          />
          <el-button v-else class="button-new-tag" size="small" @click="showInput">
            + 添加
          </el-button>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeAddTypeDialog">取 消</el-button>
          <el-button
            type="primary"
            @click="enterAddTypeDialog"
          >确 定</el-button>
        </div>
      </template>
    </el-dialog>

  </div>
</template>

<script setup>
import { formatTime } from '@/utils/date'
import UploadImg from '@/components/upload/uploadImg.vue'
import service from '@/utils/request'

import { ref, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'Dapp',
})

const indexMethod = (index) => {
  return '#'+(index+1)
}
const tableData = ref([])
// 分页


// 查询
const getTableData = async() => {

  service({url: '/dapp/list',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      tableData.value = res.result
    }
  })
}

const filterBy = (curMiPageData,value)=>{
  if(!curMiPageData){
      curMiPageData = [];
  }
  return curMiPageData.filter(function(item){
    return item.name.match(value);
  })
}

// watch(() => tableData.value, () => {
//   setAuthorityIds()
// })


getTableData()


const deleteUserFunc = async(row) => {
  ElMessageBox.confirm('此操作将删除该条数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(async() => {
    await service({url: `/dapp/${row._id}`,method: 'delete'}).then(async(res)=>{
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
  profile: [
    { required: true, message: '请输入简介', trigger: 'blur' }
  ],
  logo: [
    { required: true, message: '请上传Logo', trigger: 'blur' }
  ],
  type: [
    { required: true, message: '请选择类型', trigger: 'blur' }
  ],
  url: [
    { required: true, message: '请输入跳转链接', trigger: 'blur' }
  ],
})
const userForm = ref(null)
const enterAddUserDialog = async() => {
  userForm.value.validate(async valid => {
    if (valid) {
      if (dialogFlag.value === 'add') {
        service({url: '/dapp/add',method: 'post',data:itemInfo.value}).then(async(res)=>{
          if (res.code === 0) {
            ElMessage({ type: 'success', message: '创建成功' })
            await getTableData()
            closeAddUserDialog()
          }
        })
      }
      if (dialogFlag.value === 'edit') {
        service({url: `/dapp/${itemInfo.value._id}`,method: 'put',data:itemInfo.value}).then(async(res)=>{
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

const handleChange = ()=>{

}

const seachVal = ref('')


const typesData = ref([])
const addTypes = ref([])
const typesId = ref('')
const addTypeDialog = ref(false)

const getTypeData = async()=>{
  // typesData.value = ['Dex','Wallet','Game','Bridge','AI','NFT'];
  service({url: '/dapptype',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      if(res.result[0] && res.result[0].types){
        typesData.value = res.result[0].types;
        typesId.value = res.result[0]._id;
      }
      
    }
  })
}
getTypeData()
const closeAddTypeDialog = () => {
  addTypeDialog.value = false
}
const addType = () => {
  addTypes.value = JSON.parse(JSON.stringify(typesData.value))
  addTypeDialog.value = true
}
const enterAddTypeDialog = async() => {
  service({url: `/dapptype/${typesId.value}`,method: 'put',data:{types: addTypes.value}}).then(async(res)=>{
    if (res.code === 0) {
      ElMessage({ type: 'success', message: '操作成功' })
      closeAddTypeDialog()
      getTypeData()
    }
  })
}

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
  logo: '',
  name: '',
  type: '',
  profile: '',
  status: 'true',
  hot: false,
  updateTime: '',
  rank: null,
  url: ''
})

const addInfo = () => {
  itemInfo.value.logo = ''
  itemInfo.value.name = ''
  itemInfo.value.type = ''
  itemInfo.value.profile = ''
  itemInfo.value.status = 'true'
  itemInfo.value.hot = true
  itemInfo.value.rank = tableData.value.length + 1;
  itemInfo.value.url = ''
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
