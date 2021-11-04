import { defineComponent } from '@vue/composition-api';
import { ListItem, ColItem } from "../lib/types";

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Body',
  props: ['cols', 'listData', 'elipse'],
  setup(props) {
    return () => {
      const renderBody = props.listData?.map((item: ListItem) => {
        let renderTd = props.cols?.map((key: ColItem) => {
          return (<td
            class={[{'table-body-elipse': key.width && props.elipse}, 'jeason-table-td']}
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
