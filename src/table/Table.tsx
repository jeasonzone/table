import {
  defineComponent,
  set,
  ref,
  provide,
  onMounted
} from '@vue/composition-api';
import { tableProps, DataList, ColItem } from "./lib/types";
import PagingBar from "./table_container/paging.vue";
import TableHead from "./table_container/head";
import TableBody from "./table_container/body";
import {logFn} from './lib/utils';
import { useSort } from './hook/sort_hook';

export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Table',
  props: tableProps,
  setup(props) {
    let { paging, rowsData, columns, isShowPaging, tableSize } = props;
    let pageSizes = paging.pageSize;
    let activePage = ref(1);
    let listData = ref<null | DataList>([]);
    let { getSortBtnCls, sortBy, sortOrders, sortKey, defaultData } = useSort(rowsData);
    provide('getSortBtnCls', getSortBtnCls);
    provide('sortBy', sortBy);

    onMounted(() => {
      logFn('info', { module: 'table-init初始化' });
      columns.filter((item: ColItem) => {
        set(sortOrders.value, item.value, 1)
      });
      loadData(rowsData);
    });

    // 记载表格数据
    const loadData = (list: DataList) => {
      logFn('info', { module: 'table-info-load记载表格数据', target: 'list', result: list });
      let data = list;
      let order = sortOrders.value[sortKey.value];
      if (sortKey.value) {

        // 重组数据
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
      logFn('log', { module: 'table-get-info获取表格数据', target: 'listData', result: listData.value });
      return listData.value || [];
    }
    
    // 获取勾选的行
    const getSelection = () => {};

    // 改变页面规格
    const changePageSize = (v:string) => {
      logFn('log', { module: 'table-change-size改变页面规格', target: 'changePageSize', result: v });
      pageSizes = v;
      loadData(rowsData);
    }

    // 分页页数跳转
    const changePage = (v: number) => {
      logFn('log', { module: 'table-jump-page跳转页面', target: 'changePage', result: v });
      activePage.value = v;
      loadData(rowsData);
    }

    // 重新加载表格
    const reloadTable = (type?: string) => {
      logFn('log', { module: 'table-reload-重新加载表格', target: 'reloadTable'});
      if (!type) {
        sortKey.value = '';
      } else {
        sortKey.value = type;
        set(sortOrders.value, type, -sortOrders.value[type]);
      }
      loadData(type ? rowsData : defaultData.value);
    }

    return () => {
      const sortableNode = (
          <div class="jeason-table">
            <table>
            { tableSize === 'normal' ? <thead class="jeason-table-header">

                {/* 头部 */}
                <TableHead cols={columns} sortOrders={sortOrders} sortKey={sortKey} on={{['reloadTable']: reloadTable}} />
              </thead> : '' }

              {/* 内容部分 */}
              <TableBody cols={columns} listData={listData} elipse={props.elipse} />
            </table>
            {/* 尾部 */}
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