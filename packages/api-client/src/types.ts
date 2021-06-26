export interface ApiResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
  request?: any;
}
