import { defineComponent } from '@vue/composition-api';
import { ListItem, ColItem } from "../lib/types";

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Body',
  props: ['cols', 'listData', 'elipse'],
  setup(props) {
    const { cols, listData, elipse } = props;
    return () => {
      const renderBody = listData?.value?.map((item: ListItem) => {
        let renderTd = cols?.map((key: ColItem) => {
          return (<td
            class={[{'table-body-elipse': key.width && elipse}, 'jeason-table-td']}
            style={[key.width ? [{width: key.width + 'px'}] : '', {textAlign: key.align}]}>
            {item[key.value]}
          </td>)
        })
        return (<tr>{renderTd}</tr>)
      })
      return (<tbody class="jeason-table-body">{renderBody}</tbody>)
    }
  },
})