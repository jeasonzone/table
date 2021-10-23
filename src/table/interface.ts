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