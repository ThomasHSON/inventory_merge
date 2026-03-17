import React, { useState, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MergeSheet } from '../types';
import { ApiService } from '../services/api';
import TableSection from './TableSection';
import AddRecordModal from './AddRecordModal';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  sheet: MergeSheet;
  onUpdate: (updatedSheet: MergeSheet) => Promise<void>;
}

const EditModal: React.FC<EditModalProps> = ({
  isOpen,
  onClose,
  sheet,
  onUpdate,
}) => {
  const { t } = useTranslation();
  const [records, setRecords] = useState(sheet.records_Ary);
  const [isAddRecordModalOpen, setIsAddRecordModalOpen] = useState(false);

  useEffect(() => {
    setRecords(sheet.records_Ary);
  }, [sheet.records_Ary]);

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  const handleRecordDelete = async (recordGuid: string) => {
    const updatedRecords = records.filter(record => record.GUID !== recordGuid);
    
    const updatedSheet = {
      ...sheet,
      records_Ary: updatedRecords
    };

    try {
      await ApiService.createUpdateMergeSheet(updatedSheet);
      setRecords(updatedRecords);
      await onUpdate(updatedSheet);
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  const handleDeleteSelected = async (recordGuids: string[]) => {
    const updatedRecords = records.filter(record => !recordGuids.includes(record.GUID));
    
    const updatedSheet = {
      ...sheet,
      records_Ary: updatedRecords
    };

    try {
      await ApiService.createUpdateMergeSheet(updatedSheet);
      setRecords(updatedRecords);
      await onUpdate(updatedSheet);
    } catch (error) {
      console.error('Failed to delete selected records:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={(e) => e.stopPropagation()}>
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">{sheet.INV_NAME}</h2>
              <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="text-gray-600">
                {t('totalRecords')}: {records?.length || 0}
              </div>
              <button
                onClick={() => setIsAddRecordModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
              >
                <Plus className="w-5 h-5 mr-2" />
                {t('addRecord')}
              </button>
            </div>

            <TableSection 
              records={records}
              onRecordDelete={handleRecordDelete}
              onDeleteSelected={handleDeleteSelected}
            />
          </div>
        </div>
      </div>

      <AddRecordModal
        isOpen={isAddRecordModalOpen}
        onClose={() => setIsAddRecordModalOpen(false)}
        sheet={sheet}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default EditModal;