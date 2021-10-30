import {
  defineComponent,
  reactive,
  ref,
  onMounted  
} from '@vue/composition-api';
import { tableProps, DataList, SortOrder } from "./types";
import PagingBar from "./paging.vue";

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Table',
  props: tableProps,
  setup(props) {
    let { paging, rowsData, columns, isShowPaging, tableSize } = props;
    let pageSizes = paging.pageSize;
    let activePage = ref(1);
    let sortKey = ref("");
    let listData: DataList = ref([]);
    let defaultData: DataList =ref([]);
    let sortOrders: SortOrder = reactive({});

    onMounted(() => {
      defaultData = rowsData;
      columns.filter((item) => {
        sortOrders[item.value] = 1;
      });
      loadData(rowsData);
    });

    const getSortBtnCls = (item: string) => {
      return sortOrders[item] === 1 ? "asc" : "dsc";
    };

    // 排序功能
    const sortBy = (item: string) => {
      if(item === sortKey.value && sortOrders[item] === 1) {
        sortKey.value = '';
        loadData(defaultData);
        return;
      }
      sortKey.value = item;
      sortOrders[item] = -sortOrders[item];
      loadData(rowsData);
    }

    // 分页页数跳转
    const changePage = (v: number) => {
      activePage.value = v;
      loadData(rowsData);
    }

    const loadData = (list: DataList) => {
      let data = list;
      let order = sortOrders[sortKey.value];
      if (sortKey.value) {
        data = rowsData.slice(0).sort((pre, aft) => {
          pre = pre[sortKey.value];
          aft = aft[sortKey.value];
          return (pre === aft ? 0 : pre > aft ? 1 : -1) * order;
        });
      }
      let firstItem = pageSizes * (activePage.value - 1) + 1;
      listData.value = data.slice(firstItem - 1, firstItem + pageSizes - 1);
    };

    // 获取表格数据
    const getData = () => {
      return listData.value || [];
    }
    
    // 获取勾选的行
    const getSelection = () => {}


    const changePageSize = (v) => {
      pageSizes = v;
      loadData(rowsData);
    }

    return () => {
      const renderTh = columns?.map((item) => {
        return (<th
            class="jeason-table-th"
            onClick={ sortBy.bind(this, item.value) }>
            { item.label }
            { item.value === sortKey.value ? <span class={[getSortBtnCls(item.value), 'arrow']}></span> : '' }
          </th>)
      });
      const renderBody = listData?.value?.map(item => {
        let renderTd = columns?.map(key => {
          return (<td>
            {item[key.value]}
          </td>)
        })
        return (<tr>{renderTd}</tr>)
      })
      const sortableNode = (
          <div class="jeason-table">
            <table>
            { tableSize === 'normal' ? <thead class="jeason-table-header">
                <tr>
                  {renderTh}
                </tr>
              </thead> : '' }
              <tbody class="jeason-table-body">
                {renderBody}
              </tbody>
            </table>
            
            { isShowPaging ? <div class="jeason-table-footer">
              <PagingBar
                total={rowsData.length}
                pageSize={pageSizes}
                on={{['changePage']: changePage, ['updatePageSize']: changePageSize}} />
              </div> : '' }
        </div>
      )
      return sortableNode
    }
  }
})