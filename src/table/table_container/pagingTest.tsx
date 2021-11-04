import { ref, computed, defineComponent, h } from '@vue/composition-api';
import { logFn } from '../lib/utils'
import { pagingProps } from '../lib/types'

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Paging',
  props: pagingProps,
  setup(props, { emit }) {
    let { total, pageSize } = props
    let pageIdx = ref<number>(1)
    let pageSizeVal = ref<null | String | Number>(pageSize)

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
  render () {
    const PagingNode = (
      <div class="paging-bar">
        {/* 上一页 */}
        <div class={[{'disable-btn': this.isDisablePre}, 'pre-btn']} onClick={this.go2PrePage}>上一页</div>
        {/* 上一页 */}
        
        <input
          v-model={this.pageIdx}
          class="paging-input"
          type="text"
          onKeyup={this.doSearch} />
        <div class={[{'disable-btn': this.isDisableAft}, 'aft-btn']} onClick={this.go2AftPage}>下一页</div>

        <div class="select">
          <select class="select-trigger" v-model={this.pageSizeVal} name="group" onChange={this.changePageSize}>
            <option value="5" class="select-item-5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>
      )
    return PagingNode
  }
})
