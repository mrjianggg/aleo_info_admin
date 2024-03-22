<template>
  <div>
    <div class="aleo-table-box">
      <div class="flex items-center pb-24">
        <el-input v-model="Input" style="width: 320px" :disabled="Switch" placeholder="Please input" clearable/>
        <el-switch v-model="Switch" @change="onSwitch" class="ml-3" />
        <div class="ml-3">*仅关闭时可编辑内容</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

defineOptions({
  name: 'Info',
})

const Input = ref('')
const Switch = ref(false)
const onSwitch = ()=>{
  console.log('Switch===',Switch);
}

</script>

<style>


</style>
