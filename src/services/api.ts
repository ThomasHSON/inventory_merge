import { getDomain } from '../config/config';
import { API_ENDPOINTS, ApiResponse } from '../config/api';
import { MergeSheet, Record, User, LoginResponse } from '../types';
import { Logger } from '../utils/logger';

export class ApiService {
  private static async getBaseUrl(): Promise<string> {
    return await getDomain();
  }

  private static async fetchApi<T>(
    endpoint: string,
    method: 'GET' | 'POST' = 'POST',
    body?: any
  ): Promise<ApiResponse<T>> {
    const baseUrl = await this.getBaseUrl();
    const url = `${baseUrl}${endpoint}`;

    console.log(url);
    Logger.logApiRequest(endpoint, method, body);

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : undefined,
      });

      if (!response.ok) {
        throw new Error(`API call failed with status ${response.status}: ${response.statusText || 'Unknown network error'}. Endpoint: ${endpoint}`);
      }

      const data = await response.json();
      Logger.logApiResponse(endpoint, data);

      if (data.Code !== 200 && data.Code !== undefined) {
        throw new Error(data.Result || 'API request failed');
      }

      return data;
    } catch (error) {
      Logger.logApiError(endpoint, error);
      throw error;
    }
  }

  static async login(id: string, password: string): Promise<ApiResponse<User>> {
    return this.fetchApi<User>(API_ENDPOINTS.LOGIN, 'POST', {
      Data: {
        ID: id,
        Password: password
      }
    });
  }

  static async getAllMergeSheets(): Promise<MergeSheet[]> {
    const response = await this.fetchApi<MergeSheet[]>(API_ENDPOINTS.GET_ALL_INV, 'POST', {
      Data: {}
    });
    return response.Data || [];
  }

  static async deleteMergeSheet(invSn: string): Promise<void> {
    await this.fetchApi(API_ENDPOINTS.DELETE_INV, 'POST', {
      Value: invSn,
      Data: {}
    });
  }

  static async getNewSheetNumber(): Promise<string> {
    const response = await this.fetchApi(API_ENDPOINTS.NEW_SN, 'POST', {
      Data: {}
    });
    return response.Value;
  }

  static async createUpdateMergeSheet(sheet: Partial<MergeSheet>): Promise<void> {
    const userSession = sessionStorage.getItem('user_session');
    const user = userSession ? JSON.parse(userSession) as User : null;
    
    await this.fetchApi(API_ENDPOINTS.CREATE_UPDATE, 'POST', {
      Data: {
        INV_NAME: sheet.INV_NAME,
        INV_SN: sheet.INV_SN,
        CT: user?.Name || "",
        NOTE: "",
        records_Ary: sheet.records_Ary || []
      }
    });
  }

  static async getAllRecords(): Promise<Record[]> {
    const response = await this.fetchApi<Record[]>(API_ENDPOINTS.GET_ALL_RECORDS, 'POST', {
      Data: {}
    });
    return response.Data;
  }

  static async exportMergeSheet(invSn: string): Promise<void> {
    const baseUrl = await this.getBaseUrl();
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.EXPORT_INV}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Value: invSn,
        Data: {}
      })
    });

    if (!response.ok) {
      throw new Error('Failed to download Excel file');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${invSn}.xlsx`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  static async exportRecord(sn: string, type: string): Promise<void> {
    const baseUrl = await this.getBaseUrl();
    console.log({
        Value: `${sn},${type}`,
        Data: {}
      });
    const response = await fetch(`${baseUrl}${API_ENDPOINTS.EXPORT_RECORD}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Value: `${sn},${type}`,
        Data: {}
      })
    });

    if (!response.ok) {
      throw new Error('Failed to download Excel file');
    }

    console.log(await response);

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type} - ${sn}.xls`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }
}