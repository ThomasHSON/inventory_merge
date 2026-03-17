import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      inventoryMerge: 'Inventory Merge',
      company: 'Hongsen Technology',
      totalMergeSheets: 'Total Merge Sheets',
      createNewMergeSheet: 'Create New Merge Sheet',
      createNew: 'Create New',
      cancel: 'Cancel',
      create: 'Create',
      enterSheetName: 'Enter sheet name',
      records: 'List count',
      loading: 'Loading',
      searchPlaceholder: 'Search by NAME or INV-NUMBER...',
      tabs: {
        manage: 'Management',
        merge: 'Merge',
        review: 'Review',
        report: 'Report',
        final: 'Final',
      },
      copyright: 'Copyright ©2025 鴻森智能科技',
      logout: 'Logout',
      edit: 'Edit',
      download: 'Download',
      delete: 'Delete',
      login: 'Login',
      userId: 'ID',
      password: 'Password',
      loginError: 'Login failed. Please try again.',
      login_id: 'Enter account',
      login_password: 'Enter password',
      mergeSheetBasicInfo: 'Merge Sheet Basic Info',
      totalRecords: 'Total Records',
      deleteSelected: 'Delete Selected',
      addRecord: 'Add Record',
      columns: {
        sn: 'SN',
        name: 'NAME',
        type: 'TYPE',
        export: 'Export',
        delete: 'Delete',
        creator: 'Creator',
        createTime: 'Create Time'
      },
      recordTypes: {
        inventory: 'Inventory Record',
        consumption: 'Consumption Record',
        review: 'Review Record'
      },
      searchFields: {
        name: 'Record Name',
        number: 'Record Number'
      },
      searchButton: 'Search',
      enterRecordName: 'Enter record name',
      enterRecordNumber: 'Enter record number',
      selectAll: 'Select All',
      deselectAll: 'Deselect All',
      addSelected: 'Add Selected',
      noRecordsFound: 'No related records found',
      searchPrompt: 'Search for records to add...',
      recordNumber: 'Record Number...',
      name: 'Name',
      creator: 'Creator',
      createTime: 'Create Time'
    }
  },
  zh: {
    translation: {
      inventoryMerge: '盤點合併',
      company: '鴻森智能科技',
      totalMergeSheets: '合併單數量',
      createNewMergeSheet: '建立新合併單',
      createNew: '建立新的',
      cancel: '取消',
      create: '建立',
      enterSheetName: '輸入合併單名稱',
      records: '單據數量',
      loading: '載入中',
      searchPlaceholder: '請輸入合併單名稱或單號...',
      tabs: {
        manage: '管理',
        merge: '合併',
        review: '覆盤',
        report: '報表',
        final: '定盤'
      },
      copyright: 'Copyright ©2025 鴻森智能科技',
      logout: '登出',
      edit: '編輯',
      download: '下載',
      delete: '刪除',
      login: '登入',
      userId: '帳號',
      password: '密碼',
      loginError: '登入失敗，請重試。',
      login_id: '請輸入帳號',
      login_password: '請輸入密碼',
      mergeSheetBasicInfo: '合併單基本資訊',
      totalRecords: '單據數量',
      deleteSelected: '刪除勾選項目',
      addRecord: '新增盤點單',
      columns: {
        sn: '單號',
        name: '名稱',
        type: '類型',
        export: '匯出',
        delete: '刪除',
        creator: '建表人',
        createTime: '建表時間'
      },
      recordTypes: {
        inventory: '盤點單',
        consumption: '消耗單',
        review: '覆盤單'
      },
      searchFields: {
        name: '名稱',
        number: '單號'
      },
      searchButton: '搜尋',
      enterRecordName: '請輸入名稱...',
      enterRecordNumber: '請輸入單號...',
      selectAll: '全選',
      deselectAll: '取消全選',
      addSelected: '新增已選項目',
      noRecordsFound: '查無相關單據',
      searchPrompt: '請搜尋要新增的單據',
      recordNumber: '單號',
      name: '名稱',
      creator: '建表人',
      createTime: '建表時間'
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'zh',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;