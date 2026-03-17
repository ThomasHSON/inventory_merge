import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Navbar from './components/Navbar';
import Tabs from './components/Tabs';
import MergeCardSection from './components/MergeCardSection';
import CreateModal from './components/CreateModal';
import LoginFormModal from './components/LoginFormModal';
import Footer from './components/Footer';
import { useMergeSheets } from './hooks/useMergeSheets';
import { User } from './types';

function App() {
  const { t } = useTranslation();
  const { mergeSheets, loading, error, createMergeSheet, deleteMergeSheet, refreshMergeSheets } = useMergeSheets();
  const [isNewSheetModalOpen, setIsNewSheetModalOpen] = useState(false);
  const [newSheetName, setNewSheetName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem('user_session');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem('user_session');
    setUser(null);
  };

  const handleCreateSheet = async () => {
    await createMergeSheet(newSheetName);
    setIsNewSheetModalOpen(false);
    setNewSheetName('');
  };

  if (!user) {
    return <LoginFormModal onLoginSuccess={setUser} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-600">{t('loading')}...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar user={user} onLogout={handleLogout} />
      <Tabs />

      <main className="mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-10">
        <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0 mb-6">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">{t('totalMergeSheets')}: {mergeSheets.length}</p>
            <button
              onClick={() => setIsNewSheetModalOpen(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              {t('createNewMergeSheet')}
            </button>
          </div>
        </div>

        <MergeCardSection
          mergeSheets={mergeSheets}
          onEdit={(sheet) => {
            console.log('Edit sheet:', sheet);
          }}
          onDelete={deleteMergeSheet}
          onSheetUpdated={refreshMergeSheets}
          searchQuery={searchQuery}
        />
      </main>

      <CreateModal
        isOpen={isNewSheetModalOpen}
        onClose={() => setIsNewSheetModalOpen(false)}
        name={newSheetName}
        onNameChange={setNewSheetName}
        onCreate={handleCreateSheet}
      />

      <Footer />
    </div>
  );
}

export default App;