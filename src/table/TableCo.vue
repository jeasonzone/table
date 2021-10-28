<template>
  <div class="table-item">
    <table>
      <thead v-if="tableSize === 'normal'">
        <tr>
          <th
            v-for="item in columns"
            :key="item.value"
            @click="sortBy(item.value)"
          >
            {{ item.label }}
            <span
              v-if="item.value === sortKey"
              class="arrow"
              :class="getSortBtnCls(item.value)"
            ></span>
            
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in listData" :key="idx">
          <td
            v-for="(key, index) in columns"
            :key="index"
            :style="{ width: key.width + 'px' }"
            :class="{ 'table-body-elipse': key.width && elipse }"
          >
            {{ item[key.value] }}
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="isShowPaging" class="table-item-footer">
      <PagingBar
        :total="rowsData.length"
        :pageSize.sync="pageSizes"
        @changePage="changePage" />
    </div>
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  onMounted  
} from '@vue/composition-api';
import { tableProps, DataList, SortOrder } from "./types";
import PagingBar from "./paging.vue";
export default defineComponent({
  name: "Table",
  components: { PagingBar },
  props: tableProps,

  setup(props) {
    let { paging, rowsData, columns, isShowPaging } = props;
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

    return {
      pageSizes,
      activePage,
      sortKey,
      sortOrders,
      listData,
      sortBy,
      changePage,
      getSortBtnCls,
      getData,
      getSelection
    };
  },
});
</script>

<style scoped>
table {
  width: 100%;
  border-collapse: collapse;
  border-spacing: 0;
  empty-cells: show;
  border: 1px solid #e9e9e9;
}
table th {
  position: relative;
  background: #f7f7f7;
  color: #5c6b77;
  font-weight: 600;
  white-space: nowrap;
}
table td,
table th {
  padding: 8px 16px;
  border: 1px solid #e9e9e9;
  text-align: left;
}
.arrow {
  position: absolute;
  right: 5px;
  top: calc(50% - 3px);
  display: inline-block;
  vertical-align: middle;
  width: 0;
  height: 0;
  margin-left: 5px;
  opacity: 0.66;
}

.arrow.asc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 4px solid red;
}

.arrow.dsc {
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-top: 4px solid red;
}

.table-body-elipse {
  display: inline-block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-item-footer {
  display: flex;
  width: 100%;
  justify-content: flex-end;
}
</style>