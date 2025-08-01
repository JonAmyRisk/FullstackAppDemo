import Box from '@mui/material/Box';
import CloseIcon from '@mui/icons-material/Close';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { PAYMENT_STATUS } from '../../utils/status';
import { type Account } from '../Accounts/AccountsList';

export interface Payment {
  id: number;
  account: Account;
  amount: number;
  createdAt: Date;
  recipientName: string;
  recipientBank: string;
  recipientBAN: string;
  status: number;
  notes?: string;
}

export interface PaymentInfoPanelProps {
  currencySymbol: string;
  selectedPayment: Payment;
  onClose: () => void;
}

export default function PaymentInfoPanel({ currencySymbol, selectedPayment, onClose }: PaymentInfoPanelProps) {
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
    {/* 1) Header */}
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Payment details from sender: {selectedPayment.account.name}</Typography>
        <IconButton size="small" onClick={onClose}>
        <CloseIcon />
        </IconButton>
    </Box>

    {/* 2) Vertical stack of fields */}
    <Stack spacing={2}>
        <TextField
        label="Amount"
        value={selectedPayment.amount.toFixed(2)}
        fullWidth
        InputProps={{
            startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
            readOnly: true,
        }}
        />

        <TextField
        label="Recipient Name"
        value={selectedPayment.recipientName}
        fullWidth
        InputProps={{ readOnly: true }}
        />

        <TextField
        label="Recipient Bank"
        value={selectedPayment.recipientBank}
        fullWidth
        InputProps={{ readOnly: true }}
        />

        <TextField
        label="Recipient BAN"
        value={selectedPayment.recipientBAN.toString()}
        fullWidth
        InputProps={{ readOnly: true }}
        />

        <TextField
        label="Status"
        value={PAYMENT_STATUS[selectedPayment.status] || 'Unknown'}
        fullWidth
        InputProps={{ readOnly: true }}
        />

        <TextField
        label="Created At"
        value={new Date(selectedPayment.createdAt).toLocaleString()}
        fullWidth
        InputProps={{ readOnly: true }}
        />

        <Box>
        <Typography variant="subtitle1" gutterBottom>
            Notes
        </Typography>
        <Box
            sx={{
            p: 1,
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
            maxHeight: 200,
            overflowY: 'auto',
            bgcolor: 'background.paper',
            }}
        >
            <Typography variant="body2">
            {selectedPayment.notes || '—'}
            </Typography>
        </Box>
        </Box>
    </Stack>
    </Box>
  );
}