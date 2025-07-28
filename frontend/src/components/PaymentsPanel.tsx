import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

export interface Payment {
  id: number;
  amount: number;
  recipientName: string;
  status: number;
  notes?: string;
}

export interface PaymentsPanelProps {
  accountName: string;
  payments: Payment[];
  onClose: () => void;
}

export default function PaymentsPanel({ accountName, payments, onClose }: PaymentsPanelProps) {
  return (
    <Box
      sx={{
        flex: 1,
        transition: 'flex 0.3s ease',
        overflowY: 'auto',
        p: 2,
        bgcolor: 'background.paper',
      }}
    >
      {payments.length > 0 ? (
        <>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>  
            <Typography variant="h6" gutterBottom>
                Payments for {accountName}
            </Typography>   
            <IconButton size="small" onClick={onClose}>
                <CloseIcon />
            </IconButton>            
        </Box>  
          <List>
            {payments.map((p) => (
              <ListItem key={p.id} sx={{ mb: 1, borderRadius: 1, boxShadow: 1 }}>
                <ListItemText
                  primary={`$${p.amount.toFixed(2)} to ${p.recipientName}`}
                  secondary={`Status: ${p.status}${p.notes ? ` | ${p.notes}` : ''}`}
                />
              </ListItem>
            ))}
          </List>
        </>
      ) : (
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>        
            <Typography color="text.secondary">
                No payments found for <strong>{accountName}</strong>.
            </Typography>   
            <IconButton size="small" onClick={onClose}>
                <CloseIcon />
            </IconButton>
        </Box>       
      )}
    </Box>
  );
}