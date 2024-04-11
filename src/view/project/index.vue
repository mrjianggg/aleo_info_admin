<template>
  <div>
    <div class="aleo-table-box">
      <div class="flex justify-between items-center">
        <div class="aleo-btn-list">
          <el-input v-model="seachVal" style="width: 240px" placeholder="Project Name" />
          <el-button type="primary" @click="seach">搜索</el-button>
        </div>
        <div class="aleo-btn-list">
          <el-button type="primary" icon="plus" @click="addInfo">添加</el-button>
          <el-button @click="addType" class="ml-2">分类管理</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        row-key="id"
      >

        <el-table-column
          align="left"
          label="Logo"
          min-width="200"
        >
          <template #default="scope">
            <CustomPic
              :width="200"
              :picType="'img'"
              :pic-src="scope.row.logo"
            />
          </template>
        </el-table-column>

        <el-table-column align="left" label="Project Name" min-width="150" prop="projectName"/>

        <el-table-column
          align="left"
          label="类型"
          width="100"
        >
          <template #default="scope">
            <el-tag type="success">{{ scope.row.dappType }}</el-tag>
          </template>
        </el-table-column>
        
        <el-table-column
          align="left"
          label="简介"
          width="180"
        >
          <template #default="scope">
            <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ scope.row.introduction }}</div>
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
            <div style="white-space: nowrap;overflow: hidden;text-overflow: ellipsis;">{{ scope.row.jumpLink }}</div>
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
      width="600"
      v-model="addInfoDialog"
      :title="dialogFlag.value === 'add' ? '添加':'编辑'"
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
                label="Project Name"
                prop="projectName"
              >
                <el-input v-model="itemInfo.projectName" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                label="简介"
                prop="introduction"
              >
                <el-input v-model="itemInfo.introduction" />
              </el-form-item>
            </el-col>

            <el-col :span="24">
              <el-form-item
                label="跳转链接"
                prop="jumpLink"
              >
                <el-input v-model="itemInfo.jumpLink" />
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
                  inline-prompt 
                  active-text="是" 
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
                  size="large"
                  inline-prompt active-text="已上架" 
                  inactive-text="已下架"
                />
              </el-form-item>
            </el-col>

            <el-col :span="12">
              <el-form-item
                label="类型"
                prop="dappType"
              >
                <el-select v-model="itemInfo.dappType" placeholder="">
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
                prop="sort"
              >
                <el-input-number
                  v-model="itemInfo.sort"
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
                <div
                  style="display:inline-block"
                  @click="openHeaderChange"
                >
                  <img
                    v-if="itemInfo.logo"
                    alt="Logo"
                    class="header-img-box"
                    :src="(itemInfo.logo && itemInfo.logo.slice(0, 4) !== 'http')?path+itemInfo.logo:itemInfo.logo"
                  >
                  <div
                    v-else
                    class="header-img-box"
                  >从媒体库选择</div>
                  <ChooseImg
                    ref="chooseImg"
                    :target="itemInfo"
                    :target-key="`logo`"
                  />
                </div>
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
        <div class="flex gap-4">
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
            + New Tag
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
import {
  getUserList,
  register,
  deleteUser
} from '@/api/user'
import CustomPic from '@/components/customPic/index.vue'
import ChooseImg from '@/components/chooseImg/index.vue'
import { setUserInfo } from '@/api/user.js'

import { ref, watch, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({
  name: 'Dapp',
})

const path = ref(import.meta.env.VITE_BASE_API + '/')

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

  tableData.value = [
    {
      id: 1,
      logo: 'https://picsum.photos/200/200?1',
      projectName: 'projectName1',
      dappType: 'Dex',
      introduction: 'A privacy-centric decentralized exchange on @AleoHQ combining RFQ and AMM.',
      status: true,
      hot: true,
      updateTime: 1710385882,
      sort: 1,
      jumpLink: 'https://fanyi.baidu.com/mtpe-individual/multimodal#/'
    },
    {
      id: 2,
      logo: 'https://picsum.photos/200/200?2',
      projectName: 'projectName2',
      dappType: 'AI',
      introduction: 'A privacy-centric decentralized exchange on @AleoHQ combining RFQ and AMM.',
      status: true,
      hot: false,
      updateTime: 1704268511,
      sort: 2,
      jumpLink: 'https://fanyi.baidu.com/mtpe-individual/multimodal#/'
    },
    {
      id: 3,
      logo: 'https://picsum.photos/200/200?3',
      projectName: 'projectName3',
      dappType: 'AI',
      introduction: 'A privacy-centric decentralized exchange on @AleoHQ combining RFQ and AMM.',
      status: false,
      hot: false,
      updateTime: 1704268511,
      sort: 3,
      jumpLink: 'https://fanyi.baidu.com/mtpe-individual/multimodal#/'
    },
    {
      id: 4,
      logo: 'https://picsum.photos/200/200?4',
      projectName: 'projectName4',
      dappType: 'Game',
      introduction: 'A privacy-centric decentralized exchange on @AleoHQ combining RFQ and AMM.',
      status: true,
      hot: false,
      updateTime: 1704268511,
      sort: 4,
      jumpLink: 'https://fanyi.baidu.com/mtpe-individual/multimodal#/'
    },
  ]

  total.value = 4;
  page.value = 1;
  pageSize.value = 10;

  // const table = await getUserList({ page: page.value, pageSize: pageSize.value })
  // if (table.code === 0) {
  //   tableData.value = table.data.list
  //   total.value = table.data.total
  //   page.value = table.data.page
  //   pageSize.value = table.data.pageSize
  // }
}

// watch(() => tableData.value, () => {
//   setAuthorityIds()
// })


getTableData()

const chooseImg = ref(null)
const openHeaderChange = () => {
  chooseImg.value.open()
}


const deleteUserFunc = async(row) => {
  ElMessageBox.confirm('此操作将删除该条数据, 是否继续?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  .then(async() => {
    const res = await deleteUser({ id: row.id })
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

const rules = ref({
  projectName: [
    { required: true, message: '请输入名称', trigger: 'blur' },
    { min: 1, message: '最低1位字符', trigger: 'blur' }
  ],
  introduction: [
    { required: true, message: '请输入简介', trigger: 'blur' }
  ],
  logo: [
    { required: true, message: '请上传Logo', trigger: 'blur' }
  ],
  dappType: [
    { required: true, message: '请选择类型', trigger: 'blur' }
  ],
  jumpLink: [
    { required: true, message: '请输入跳转链接', trigger: 'blur' }
  ],
})
const userForm = ref(null)
const enterAddUserDialog = async() => {
  userForm.value.validate(async valid => {
    if (valid) {
      const req = {
        ...itemInfo.value
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

const handleChange = ()=>{

}

const seachVal = ref('')
const seach = ()=>{

}


const typesData = ref()
const addTypes = ref([])
const addTypeDialog = ref(false)

const getTypeData = async()=>{
  typesData.value = ['Dex','Ai','Game','Wallet'];
}
getTypeData()
const closeAddTypeDialog = () => {
  addTypeDialog.value = false
}
const addType = () => {
  addTypes.value = JSON.parse(JSON.stringify(typesData.value))
  console.log('addTypes===',addTypes);
  addTypeDialog.value = true
}
const enterAddTypeDialog = async() => {
  console.log('addTypes===',addTypes);
  closeAddTypeDialog()
  // const res = await setUserInfo(req)
  // if (res.code === 0) {
  //   ElMessage({ type: 'success', message: '操作成功' })
  //   await getTypeData()
  //   closeAddTypeDialog()
  // }
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
  projectName: '',
  dappType: '',
  introduction: '',
  status: true,
  hot: false,
  updateTime: '',
  sort: null,
  jumpLink: ''
})

const addInfo = () => {
  itemInfo.value.logo = ''
  itemInfo.value.projectName = ''
  itemInfo.value.dappType = ''
  itemInfo.value.introduction = ''
  itemInfo.value.status = true
  itemInfo.value.hot = true
  itemInfo.value.sort = tableData.value.length + 1;
  itemInfo.value.jumpLink = ''
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
