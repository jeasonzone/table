import { defineComponent } from '@vue/composition-api'

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Body',
  props: ['cols', 'listData'],
  setup(props) {
    const { cols, listData } = props;
    return () => {
      const renderBody = listData?.value?.map(item => {
        let renderTd = cols?.map(key => {
          return (<td>
            {item[key.value]}
          </td>)
        })
        return (<tr>{renderTd}</tr>)
      })
      return (<tbody class="jeason-table-body">{renderBody}</tbody>)
    }
  },
})
