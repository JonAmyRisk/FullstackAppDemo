import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import AccountsRead from './AccountsRead';

export interface Account {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  bankAccountNumber?: number | null;
}

export interface AccountsListProps {
  refreshKey: number;
  selectedAccountId: number | null;
  onSelect: (acc: Account) => void;
  onNew: () => void;
  onEdit: (acc: Account) => void;
}

export default function AccountsList({
  refreshKey,
  selectedAccountId,
  onSelect,
  onNew,
  onEdit,
}: AccountsListProps) {
  return (
    <Box sx={{ flex: 1, p: 2, borderRight: 1, borderColor: 'divider', overflowY: 'auto', width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', mb: 2 }}>
        <Typography variant="h5">Accounts</Typography>
        <IconButton color="primary" onClick={onNew}>
          <AddIcon />
        </IconButton>
      </Box>

      <AccountsRead
        refreshKey={refreshKey}
        renderItem={(acc) => (
          <ListItem disablePadding key={acc.id}>
            <ListItemButton
              onClick={() => onSelect(acc)}
              selected={acc.id === selectedAccountId}
              sx={{
                mb: 1,
                borderRadius: 1,
                boxShadow: acc.id === selectedAccountId ? 4 : 1,
              }}
            >
              <ListItemText
                primary={acc.name}
                secondary={[
                  acc.address,
                  acc.phoneNumber,
                  acc.bankAccountNumber != null && `Bank Acc: ${acc.bankAccountNumber}`,
                ]
                  .filter(Boolean)
                  .join(' • ')}
              />
              <IconButton edge="end" onClick={() => onEdit(acc)}>
                <EditIcon />
              </IconButton>
            </ListItemButton>
          </ListItem>
        )}
      />
    </Box>
  );
}