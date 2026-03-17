import React, { memo } from 'react';
import { Download, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Record } from '../types';
import { ApiService } from '../services/api';

interface TableSectionProps {
  records: Record[];
  onRecordDelete: (recordGuid: string) => void;
  onDeleteSelected: (recordGuids: string[]) => void;
}

const TableSection: React.FC<TableSectionProps> = memo(({ records, onRecordDelete, onDeleteSelected }) => {
  const { t } = useTranslation();
  const [selectedRecords, setSelectedRecords] = React.useState<Set<string>>(new Set());

  const handleExportRecord = (e: React.MouseEvent, record: Record) => {
    e.preventDefault();
    e.stopPropagation();
    ApiService.exportRecord(record.SN, record.TYPE);
  };

  const handleDeleteRecord = async (e: React.MouseEvent, recordGuid: string) => {
    e.preventDefault();
    e.stopPropagation();
    onRecordDelete(recordGuid);
  };

  const toggleAllRecords = (checked: boolean) => {
    if (checked) {
      setSelectedRecords(new Set(records?.map(r => r.GUID)));
    } else {
      setSelectedRecords(new Set());
    }
  };

  const handleDeleteSelected = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteSelected(Array.from(selectedRecords));
    setSelectedRecords(new Set());
  };

  return (
    <div>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 w-12">
                <input
                  type="checkbox"
                  checked={selectedRecords.size === records?.length}
                  onChange={(e) => toggleAllRecords(e.target.checked)}
                  className="rounded border-gray-300"
                />
              </th>
              <th className="p-4">{t('columns.sn')}</th>
              <th className="p-4">{t('columns.name')}</th>
              <th className="p-4">{t('columns.type')}</th>
              <th className="p-4 w-24">{t('columns.export')}</th>
              <th className="p-4 w-24">{t('columns.delete')}</th>
            </tr>
          </thead>
          <tbody>
            {records?.map((record) => (
              <tr key={record.GUID} className="border-t">
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedRecords.has(record.GUID)}
                    onChange={() => {
                      const newSelection = new Set(selectedRecords);
                      if (newSelection.has(record.GUID)) {
                        newSelection.delete(record.GUID);
                      } else {
                        newSelection.add(record.GUID);
                      }
                      setSelectedRecords(newSelection);
                    }}
                    className="rounded border-gray-300"
                  />
                </td>
                <td className="p-4">{record.SN}</td>
                <td className="p-4">{record.NAME}</td>
                <td className="p-4">{record.TYPE}</td>
                <td className="p-4">
                  <button
                    onClick={(e) => handleExportRecord(e, record)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </td>
                <td className="p-4">
                  <button
                    onClick={(e) => handleDeleteRecord(e, record.GUID)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end">
        <button
          onClick={handleDeleteSelected}
          disabled={selectedRecords.size === 0}
          className={`px-4 py-2 rounded-lg flex items-center ${
            selectedRecords.size === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          <Trash2 className="w-5 h-5 mr-2" />
          {t('deleteSelected')} {selectedRecords.size > 0 && `(${selectedRecords.size})`}
        </button>
      </div>
    </div>
  );
});

TableSection.displayName = 'TableSection';

export default TableSection;