export type ApiResponse<T> = {
  data: T;
  meta: any;
};

export type PagingMeta = {
  totalItems: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
  hasPrevious: boolean;
  hasNext: boolean;
};
