import React, { useState } from 'react';
import { Trash2, Download, Edit2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { MergeSheet } from '../types';
import EditModal from './EditModal';
import { ApiService } from '../services/api';

interface MergeCardProps {
  sheet: MergeSheet;
  onEdit: (sheet: MergeSheet) => void;
  onDelete: (sn: string) => void;
  onSheetUpdated: () => void;
}

const MergeCard: React.FC<MergeCardProps> = ({ sheet, onEdit, onDelete, onSheetUpdated }) => {
  const { t } = useTranslation();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [localSheet, setLocalSheet] = useState<MergeSheet>(sheet);

  const handleUpdate = async (updatedSheet: MergeSheet) => {
    setLocalSheet(updatedSheet);
  };

  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await onDelete(sheet.INV_SN);
  };

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await ApiService.exportMergeSheet(sheet.INV_SN);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{localSheet.INV_NAME}</h3>
          <p className="text-base text-gray-600">{localSheet.INV_SN}</p>
          <div className="mt-2 space-y-1">
            <div className="flex gap-6">
              <p className="text-base text-gray-600">
                {t('records')}: {localSheet.records_Ary?.length || 0}
              </p>
              <p className="text-base text-gray-600">
                {t('creator')}: {localSheet.CT || '-'}
              </p>
            </div>
            <p className="text-base text-gray-600">
              {t('createTime')}: {formatDate(localSheet.CT_TIME)}
            </p>
          </div>
        </div>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 rounded-lg shadow-sm flex items-center"
          >
            <Edit2 className="h-5 w-5 mr-2" />
            <span>{t('edit')}</span>
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg shadow-sm flex items-center"
          >
            <Trash2 className="h-5 w-5 mr-2" />
            <span>{t('delete')}</span>
          </button>
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg shadow-sm flex items-center"
          >
            <Download className="h-5 w-5 mr-2" />
            <span>{t('download')}</span>
          </button>
        </div>
      </div>

      <EditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        sheet={localSheet}
        onUpdate={handleUpdate}
      />
    </>
  );
};

export default MergeCard;