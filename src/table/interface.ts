export interface Paging {
    pageSize: number
};
export interface SortOrder {
    [key:string]: any
};

export type ListItem = {
    [key:string]: any
}
export type List = ListItem[];
export type LoadFunc = (list: List) => void;