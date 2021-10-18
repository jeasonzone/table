<template>
  <div class="table-item">
    <table>
      <thead>
        <tr>
          <th v-for="(item, key) in columns" :key="key" @click="sortBy(item)">
            {{ item }}
            <span v-if="item === sortKey" class="arrow" :class="getSortBtnCls(item)"></span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, key) in filteredData" :key="key">
          <td v-for="(key, idx) in columns" :key="idx">
            {{ item[key] }}
          </td>
        </tr>
      </tbody>
    </table>
    
    <PagingBar :total="rowsData.length" :pageSize.sync="pageSize" @changePage="changePage" />
  </div>
</template>

<script>
import PagingBar from './paging.vue';

export default {
  components: {
    PagingBar
  },
  props: {
    columns: {
      type: Array,
      require: true,
      default() {
        return [];
      },
    },
    rowsData: {
      type: Array,
      require: true,
      default() {
        return [];
      },
    },
    pageSize: {
      type: Number,
      default: 10
    }
  },
  mounted() {
    this.defaultData = this.rowsData;
  },
  data() {
    let sortOrders = {};
    this.columns.filter((item) => {
      sortOrders[item] = 1;
    });
    return {
      defaultData: [],
      activePage: 1,
      sortKey: "",
      sortOrders: sortOrders
    };
  },
  computed: {
    filteredData() {
      let data = this.rowsData;
      let order = this.sortOrders[this.sortKey];
      if (this.sortKey) {
        data = this.rowsData.slice(0).sort((pre, aft) => {
          pre = pre[this.sortKey];
          aft = aft[this.sortKey];
          return (pre === aft ? 0 : pre > aft ? 1 : -1) * order;
        });
      }
      let firstItem = this.pageSize * (this.activePage - 1) + 1;
      return data.slice(firstItem - 1, firstItem + this.pageSize - 1);
    },
  },
  methods: {
    sortBy(item) {
      this.sortKey = item;
      this.sortOrders[item] = - (this.sortOrders[item]);
    },
    getSortBtnCls (item) {
      return this.sortOrders?.[item] === 1 ? 'asc' : 'dsc';
    },
    changePage (v) {
      this.activePage = v;
    }
  },
};
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
