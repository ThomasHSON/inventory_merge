export interface Record {
  GUID: string;
  SN: string;
  TYPE: string;
  NAME: string;
}

export interface MergeSheet {
  GUID: string;
  INV_NAME: string;
  INV_SN: string;
  CT: string;
  CT_TIME: string;
  records_Ary: Record[];
}

export interface Permission {
  name: string;
  index: number;
  type: string;
  state: boolean;
}

export interface User {
  GUID: string;
  ID: string;
  Name: string;
  Employer: string;
  loginTime: string;
  verifyTime: string;
  color: string;
  level: string;
  license: string;
  Permissions: Permission[];
}

export interface LoginResponse {
  Data: User;
  Code: number;
  Result: string;
}