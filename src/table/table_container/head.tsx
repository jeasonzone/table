import { defineComponent, inject } from '@vue/composition-api';
import { ColItem } from "../lib/types";
import { Isort } from '../lib/symbol';

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Head',
  props: ['cols', 'sortKey'],
  emits: ['reloadTable'],
  setup(props, {emit}) {
    const cb = (item?: any) => {
      emit('reloadTable', item);
    }


    const IsortFn: any = inject(Isort);
    const sortBy: any = IsortFn.sortBy;
    const getSortBtnCls: any = IsortFn.getSortBtnCls;
    
    return () => {
      const renderTh = props.cols?.map((item: ColItem) => {
        return (<th
            class="jeason-table-th"
            style={[item.width ? [{width: item.width + 'px'}] : '', {textAlign: item.align}]}
            onClick={ sortBy.bind(this, item.value, cb) }>
            { item.label }
            { item.value === props.sortKey ? <span class={[getSortBtnCls(item.value), 'arrow']}></span> : '' }
          </th>)
      });
      return (<tr>{renderTh}</tr>)
    }
  },
})
