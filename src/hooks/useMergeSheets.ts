import { useState, useEffect, useCallback } from 'react';
import { ApiService } from '../services/api';
import { MergeSheet } from '../types';

export function useMergeSheets() {
  const [mergeSheets, setMergeSheets] = useState<MergeSheet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMergeSheets = useCallback(async () => {
    try {
      setLoading(true);
      const sheets = await ApiService.getAllMergeSheets();
      setMergeSheets(sheets || []);
      setError(null);
      return sheets;
    } catch (err) {
      setMergeSheets([]);
      setError(err instanceof Error ? err.message : 'Failed to fetch merge sheets');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMergeSheets();
  }, [fetchMergeSheets]);

  const deleteMergeSheet = async (sn: string) => {
    try {
      await ApiService.deleteMergeSheet(sn);
      await fetchMergeSheets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete merge sheet');
    }
  };

  const createMergeSheet = async (name: string) => {
    try {
      const newSn = await ApiService.getNewSheetNumber();
      await ApiService.createUpdateMergeSheet({
        INV_NAME: name,
        INV_SN: newSn,
      });
      await fetchMergeSheets();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create merge sheet');
    }
  };

  const updateMergeSheet = async (sheet: MergeSheet): Promise<MergeSheet | null> => {
    try {
      await ApiService.createUpdateMergeSheet(sheet);
      const updatedSheets = await fetchMergeSheets();
      return updatedSheets.find(s => s.INV_SN === sheet.INV_SN) || null;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update merge sheet');
      return null;
    }
  };

  return {
    mergeSheets,
    loading,
    error,
    refreshMergeSheets: fetchMergeSheets,
    deleteMergeSheet,
    createMergeSheet,
    updateMergeSheet,
  };
}