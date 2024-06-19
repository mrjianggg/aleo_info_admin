<template>
  <div class="bg-white py-7 px-4 mt-6 dashboard-line-box">
    <div class="text-xl font-semibold">资源位点击数据</div>
    <div
      ref="echart"
      class="dashboard-line"
    />
  </div>
</template>
<script setup>
import * as echarts from 'echarts'
import { nextTick, onMounted, onUnmounted, ref } from 'vue'
import { useWindowResize } from '@/hooks/use-windows-resize'
import service from '@/utils/request'

let chart = null
const echart = ref(null)

useWindowResize(() => {
  if (!chart) {
    return
  }
  chart.resize()
})


const xData = ref([])
const seriesData = ref([])
const getXYData = (arr) =>{
  // 第一步：提取日期并统计每个日期的计数
  let dateCounts = {};
  let itemsByDate = {};

  arr.forEach(entry => {
      // 提取日期部分
      let date = entry.timestamp.split('T')[0];

      // 初始化统计结构
      if (!dateCounts[date]) {
          dateCounts[date] = 0;
          itemsByDate[date] = {};
      }

      // 增加日期计数
      dateCounts[date] += 1;

      // 统计每个日期下的 item 计数
      if (!itemsByDate[date][entry.item]) {
          itemsByDate[date][entry.item] = 0;
      }
      itemsByDate[date][entry.item] += 1;
  });

  // 第二步：构建 xData1 和 yData1
  let xData1 = Object.keys(dateCounts).sort(); // 获取所有日期并排序
  let yDataMap = {};

  // 构建 yDataMap: 先用一个对象来收集每个 item 的数据
  xData1.forEach(date => {
      for (let item in itemsByDate[date]) {
          if (!yDataMap[item]) {
              yDataMap[item] = Array(xData1.length).fill(0);
          }
          let dateIndex = xData1.indexOf(date);
          yDataMap[item][dateIndex] = itemsByDate[date][item];
      }
  });

  // 转换 yDataMap 到期望的 yData 结构
  let yData = Object.keys(yDataMap).map(item => ({
      name: item,
      type: 'line',
      stack: 'Total',
      data: yDataMap[item]
  }));
  xData.value = xData1;
  seriesData.value = yData;
}

const initChart = () => {
  if (chart) {
    chart = null
  }
  chart = echarts.init(echart.value)
  service({url: '/bannertracking/all',method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      getXYData(res.result);
      setOptions()
    }
  })
}
const setOptions = () => {
  chart.setOption({
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
    series: seriesData.value
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
  height: 420px;
  .dashboard-line {
    
    height: 400px;
    width: 100%;
  }
  .dashboard-line-title {
    font-weight: 600;
    margin-bottom: 12px;
  }
}
</style>
