<template>
  <div class="main-container">
    <p>一、直接传入columns和rowsData</p>
    <TestTable ref="table" :columns="arr" :rowsData="dataList" :elipse="true"></TestTable>
    <div class="container-demo-line"></div>
    <p>二、不展示表头</p>
    <TestTable :columns="arr" :rowsData="dataList" tableSize="easy" :elipse="true"></TestTable>
    <div class="container-demo-line"></div>
    <p>三、不展示分页</p>
    <TestTable :columns="arr" :rowsData="dataList" :isShowPaging="false"></TestTable>
    <div class="container-demo-line"></div>
    <button @click="wwww">www</button>
  </div>
</template>

<script lang="ts">
import { TestTable } from "../src/table";
import { defineComponent, reactive, ref, onMounted } from "@vue/composition-api";

export default defineComponent({
  name: "App",
  components: {
    TestTable,
  },
  setup() {
    const table = ref<HTMLElement | null>(null);
    
    let arr = reactive([{label: '孩子', value: "child"}, {label: '年龄', value: "age"}]);
    let dataList = reactive([
      { child: "小明", age: 3 },
      { child: "小黄", age: 1 },
      { child: "小亮", age: 2 },
      { child: "小红", age: 4 },
      { child: "小橙", age: 5 },
      { child: "小绿", age: 6 },
      { child: "小白", age: 7 },
      { child: "小青", age: 8 },
      { child: "小蓝", age: 33 },
      { child: "小紫", age: 5 },
      { child: "小丑", age: 7 },
      { child: "小九", age: 9 },
      { child: "小七", age: 7 },
      { child: "小八", age: 77 },
      { child: "小鬼", age: 3 },
      { child: "小狗", age: 22 },
    ]);
    const wwww = () => {
      console.log(table.value);
    }
    return { arr, dataList, table, wwww };
  },
});
</script>
