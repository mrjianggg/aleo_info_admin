<template>
  <el-dialog
    width="600"
    v-model="dialogVisible"
    title="排序"
    :show-close="true"
    :close-on-press-escape="false"
    :close-on-click-modal="false"
  >
    <div>
      <TransitionGroup name="list" tag="div" class="container">
        <div
          class="item"
          v-for="(item, i) in list"
          :key="item[props.id]"
          draggable="true"
          @dragstart="dragstart($event, i)"
          @dragenter="dragenter($event, i)"
          @dragend="dragend"
          @dragover="dragover"
        >
          <img :src="item[props.showImg]" style="height: 180px;width:auto" />
          <!-- {{ item[props.showImg] }} -->
        </div>
      </TransitionGroup>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button
          type="primary"
          @click="confirm"
        >确 定</el-button>
      </div>
    </template>
  </el-dialog>

</template>
<script setup>
import { reactive,ref } from 'vue'
const props = defineProps({
  showImg: {
    type: String,
    default: ''
  },
  id: {
    type: String,
    default: ''
  },
  data: {
    type: Array,
    default: () => []
  }
})

const dialogVisible = ref(false)
let dragIndex = 0

const dragstart = (e, index)=> {
	e.stopPropagation()
	dragIndex = index
	setTimeout(() => {
		e.target.classList.add('moveing')
	},0)
}
const dragenter = (e, index)=> {
	e.preventDefault()
	// 拖拽到原位置时不触发
	if (dragIndex !== index) {
		const source = list[dragIndex];
		list.splice(dragIndex, 1);
		list.splice(index, 0, source);

		// 更新节点位置
		dragIndex = index
	}
}
const dragover = (e)=> {
	e.preventDefault()
	e.dataTransfer.dropEffect = 'move'
}
const dragend = (e)=> {
	e.target.classList.remove('moveing')
}
const emit = defineEmits(['childEvent'])
const confirm = () =>{
  emit('childEvent', list);
}

const cancel = ()=>{
  dialogVisible.value = false
}
let list = reactive([])
const open = () =>{
  // 清空数组
  list.splice(0, list.length);
  for (let index = 0; index < props.data.length; index++) {
    const item = props.data[index];
    list[index] = item;
  }
  // list = JSON.parse(JSON.stringify(props.data));
  dialogVisible.value = true;
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.item {
	width: 100%;
	height: 180px;
	line-height: 200px;
	// background-color: #f5f6f8;
	background-color: rgb(249, 249, 249);
	text-align: center;
	margin: 10px;
	color: #fff;
	font-size: 18px;
}

.container {
  position: relative;
  padding: 0;
}

.moveing {
	opacity: 0;
}
.list-move, /* 对移动中的元素应用的过渡 */
.list-enter-active,
.list-leave-active {
    transition: all 0.2s ease;
}
</style>