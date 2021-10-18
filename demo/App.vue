<template>
  <div class="main-container">
    <TestTable :test="test" :columns="arr" :rowsData="dataList"></TestTable>
  </div>
</template>

<script lang="ts">
import { TestTable } from "../src/table";
import { defineComponent, reactive, ref } from "@vue/composition-api";

export default defineComponent({
  name: "App",
  components: {
    TestTable,
  },
  setup() {
    const test = ref(true);
    let arr = reactive(["child", "age"]);
    let dataList = reactive([
      { child: "小明", age: 20 },
      { child: "小黄", age: 22 },
      { child: "小亮", age: 34 },
      { child: "小王", age: 55 },
      { child: "小丑", age: 88 },
      { child: "小张", age: 29 },
      { child: "大明", age: 55 },
      { child: "大黄", age: 44 },
      { child: "大亮", age: 59 },
      { child: "大王", age: 89 },
      { child: "大丑", age: 71 },
      { child: "大张", age: 26 },
      { child: "小丽", age: 2 },
      { child: "小红", age: 64 },
      { child: "小绿", age: 53 },
      { child: "小蓝", age: 60 },
      { child: "小青", age: 80 },
      { child: "小紫", age: 84 }
    ]);

    return { test, arr, dataList };
  },
});
</script>
