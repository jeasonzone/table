import Vue from 'vue';
import VueCompositionApi from '@vue/composition-api';
import {ref} from '@vue/composition-api';
import { SortOrder, SortByFunc, DataList } from "../lib/types";
import {logFn} from '../lib/utils';
Vue.use(VueCompositionApi)
export const useSort = (rowsData: DataList) => {
    let sortOrders: SortOrder = ref({});
    let sortKey = ref("");
    let defaultData =ref(rowsData);

    const getSortBtnCls = (item: string) => {
        return sortOrders.value[item] === 1 ? "asc" : "dsc";
    };

    // 排序功能
    const sortBy: SortByFunc = (item: string, cb: any) => {
        logFn('log', { module: 'table-head-sort排序功能', target: 'item', result: item });
        if(item === sortKey.value && sortOrders.value[item] === 1) {
            cb(null);
          return;
        }
        cb(item)
      }
    return {
        getSortBtnCls,
        sortBy,
        sortOrders,
        sortKey,
        defaultData
    }
}
