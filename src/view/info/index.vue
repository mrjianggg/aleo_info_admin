<template>
  <div>
    <div class="aleo-table-box">
      <div class="flex items-center pb-24">
        <el-input v-model="content" type="textarea" style="width: 520px" :disabled="open === 'true'" placeholder="Please input" clearable/>
        <el-switch
         v-model="open"
         @change="onSwitch" 
         class="ml-3" 
         active-value="true"
         inactive-value="false"
        />
        <div class="ml-3">*仅关闭时可编辑内容</div>

        <el-button type="primary" class=" ml-5" @click="ok">确定</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { ref } from 'vue'
import service from '@/utils/request'
defineOptions({
  name: 'Info',
})

const content = ref('')
const open = ref(false)
const _id = ref('')
const onSwitch = ()=>{
}


// 查询
const getTableData = async() => {
  service({url: '/notice/list',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      if(res.result && res.result[0]){
        content.value = res.result[0].content;
        open.value = res.result[0].open;
        _id.value = res.result[0]._id;
      }
    }
  })
}
getTableData()
const ok = async() => {
  service({url: `/notice/${_id.value}`,method: 'put', data: {content: content.value, open: open.value}}).then(async(res)=>{
    if (res.code === 0) {
      ElMessage({
        type: 'success',
        message: '操作成功!'
      })
    }
  })
}
</script>

<style>


</style>
