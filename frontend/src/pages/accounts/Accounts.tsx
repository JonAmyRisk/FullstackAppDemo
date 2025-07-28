import { useState } from 'react';
import Box from '@mui/material/Box';
import AccountsList from '../../components/AccountsList';
import PaymentsPanel from '../../components/PaymentsPanel';
import EditDialog from '../../components/Dialogs/EditDialog';

export default function Accounts() {
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [writeOpen, setWriteOpen] = useState(false);
  
  const [selectedAccount, setSelectedAccount] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  const handleAccountsChanged = () => setRefreshKey((k) => k + 1);
  const handleNew = () => { setEditingAccount(null); setWriteOpen(true); };
  const handleEdit = (account: any) => { setEditingAccount(account); setWriteOpen(true); };

  /* Deletion is a core part of CRUD but not in requirements and question on what to do with linked payments
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const handleDelete = (id: number) => setDeleteConfirmId(id);

  const confirmDelete = async () => {
    if (deleteConfirmId == null) return;
    await fetch(`${BASE_URL}/accounts/${deleteConfirmId}`, { method: 'DELETE' });
    setDeleteConfirmId(null);
    handleAccountsChanged();
    if (selectedAccount?.id === deleteConfirmId) setSelectedAccount(null);
  };
  const cancelDelete = () => setDeleteConfirmId(null);
  */
 
  const selectAccount = async (account: any) => {
    setSelectedAccount(account);
    const res = await fetch(`${BASE_URL}/accounts/${account.id}`);
    const data = await res.json();
    setPayments(data.payments || []);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      <AccountsList 
        refreshKey={refreshKey}
        selectedAccountId={selectedAccount?.id ?? null}
        onSelect={selectAccount}
        onNew={handleNew}
        onEdit={handleEdit}
      />
      {selectedAccount && <PaymentsPanel  
        accountName={selectedAccount?.name ?? ''}
        payments={payments}
        onClose={() => setSelectedAccount(null)}
      />}
      <EditDialog
        open={writeOpen}
        initialData={editingAccount}
        onClose={() => setWriteOpen(false)}
        onSuccess={() => {
          setWriteOpen(false);
          handleAccountsChanged();
        }}
      />
      {/* Deletion is a core part of CRUD but not in requirements and question on what to do with linked payments
      <DeleteDialog
        open={deleteConfirmId != null}
        title="Confirm Account Deletion"
        message={`Are you sure you want to delete account #${deleteConfirmId}?`}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />*/}
    </Box>
  );
}

