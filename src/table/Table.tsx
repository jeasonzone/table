import {
  defineComponent,
  set,
  ref,
  provide,
  onMounted, h, computed
} from '@vue/composition-api';
import { tableProps, ColItem } from "./lib/types";
import PagingBar from "./table_container/paging";
import TableHead from "./table_container/head";
import TableBody from "./table_container/body";
import {logFn} from './lib/utils';
import { useSort } from './hook/sort_hook';
import { Isort } from './lib/symbol';

const ASC_PARAM = 1,
  DSC_PARAM = -1;
export default defineComponent({
  // eslint-disable-next-line vue/require-prop-types
  name: 'Table',
  props: tableProps,
  setup(props) {
    let pageSizes = ref(props.paging.pageSize);
    let activePage = ref(1);
    let { getSortBtnCls, sortBy, sortOrders, sortKey, defaultData } = useSort(props.rowsData);
    let sortFn = {
      sortBy,
      getSortBtnCls
    };

    let listData = computed(() => {
      
      let data = props.rowsData;
      let order = sortOrders.value[sortKey.value];
      if (sortKey.value) {

        // 重组数据
        data = props.rowsData.slice(0).sort((pre, aft) => {
          pre = pre[sortKey.value];
          aft = aft[sortKey.value];
          return (pre === aft ? 0 : pre > aft ? ASC_PARAM : DSC_PARAM) * order;
        });
      }
      let firstItem = pageSizes.value * (activePage.value - 1) + 1;
      return data.slice(firstItem - 1, firstItem + pageSizes.value - 1);
    })

    provide(Isort, sortFn);

    onMounted(() => {
      logFn({ module: 'table-init初始化' }, 'info');
      props.columns.filter((item: ColItem) => {
        set(sortOrders.value, item.value, 1)
      });
    });

    // 获取表格数据
    const getData = () => {
      logFn({ module: 'table-get-info获取表格数据', target: 'listData', result: listData.value });
      return listData.value || [];
    }
    
    // 获取勾选的行
    const getSelection = () => {};

    // 改变页面规格
    const changePageSize = (v:string) => {
      logFn({ module: 'table-change-size改变页面规格', target: 'changePageSize', result: v });
      pageSizes.value = v;
    }

    // 分页页数跳转
    const changePage = (v: number) => {
      logFn({ module: 'table-jump-page跳转页面', target: 'changePage', result: v });
      activePage.value = v;
    }

    // 重新加载表格
    const reloadTable = (type?: string) => {
      logFn({ module: 'table-reload-重新加载表格', target: 'reloadTable'});
      if (!type) {
        sortKey.value = '';
      } else {
        sortKey.value = type;
        set(sortOrders.value, type, -sortOrders.value[type]);
      }
    }

    return {
      sortKey,
      sortOrders,
      reloadTable,
      pageSizes,
      changePage,
      changePageSize,
      defaultData,
      listData,
      getSelection,
      getData
    }
  },
  render () {
    const sortableNode = (
        <div class="jeason-table">
          <table>
          { this.tableSize === 'normal' ? <thead class="jeason-table-header">

              {/* 头部 */}
              <TableHead cols={this.columns} sortOrders={this.sortOrders} sortKey={this.sortKey} on={{['reloadTable']: this.reloadTable}} />
            </thead> : '' }

            {/* 内容部分 */}
            <TableBody cols={this.columns} listData={this.listData} elipse={this.elipse} />
          </table>
          {/* 尾部 */}
          { this.isShowPaging ? <div class="jeason-table-footer">
            <PagingBar
              total={this.rowsData.length}
              pageSize={this.pageSizes.value}
              on={{['changePage']: this.changePage, ['updatePageSize']: this.changePageSize}} />
            </div> : '' }
      </div>
    )
    return sortableNode 
  }
})