import React, { useState } from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon   from '@mui/icons-material/Edit';
import AddIcon    from '@mui/icons-material/Add';
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import type { TransitionProps } from '@mui/material/transitions';
import AccountsRead from '../../components/AccountsRead';
import AccountsWrite from '../../components/AccountsWrite';

// Slide-in transition for the editor panel
const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(
  function Transition(props, ref) {
    const { children, ...rest } = props;
    if (!React.isValidElement(children)) {
      return null;
      }
    return (
      <Slide direction="down" ref={ref} {...rest}>
        {children}
      </Slide>
    );
  }
);

export default function Accounts() {
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;
  const [refreshKey, setRefreshKey] = useState(0);
  const [editingAccount, setEditingAccount] = useState<any>(null);
  const [writeOpen, setWriteOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const handleAccountsChanged = () => setRefreshKey((k) => k + 1);

  const handleNew = () => {
    setEditingAccount(null);
    setWriteOpen(true);
  };

  const handleEdit = (account: any) => {
    setEditingAccount(account);
    setWriteOpen(true);
  };

  const handleDelete = (id: number) => setDeleteConfirmId(id);
  const confirmDelete = async () => {
    if (deleteConfirmId == null) return;
    await fetch(`${BASE_URL}/accounts/${deleteConfirmId}`, { method: 'DELETE' });
    setDeleteConfirmId(null);
    handleAccountsChanged();
  };
  const cancelDelete = () => setDeleteConfirmId(null);

  return (
    <Box sx={{ display: 'flex', height: '100%' }}>
      {/* List column */}
      <Box sx={{ width: 1/2, p: 2, borderRight: 1, borderColor: 'divider', overflowY: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5">Accounts</Typography>
          <IconButton color="primary" onClick={handleNew}>
            <AddIcon/>
          </IconButton>
        </Box>
        <AccountsRead
          refreshKey={refreshKey}
          renderItem={(acc) => (
            <ListItem
              key={acc.id}
              secondaryAction={
                <>
                  <IconButton edge="end" onClick={() => handleEdit(acc)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDelete(acc.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={acc.name}
                secondary={[acc.address, acc.phoneNumber,
                  acc.bankAccountNumber != null && `Bank Acc: ${acc.bankAccountNumber}`]
                  .filter(Boolean)
                  .join(' • ')}
              />
            </ListItem>
          )}
        />
      </Box>
      {/* Editor panel */}
      <Dialog
        open={writeOpen}
        onClose={() => setWriteOpen(false)}
        fullWidth
        maxWidth="sm"
        slots={{
          transition: Transition
        }}
      >
        <DialogTitle>{editingAccount ? 'Edit Account' : 'New Account'}</DialogTitle>
        <DialogContent>
          <AccountsWrite
            initialData={editingAccount}
            onSuccess={() => {
              setWriteOpen(false);
              handleAccountsChanged();
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setWriteOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={deleteConfirmId != null} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this account?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button color="error" onClick={confirmDelete}>Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
