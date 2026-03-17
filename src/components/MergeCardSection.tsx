import React from 'react';
import MergeCard from './MergeCard';
import { MergeSheet } from '../types';

interface MergeCardSectionProps {
  mergeSheets: MergeSheet[];
  onEdit: (sheet: MergeSheet) => void;
  onDelete: (sn: string) => void;
  onSheetUpdated: () => void;
  searchQuery: string;
}

const MergeCardSection: React.FC<MergeCardSectionProps> = ({
  mergeSheets,
  onEdit,
  onDelete,
  onSheetUpdated,
  searchQuery,
}) => {
  const filteredSheets = React.useMemo(() => {
    if (!searchQuery.trim()) {
      return [...mergeSheets].sort((a, b) => {
        return new Date(b.CT_TIME).getTime() - new Date(a.CT_TIME).getTime();
      });
    }
    
    const query = searchQuery.toLowerCase();
    return mergeSheets
      .filter(sheet => 
        sheet.INV_NAME.toLowerCase().includes(query) ||
        sheet.INV_SN.toLowerCase().includes(query)
      )
      .sort((a, b) => {
        return new Date(b.CT_TIME).getTime() - new Date(a.CT_TIME).getTime();
      });
  }, [mergeSheets, searchQuery]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredSheets.map((sheet) => (
        <MergeCard
          key={sheet.GUID}
          sheet={sheet}
          onEdit={onEdit}
          onDelete={onDelete}
          onSheetUpdated={onSheetUpdated}
        />
      ))}
    </div>
  );
};

export default MergeCardSection;