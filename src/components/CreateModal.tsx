import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  name: string;
  onNameChange: (value: string) => void;
  onCreate: () => void;
}

const CreateModal: React.FC<CreateModalProps> = ({
  isOpen,
  onClose,
  name,
  onNameChange,
  onCreate,
}) => {
  const { t } = useTranslation();

  React.useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t('createNewMergeSheet')}</h2>
          <button onClick={onClose}>
            <X className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          placeholder={t('enterSheetName')}
          className="w-full px-4 py-2 border rounded-lg mb-4"
        />
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            {t('cancel')}
          </button>
          <button
            onClick={onCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {t('create')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateModal;