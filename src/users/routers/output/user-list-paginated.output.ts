import { UserDataOutput } from "./user-data.output";

export type UserListPaginatedOutput = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: UserDataOutput[];
};