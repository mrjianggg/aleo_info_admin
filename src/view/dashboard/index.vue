<template>
  <div class="page">
    <div class="aleo-card-box">
      <div class="aleo-card gva-top-card">
        <div class="gva-top-card-left">
          <div class="gva-top-card-left-title">你好，管理员，请开始一天的工作吧</div>
          <div class="gva-top-card-left-dot">{{ weatherInfo }}</div>
        </div>
        <img
          src="@/assets/dashboard.png"
          class="gva-top-card-right"
          alt
        >
      </div>
    </div>
    <div class="aleo-card-box">
      <div class="aleo-card quick-entrance">
        <div class="aleo-card-title">快捷入口</div>
        <el-row :gutter="20">
          <el-col
            v-for="(card, key) in toolCards"
            :key="key"
            :span="4"
            :xs="8"
            class="quick-entrance-items"
            @click="toTarget(card.name)"
          >
            <div class="quick-entrance-item">
              <div
                class="quick-entrance-item-icon"
                :style="{ backgroundColor: card.bg }"
              >
                <el-icon>
                  <component
                    :is="card.icon"
                    :style="{ color: card.color }"
                  />
                </el-icon>
              </div>
              <p>{{ card.label }}</p>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useWeatherInfo } from '@/view/dashboard/weather.js'

defineOptions({
  name: 'Dashboard'
})

const weatherInfo = useWeatherInfo()

const toolCards = ref([
  {
    label: 'Banner管理',
    icon: 'HelpFilled',
    name: 'banner',
    color: '#ff9c6e',
    bg: 'rgba(255, 156, 110,.3)'
  },
  {
    label: 'Dapp管理',
    icon: 'StarFilled',
    name: 'dapp',
    color: '#69c0ff',
    bg: 'rgba(105, 192, 255,.3)'
  },
  {
    label: '通知管理',
    icon: 'BellFilled',
    name: 'info',
    color: '#b37feb',
    bg: 'rgba(179, 127, 235,.3)'
  },
  {
    label: 'Project审核',
    icon: 'Stamp',
    name: 'project',
    color: '#ffd666',
    bg: 'rgba(255, 214, 102,.3)'
  }
])

const router = useRouter()

const toTarget = (name) => {
  router.push({ name })
}

</script>

<style lang="scss" scoped>
.page {
    @apply p-0;
    .aleo-card-box{
      @apply p-4;
      &+.aleo-card-box{
        @apply pt-0;
      }
    }
    .aleo-card {
      @apply box-border bg-white rounded h-auto px-6 py-8 overflow-hidden shadow-sm;
      .aleo-card-title{
        @apply pb-5 border-t-0 border-l-0 border-r-0 border-b border-solid border-gray-100;
      }
    }
    .gva-top-card {
        @apply h-72 flex items-center justify-between text-gray-500;
        &-left {
          @apply h-full flex flex-col w-auto;
            &-title {
              @apply text-3xl text-gray-600;
            }
            &-dot {
              @apply mt-4 text-gray-600 text-lg;
            }
            &-item{
              +.gva-top-card-left-item{
                margin-top: 24px;
              }
              margin-top: 14px;
            }
        }
        &-right {
            height: 600px;
            width: 600px;
            margin-top: 28px;
        }
    }
     ::v-deep(.el-card__header){
          @apply p-0  border-gray-200;
        }
        .card-header{
          @apply pb-5 border-b border-solid border-gray-200 border-t-0 border-l-0 border-r-0;
        }
    .quick-entrance-items {
      @apply flex items-center justify-center text-center text-gray-800;
        .quick-entrance-item {
          @apply px-8 py-6 flex items-center flex-col transition-all duration-100 ease-in-out rounded-lg cursor-pointer;
          &:hover{
            @apply shadow-lg;
          }
            &-icon {
              @apply flex items-center h-16 w-16 rounded-lg justify-center mx-0 my-auto text-2xl;
            }
            p {
                @apply mt-2.5;
            }
        }
    }
}
.dashboard-icon {
  @apply flex items-center text-xl mr-2 text-blue-400;
}

</style>
