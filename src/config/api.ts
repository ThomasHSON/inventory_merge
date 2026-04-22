export interface ApiResponse<T = any> {
  Data: T;
  Code: number;
  Method: string;
  Result: string;
  Value: string;
  ValueAry: any[];
  TimeTaken: string;
}

export const API_ENDPOINTS = {
  GET_ALL_INV: '/api/inv_combinelist/get_all_inv',
  DELETE_INV: '/api/inv_combinelist/inv_delete_by_SN',
  EXPORT_INV: '/api/inv_combinelist/get_full_inv_Excel_by_SN',
  NEW_SN: '/api/inv_combinelist/new_IC_SN',
  CREATE_UPDATE: '/api/inv_combinelist/inv_creat_update',
  EXPORT_RECORD: '/api/inv_combinelist/get_record_Excel_by_SN',
  GET_ALL_RECORDS: '/api/inv_combinelist/get_all_records',
  LOGIN: '/api/session/login',
  GET_SETTING_BY_PAGE: '/api/settingPage/get_by_page_name',
} as const;