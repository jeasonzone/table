import { defineComponent, inject } from '@vue/composition-api';
import { ColItem } from "../lib/types";

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Head',
  props: ['cols', 'sortKey'],
  emits: ['reloadTable'],
  setup(props, {emit}) {
    const { cols, sortKey } = props;
    const cb = (item?: any) => {
      emit('reloadTable', item);
    }
    const getSortBtnCls: any = inject('getSortBtnCls');
    const sortBy: any = inject('sortBy');
    return () => {
      const renderTh = cols?.map((item: ColItem) => {
        return (<th
            class="jeason-table-th"
            style={[item.width ? [{width: item.width + 'px'}] : '', {textAlign: item.align}]}
            onClick={ sortBy.bind(this, item.value, cb) }>
            { item.label }
            { item.value === sortKey.value ? <span class={[getSortBtnCls(item.value), 'arrow']}></span> : '' }
          </th>)
      });
      return (<tr>{renderTh}</tr>)
    }
  },
})
