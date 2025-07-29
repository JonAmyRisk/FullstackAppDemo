import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import Typography from '@mui/material/Typography';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import PaymentsRead from './PaymentsRead';
import { PAYMENT_STATUS } from '../../utils/status';

export interface Payment {
  id: number;
  accountId: number;
  account?: { name: string };
  amount: number;
  recipientName: string;
  recipientBank: string;
  recipientBAN: string;
  status: number;
  notes: string;
  createdAt: Date;
}

export interface PaymentsListProps {
  currencySymbol: string;
  refreshKey: number;
  selectedPaymentId: number | null;
  onSelect: (acc: Payment) => void;
  onNew: () => void;
  onEdit: (acc: Payment) => void;
}

export default function PaymentsList({
  currencySymbol,
  refreshKey,
  selectedPaymentId,
  onSelect,
  onNew,
  onEdit,
}: PaymentsListProps) {
  return (
    <Box sx={{ flex: 1, p: 2, borderRight: 1, borderColor: 'divider', overflowY: 'auto', width: '100%', maxWidth: 600, mx: 'auto' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'left', mb: 2 }}>
        <Typography variant="h5">Payments</Typography>
        <IconButton color="primary" onClick={onNew}>
          <AddIcon />
        </IconButton>
      </Box>

      <PaymentsRead
        currencySymbol={currencySymbol}
        refreshKey={refreshKey}
        renderItem={(p: Payment) => (
          <ListItem disablePadding key={p.id}>
            <ListItemButton
              onClick={() => onSelect(p)}
              selected={p.id === selectedPaymentId}
              sx={{
                mb: 1,
                borderRadius: 1,
                boxShadow: p.id === selectedPaymentId ? 4 : 1,
              }}
            >
              <ListItemText
                primary={`${currencySymbol} ${p.amount} paid to: ${p.recipientName} (${PAYMENT_STATUS[p.status]})`}
                secondary={`From ${p.account?.name} on ${new Date(p.createdAt).toLocaleString()}`}
              />
              <IconButton edge="end" onClick={() => onEdit(p)}>
                <EditIcon />
              </IconButton>
            </ListItemButton>
          </ListItem>
        )}
      />
    </Box>
  );
}