import { defineComponent } from '@vue/composition-api'
import {logFn} from './utils.ts';

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Head',
  props: ['cols', 'sortOrders', 'sortKey'],
  emits: ['reloadTable'],
  setup(props, {emit}) {
    const { cols, sortOrders, sortKey } = props;
    
    const getSortBtnCls = (item: string) => {
      return sortOrders.value[item] === 1 ? "asc" : "dsc";
    };
    // 排序功能
    const sortBy = (item: string) => {
      logFn('log', { module: 'table-head-sort排序功能', target: 'item', result: item });
      if(item === sortKey.value && sortOrders.value[item] === 1) {
        emit('reloadTable');
        return;
      }
      emit('reloadTable', item);
    }
    return () => {
      const renderTh = cols?.map((item) => {
        return (<th
            class="jeason-table-th"
            style={ item.width ? [{width: item.width + 'px'}] : '' }
            onClick={ sortBy.bind(this, item.value) }>
            { item.label }
            { item.value === sortKey.value ? <span class={[getSortBtnCls(item.value), 'arrow']}></span> : '' }
          </th>)
      });
      return (<tr>{renderTh}</tr>)
    }
  },
})
