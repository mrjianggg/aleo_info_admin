<template>
  <div class="bg-white py-7 px-4 dashboard-line-box">
    <div class="text-xl font-semibold">网站访问数据</div>
    <div class="mt-5 flex items-center justify-between px-7">
      <div class="w-60 bg-[#F5F5F5] rounded-md flex flex-col items-center justify-center py-3">
        <div class="text-sm font-semibold">当日用户访问量</div>
        <div class="text-xl font-bold  mt-1">{{ today.lastDays }}</div>
      </div>
      <div class="w-60 bg-[#F5F5F5] rounded-md flex flex-col items-center justify-center py-3">
        <div class="text-sm font-semibold">7日用户访问量</div>
        <div class="text-xl font-bold  mt-1">{{ last7days.last7Days }}</div>
      </div>
      <div class="w-60 bg-[#F5F5F5] rounded-md flex flex-col items-center justify-center py-3">
        <div class="text-sm font-semibold">30日用户访问量</div>
        <div class="text-xl font-bold  mt-1">{{ last30days.last30Days }}</div>
      </div>
    </div>
    <div ref="echartAccess" class="dashboard-line"/>
  </div>
</template>

<script setup>

import { formatTime } from '@/utils/date'
import { ElMessage, ElMessageBox } from 'element-plus'
import * as echarts from 'echarts'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useWindowResize } from '@/hooks/use-windows-resize'
import service from '@/utils/request'

const today = ref({})
const last7days = ref({})
const last30days = ref({})

const getTableData = async() => {
  service({url: '/visit/today',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      today.value = res.result;
    }
  })

  service({url: '/visit/last7days',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      last7days.value = res.result;
    }
  })

  service({url: '/visit/last30days',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      last30days.value = res.result;
    }
  })
}

getTableData()

let chart = null
const echartAccess = ref(null)

useWindowResize(() => {
  if (!chart) {
    return
  }
  chart.resize()
})


const xData = ref([])
const yData = ref([])
const getXYData = (arr) =>{
  // 使用一个对象来记录每天的访问次数
  let visitCounts = {};
  // 遍历数组，将每个时间戳转换为日期，并统计每个日期的访问量
  arr.forEach(entry => {
      // 将时间戳转换为 Date 对象
      let date = new Date(entry.timestamp);
      // 格式化日期为 "YYYY-MM-DD" 字符串
      let dateString = date.toISOString().split('T')[0];
      // 如果该日期已在对象中，增加计数，否则初始化为 1
      if (visitCounts[dateString]) {
          visitCounts[dateString]++;
      } else {
          visitCounts[dateString] = 1;
      }
  });
  // 提取 xData 和 yData，并对日期进行排序
  let xData1 = Object.keys(visitCounts).sort((a, b) => new Date(a) - new Date(b)); // 日期数组
  let yData1 = xData1.map(date => visitCounts[date]); // 根据排序后的日期数组获取访问次数
  xData.value = xData1; // ['2024-06-15', '2024-06-16', '2024-06-17', '2024-06-18']
  yData.value = yData1; // [1, 1, 2, 1]
  console.log('xData1====',xData1);
  console.log('yData1====',yData1);
}

const initChart = () => {
  if (chart) {
    chart = null
  }
  chart = echarts.init(echartAccess.value)
  service({url: '/visit',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      if(res.result){
        getXYData(res.result);
        setOptions()
      }
    }
  })
}
const setOptions = () => {
  chart.setOption({
    // title: {
    //   text: '每日访问量趋势'
    // },
    tooltip: {
      trigger: 'axis'
    },
    dataZoom: [
      {
        type: 'slider',
        borderColor: '#D9D9D9',
        backgroundColor: '#66CE6D50',
        handleStyle: { color: '#66CE6D' },
        fillerColor: 'rgba(0, 0, 0, 0.1)'
      }
    ],
    legend: {  // 图例组件
      show: true,
      orient: 'horizontal',
      left: '3%',
      top: '12px'
    },
    grid: {
      top: '12%',
      left: '2%',
      right: '4%',
      bottom: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xData.value,
      nameLocation: 'end',
      nameTextStyle: { color: '#222' },
      splitLine: { lineStyle: { color: '#D9D9D9'} },
      axisLine: { lineStyle: { color: '#D9D9D9' } },
      axisLabel: { 
        color: '#979797',
        // formatter(value){
        //   return value.split(' ')[0]
        // }
      }  // X轴文字样式
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#D9D9D9',type: 'dashed' } },
    },
    series: [
      {
        data: yData.value,
        type: 'line',
        smooth: true
      }
    ]
  })
}

onMounted(async() => {
  await nextTick()
  initChart()
})

onUnmounted(() => {
  if (!chart) {
    return
  }
  chart.dispose()
  chart = null
})


</script>

<style lang="scss" scoped>
.dashboard-line-box {
  background-color: #fff;
  height: 500px;
  .dashboard-line {
    
    height: 380px;
    width: 100%;
  }
  .dashboard-line-title {
    font-weight: 600;
    margin-bottom: 12px;
  }
}
</style>
