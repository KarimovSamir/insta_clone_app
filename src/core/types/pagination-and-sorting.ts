import { SortDirection } from "./sort-direction";
// import {SortDirection} from 'mongodb'

export type PaginationAndSorting<S> = {
    sortBy: S;
    sortDirection: SortDirection;
    pageNumber: number;
    pageSize: number;
};
