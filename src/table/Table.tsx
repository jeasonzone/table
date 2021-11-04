import {
  defineComponent,
  set,
  ref,
  provide,
  onMounted, h
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
    let pageSizes = props.paging.pageSize;
    let activePage = ref(1);
    let { getSortBtnCls, sortBy, sortOrders, sortKey, defaultData, listData } = useSort(props.rowsData);
    provide('getSortBtnCls', getSortBtnCls);
    provide('sortBy', sortBy);

    onMounted(() => {
      logFn('info', { module: 'table-init初始化' });
      props.columns.filter((item: ColItem) => {
        set(sortOrders.value, item.value, 1)
      });
      loadData(props.rowsData);
    });

    // 记载表格数据
    const loadData = (list: DataList) => {
      logFn('info', { module: 'table-info-load记载表格数据', target: 'list', result: list });
      let data = list;
      let order = sortOrders.value[sortKey.value];
      if (sortKey.value) {

        // 重组数据
        data = props.rowsData.slice(0).sort((pre, aft) => {
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
      loadData(props.rowsData);
    }

    // 分页页数跳转
    const changePage = (v: number) => {
      logFn('log', { module: 'table-jump-page跳转页面', target: 'changePage', result: v });
      activePage.value = v;
      loadData(props.rowsData);
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
      loadData(type ? props.rowsData : defaultData.value);
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
              pageSize={this.pageSizes}
              on={{['changePage']: this.changePage, ['updatePageSize']: this.changePageSize}} />
            </div> : '' }
      </div>
    )
    return sortableNode 
  }
})