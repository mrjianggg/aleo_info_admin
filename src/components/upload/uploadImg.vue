<template>
  <div class="relative">
    <el-upload accept="image/*" class="avatar-uploader" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
        <img v-if="props.url" :src="props.url" class="avatar" />
        <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
    </el-upload>
    <el-icon v-if="props.url" class="delete-icon" @click="deleteImg" ><Delete /></el-icon>
  </div>
</template>
<script setup lang="ts">
import { ref,reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Plus,Delete } from '@element-plus/icons-vue'
import type { UploadProps } from 'element-plus'
import service from '@/utils/request'
// import {  reqUpload } from '@/api/device/station/index.ts'
 
const emit = defineEmits<{
  (e: 'fn', resultUrl:''): void
}>()

const props = defineProps({
  url: {
    type: String,
    default: ''
  }
});

const deleteImg = ()=>{
  emit('fn','')
}

 
//图片上传成功的钩子
const handleAvatarSuccess: UploadProps['onSuccess'] = () => {
  //图片上传成功,清除掉对应图片校验结果
}
//上传图片组件->上传图片之前触发的钩子函数
const beforeAvatarUpload: UploadProps['beforeUpload'] = async (rawFile: any) => {
  if(rawFile.size / 1024 / 1024 > 4) {
    ElMessage.error('上传文件大小小于4M')
    return false
  }
 // 创建了一个新的 FormData 对象，用于构建表单数据,并将file添加到FormData对象中
  const formData = new FormData();
  formData.append('file', rawFile);
  await service({url: '/file/upload',method: 'post',data:formData}).then(async(res2: any)=>{
    if (res2.code === 0) {
      emit('fn',res2.result)
    }else{
      ElMessage.error(res2.message)
    }
  })
  // 取消默认的上传请求
  return false
}
</script>
 
<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
 
<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}
 
.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
 
.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
.delete-icon{
  position: absolute;
  cursor: pointer;
  bottom: 20px;
  right: 10px;
  color: red;
  font-size: 16px;
}
</style>