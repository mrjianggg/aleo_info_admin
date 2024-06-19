<template>
  <div class="bg-white py-7 px-4 mt-6 dashboard-line-box">
    <div class="flex items-center justify-between">
      <div class="text-xl font-semibold">生态点击数据</div>
      <div class="flex items-center">
        日期选择 &nbsp;
        <el-date-picker
          @change="dateChange"
          class="mr-14"
          style="width: 200px;"
          v-model="valueDate"
          type="daterange"
          range-separator="-"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          size="small"
        />
      </div>

    </div>
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
const valueDate = ref('')

let chart = null
const echart = ref(null)

useWindowResize(() => {
  if (!chart) {
    return
  }
  chart.resize()
})
const xData = ref([])
const yData = ref([])
const startDate = ref('')
const endDate = ref('')
const dateChange = () => {
  function formatDate(dateStr) {
    const date = new Date(dateStr);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  if(valueDate.value){
    startDate.value = formatDate(valueDate.value[0])
    endDate.value = formatDate(valueDate.value[1])
  }else{
    startDate.value = ''
    endDate.value = ''
  }
  initChart()
}
const initChart = () => {

  if (chart) {
    chart = null
  }
  chart = echarts.init(echart.value)
  // 清空数组
  xData.value = [];
  yData.value = [];
  let Url = ''
  if(startDate.value && endDate.value){
    Url = `/dapptracking/count?startDate=${startDate.value}&endDate=${endDate.value}`
  }else{
    Url = '/dapptracking/all'
  }
  service({url: Url,method: 'get'}).then(async(res)=>{
    if (res.code === 0) {
      
      let result = res.result;
      if(startDate.value && endDate.value){
        // result =[
        //     {
        //         "count": 1,
        //         "item": "Puzzle"
        //     },
        // ]
        result.forEach(info => {
          xData.value.push(info.item)    
          yData.value.push(info.count) 
        });

      }else{
        // result = [
        //     {
        //         "_id": "66715197346040ee6acd30fe",
        //         "item": "FoxWallet",
        //         "timestamp": "2024-06-18T09:21:26.819Z"
        //     }
        // ]
        let countMap = {};
        result.forEach(info => {
          if (countMap[info.item]) {
            countMap[info.item]++;
          } else {
            countMap[info.item] = 1;
          }
        });
        let arr = Object.entries(countMap).map(([name, num]) => ({ name, num }));
        arr.forEach(info => {
          xData.value.push(info.name)    
          yData.value.push(info.num)    
        });
      }

      // console.log('yData==',yData.value);  // [3,6,1,1,1]
      // console.log('xData==',xData.value);  // ["FoxWallet","Leo Wallet","Puzzle","Avail","Beta Staking"]

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
      // formatter: (name) => {
      //   return name;
      // },
      // itemStyle: {color: this.legendItemColor},
      // textStyle: { color: this.legendTextColor }  // 文字样式
    },
    grid: {
      top: '12%',
      left: '2%',
      right: '4%',
      bottom: '12%',
      containLabel: true
    },
    xAxis: {
      // type: 'category',
      // boundaryGap: false,
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
      },  // X轴文字样式
      type: 'category',
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: '#D9D9D9',type: 'dashed' } },
    },
    series: [
      {
        type: 'bar',
        data: yData.value,
        itemStyle: {
          color: '#85B637'
        },
        barMaxWidth: '8px'
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
