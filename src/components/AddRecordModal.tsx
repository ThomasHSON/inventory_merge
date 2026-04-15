import React, { useState, useEffect } from 'react';
import { X, Search as SearchIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MergeSheet, Record } from '../types';
import { ApiService } from '../services/api';

interface AddRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheet: MergeSheet;
  onUpdate: (updatedSheet: MergeSheet) => Promise<void>;
}

const AddRecordModal: React.FC<AddRecordModalProps> = ({
  isOpen,
  onClose,
  sheet,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const [searchField, setSearchField] = useState<'NAME' | 'SN'>('NAME');
  const [searchQuery, setSearchQuery] = useState('');
  const [allRecords, setAllRecords] = useState<Record[]>([]);
  const [selectedRecords, setSelectedRecords] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setSearchField('NAME');
    setSearchQuery('');
    setAllRecords([]);
    setSelectedRecords(new Set());
  };

  useEffect(() => {
    if (isOpen) {
      resetForm();
      const fetchRecords = async () => {
        try {
          setLoading(true);
          const records = await ApiService.getAllRecords();
          const existingSNs = new Set(sheet.records_Ary.map(r => r.SN));
          setAllRecords(records.filter(record => !existingSNs.has(record.SN)));
        } catch (error) {
          console.error('Failed to fetch records:', error);
          setAllRecords([]);
        } finally {
          setLoading(false);
        }
      };
      fetchRecords();
    }
  }, [isOpen]);

  const searchResults = allRecords.filter(record => {
    if (!searchQuery.trim()) return true;
    const searchValue = searchField === 'NAME' ? record.NAME : record.SN;
    return searchValue.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const toggleAllRecords = () => {
    if (selectedRecords.size === searchResults.length) {
      setSelectedRecords(new Set());
    } else {
      setSelectedRecords(new Set(searchResults.map(r => r.GUID)));
    }
  };

  const handleAddRecords = async () => {
    const selectedRecordsArray = searchResults.filter(record => 
      selectedRecords.has(record.GUID)
    );

    const updatedSheet = {
      ...sheet,
      records_Ary: [...sheet.records_Ary, ...selectedRecordsArray]
    };

    try {
      await ApiService.createUpdateMergeSheet(updatedSheet);
      await onUpdate(updatedSheet);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Failed to add records:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold">{t('addRecord')}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 flex-1 flex flex-col overflow-hidden">
          <div className="flex space-x-4 mb-6">
            <select
              value={searchField}
              onChange={(e) => setSearchField(e.target.value as 'NAME' | 'SN')}
              className="px-4 py-2 border rounded-lg"
            >
              <option value="NAME">{t('searchFields.name')}</option>
              <option value="SN">{t('searchFields.number')}</option>
            </select>
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchField === 'NAME' ? t('enterRecordName') : t('enterRecordNumber')}
                className="w-full px-4 py-2 pl-10 pr-10 border rounded-lg"
              />
              <SearchIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-end items-center mb-4">
              <button
                onClick={handleAddRecords}
                disabled={selectedRecords.size === 0}
                className={`px-6 py-2 rounded-lg ${
                  selectedRecords.size === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {t('addSelected')} ({selectedRecords.size})
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="text-center py-8">{t('loading')}</div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {t('noRecordsFound')}
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 w-12">
                        <input
                          type="checkbox"
                          checked={selectedRecords.size === searchResults.length}
                          onChange={(e) => toggleAllRecords()}
                          className="rounded border-gray-300"
                        />
                      </th>
                      <th className="p-4 text-left">{t('recordNumber')}</th>
                      <th className="p-4 text-left">{t('name')}</th>
                      <th className="p-4 text-left">{t('columns.type')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {searchResults.map((record) => (
                      <tr key={record.GUID} className="border-t">
                        <td className="px-3 py-2">
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecordModal;