/* eslint-disable @typescript-eslint/no-explicit-any */

import type { PropOptions, PropType } from 'vue-types/dist/types'
type Prop<T, D = T> = PropOptions<T, D> | PropType<T>
type PublicRequiredKeys<T> = {
  [K in keyof T]: T[K] extends { required: true } ? K : never
}[keyof T]

type PublicOptionalKeys<T> = Exclude<keyof T, PublicRequiredKeys<T>>
type InferPropType<T> = T extends null
  ? any // null & true would fail to infer
  : T extends { type: null | true }
    ? any // As TS issue https://github.com/Microsoft/TypeScript/issues/14829 // somehow `ObjectConstructor` when inferred from { (): T } becomes `any` // `BooleanConstructor` when inferred from PropConstructor(with PropMethod) becomes `Boolean`
    : T extends ObjectConstructor | { type: ObjectConstructor }
      ? Record<string, any>
      : T extends BooleanConstructor | { type: BooleanConstructor }
        ? boolean
        : T extends Prop<infer V, infer D>
          ? unknown extends V
            ? D
            : V
          : T

// eslint-disable-next-line @typescript-eslint/ban-types
export type IxPublicPropTypes<O> = O extends object
  ? { [K in PublicRequiredKeys<O>]: InferPropType<O[K]> } & { [K in PublicOptionalKeys<O>]?: InferPropType<O[K]> }
  : { [K in string]: any }

// 分页参数
export interface Paging {
  pageSize: number
};

// 排序参数
export interface SortOrder {
  [key:string]: any
};

// 有无表头  normal有表头  easy没有表头
export type TableSize = "normal" | "easy";

// 表格内容数据Obj
export type ListItem = {
  [key:string]: any
}
export type DataList = ListItem[];

// 表头数据Obj
export type ColItem = {
  key: string,
  value: string,
  width: number
}
export type ColList = ColItem[];


export type LoadFunc = (list: DataList) => void;
export type GetTableFunc = () => {list: DataList};


// Props 定义在这里
export const tableProps = {
  tableId: {
    type: String,
    default: ''
  },
  tableSize: {
    type: String,
    default: 'normal'
  },
  autoLoadUrl: {
    type: String,
    default: ''
  },
  elipse: {
    type: Boolean,
    default: false
  },
  isShowPaging: {
    type: Boolean,
    default: true
  },
  isAllowCheck: {
    type: Boolean,
    default: false
  },
  autoLoad: {
    type: Boolean,
    default: false
  },
  columns: {
    type: Array,
    default: ()=>([]),
  },
  rowsData: {
    type: Array,
    default: ()=>([]),
  },
  paging: {
    type: Object,
    default: ()=>({
      pageSize: 10
    })
  }
}

export const pagingProps = {
  total: {
    type: Number,
    default: 0
  },
  pageSize: {
    type: Number,
    default: 5
  }
}

export type TablePublicProps = IxPublicPropTypes<typeof tableProps>



