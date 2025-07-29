import  { useEffect, useState} from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography';
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

interface PaymentsReadProps {
  currencySymbol: string;
  refreshKey: number;
  renderItem?: (acc: Payment) => ReactNode;
}

export default function PaymentsRead({
  currencySymbol,
  refreshKey,
  renderItem,
}: PaymentsReadProps) {
  const [items, setItems] = useState<Payment[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/payments')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Payment[]) => {
        // Sort by id
        const sorted = data.sort(function(a,b) {return a.id - b.id});
        setItems(sorted);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load Payments');
      })
      .finally(() => setLoading(false));
  }, [refreshKey]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }
  if (!items || items.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>No Payments registered.</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={2}
      sx={{ width: '100%' }}
    >
      <List sx={{ width: '100%', maxWidth: 600 }}>
        {items.map((p) => (
          
          <li key={p.id}>
            {renderItem ? (
              renderItem(p)
            ) : (
              <ListItem
                sx={{
                  mb: 1,
                  borderRadius: 1,
                  boxShadow: 1,
                  '&:hover': { boxShadow: 4 },
                }}
              >
              <ListItemText
                primary={`${currencySymbol} ${p.amount} paid to: ${p.recipientName} : ${PAYMENT_STATUS[p.status]}`}
                secondary={`From ${p.account?.name} on ${new Date(p.createdAt).toLocaleString()}`}
              />
              </ListItem>
            )}
          </li>
        ))}
      </List>
    </Box>
  );
}
