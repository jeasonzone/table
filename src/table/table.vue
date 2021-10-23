<template>
  <div class="table-item">
    <table>
      <thead>
        <tr>
          <th v-for="item in columns" :key="item" @click="sortBy(item)">
            {{ item }}
            <span
              v-if="item === sortKey"
              class="arrow"
              :class="getSortBtnCls(item)"
            ></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in listData" :key="idx">
          <td v-for="(key, index) in columns" :key="index">
            {{ item[key] }}
          </td>
        </tr>
      </tbody>
    </table>
    <PagingBar
      :total="rowsData.length"
      @changePage="changePage"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import PagingBar from "./paging.vue";
import {SortOrder, Paging} from './interface';

@Component({
  components: {
    PagingBar,
  },
})
export default class Table extends Vue {
  @Prop({ default: "" })
  tableId!: string;

  @Prop({ default: "normal" })
  tableSize!: string;

  @Prop({ default: "" })
  autoLoadUrl!: string;

  @Prop({ default: false })
  elipse!: boolean;

  @Prop({ default: false })
  isAllowCheck!: boolean;

  @Prop({ default: false })
  autoLoad!: boolean;

  @Prop({default: () => {
    return {
      pageSize: 10
    };
  }})
  paging!: Paging;

  @Prop({
    default: () => {
      return [];
    },
  })
  columns!: [];

  @Prop({
    default: () => {
      return [];
    },
  })
  rowsData!: [];

  listData = [];
  defaultData = [];
  activePage: number = 1;
  sortKey: string = "";
  sortOrders: SortOrder = {};
  mounted () {
    this.defaultData = this.rowsData;
    this.columns.filter((item) => {
      this.sortOrders[item] = 1;
    });
    this.loadData(this.rowsData);
  }

  // 排序功能
  sortBy(item: string) {
    this.sortKey = item;
    this.sortOrders[item] = -this.sortOrders[item];
  }

  // 表头排序按钮样式
  getSortBtnCls(item: string) {
    return this.sortOrders?.[item] === 1 ? "asc" : "dsc";
  }

  // 分页页数跳转
  changePage(v: number) {
    this.activePage = v;
  }

  // 加载表格数据
  loadData(list = []) {
    let data = list;
    let order = this.sortOrders[this.sortKey];
    if (this.sortKey) {
      data = this.rowsData.slice(0).sort((pre, aft) => {
        pre = pre[this.sortKey];
        aft = aft[this.sortKey];
        return (pre === aft ? 0 : pre > aft ? 1 : -1) * order;
      });
    }
    let firstItem = this.paging?.pageSize * (this.activePage - 1) + 1;
    this.listData = data.slice(
      firstItem - 1,
      firstItem + this.paging?.pageSize - 1
    );
  }

  // 清空表格数据
  clearData() {
    this.listData = [];
  }

  // 获取表格数据
  getData() {
    return this.listData || [];
  }

  // 获取勾选的行
  getSelection() {}
}
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
</style>
