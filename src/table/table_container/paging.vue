<template>
  <div class="paging-bar">
    <!-- 上一页 -->
    <div class="pre-btn" :class="{'disable-btn': isDisablePre}" @click="go2PrePage">上一页</div>
    <!-- 上一页 -->

    <input
      v-model="pageIdx"
      class="paging-input"
      type="text"
      @keyup.enter="doSearch"
    >

    <!-- 下一页 -->
    <div class="aft-btn" :class="{'disable-btn': isDisableAft}" @click="go2AftPage">下一页</div>
    <!-- 下一页 -->

    <div class="select">
      <select v-model="pageSizeVal" name="group" @change="changePageSize">
        <option value="5" selected>5</option>
        <option value="10">10</option>
        <option value="20">20</option>
        <option value="50">50</option>
      </select>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api'
import { pagingProps } from '../lib/types'
import { logFn } from '../lib/utils'
export default defineComponent ({
  name: 'Paging',
  props: pagingProps,
  emits: ['changePage', 'updatePageSize'],
  setup (props, { emit }) {
    let { total, pageSize } = props
    let pageIdx = ref(1)
    let pageSizeVal = ref(pageSize)

    const isDisablePre = computed(() => {
      return pageIdx.value === 1
    })

    const isDisableAft = computed(() => {
      return (total < pageSize) || (Math.ceil(total / pageSize) === pageIdx.value)
    })

    const go2PrePage = () => {
      logFn('log', { module: 'table-pagging前一页' })
      if (isDisablePre.value) { return }
      pageIdx.value --
      emit('changePage', pageIdx.value)
    }

    const go2AftPage = () => {
      logFn('log', { module: 'table-pagging后一页' })
      if (isDisableAft.value) { return }
      pageIdx.value ++
      emit('changePage', pageIdx.value)
    }

    const doSearch = () => {
      logFn('log', { module: 'table-pagging前往某一页', result: pageIdx.value })
      emit('changePage', pageIdx.value)
    }

    const changePageSize = () => {
      logFn('log', { module: 'table-pagging改变页面规格', result: parseInt(pageSizeVal.value)})
      pageIdx.value = 1
      emit('updatePageSize', parseInt(pageSizeVal.value));
    }

    return {
      pageIdx,
      isDisablePre,
      isDisableAft,
      pageSizeVal,
      go2AftPage,
      go2PrePage,
      doSearch,
      changePageSize,
    }
  },
})
</script>

<style scoped>
.paging-bar {
  display: flex;
  justify-content: end;
  padding: 0 15px;
}
.pre-btn,
.aft-btn {
  display: inline-block;
  width: 66px;
  white-space: nowrap;
  color: #68ace4;
  padding: 6px 5px;
  border: 1px #ccc solid;
  background: #f0f0f0;
  cursor: pointer;
}
.disable-btn {
  color: #726464;
  background: #999494;
  cursor: not-allowed;
}
.paging-input {
  width: 45px;
  border: 1px solid #ccc;
  margin: 0 5px;
  padding: 7px 0px;
  border-radius: 3px;
  padding-left: 5px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);
  -webkit-transition: border-color ease-in-out 0.15s,
    -webkit-box-shadow ease-in-out 0.15s;
  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;
}
.paging-input:focus {
  border-color: #66afe9;
  outline: 0;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
    0 0 8px rgba(102, 175, 233, 0.6);
}

.select {
  display: inline-block;
  width: 70px;
  position: relative;
  vertical-align: middle;
  padding: 0;
  overflow: hidden;
  background-color: #fff;
  color: #555;
  border: 1px solid #aaa;
  text-shadow: none;
  border-radius: 4px;
  transition: box-shadow 0.25s ease;
  z-index: 2;
}

.select:hover {
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15);
}

.select:before {
  content: "";
  position: absolute;
  width: 0;
  height: 0;
  border: 6px solid transparent;
  border-top-color: #ccc;
  top: 18px;
  right: 7px;
  cursor: pointer;
  z-index: -2;
}
.select select {
  cursor: pointer;
  padding: 10px;
  width: 100%;
  border: none;
  background: transparent;
  background-image: none;
  -webkit-appearance: none;
  -moz-appearance: none;
}

.select select:focus {
  outline: none;
}
</style>