import  { useEffect, useState} from 'react';
import type { ReactNode } from 'react';
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography';

interface Account {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  bankAccountNumber?: number | null;
}

interface AccountsReadProps {
  refreshKey: number;
  renderItem?: (acc: Account) => ReactNode;
}

export default function AccountsRead({
  refreshKey,
  renderItem,
}: AccountsReadProps) {
  const [items, setItems] = useState<Account[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:3000/accounts')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: Account[]) => {
        // Sort alphabetically by name
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        setItems(sorted);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load accounts');
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
        <Typography>No accounts registered.</Typography>
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
        {items.map((acc) => (
          
          <li key={acc.id}>
            {renderItem ? (
              renderItem(acc)
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
                  primary={acc.name}
                  secondary={[
                    acc.address,
                    acc.phoneNumber,
                    acc.bankAccountNumber != null && `Bank Acc: ${acc.bankAccountNumber}`,
                  ]
                    .filter(Boolean)
                    .join(' • ')}
                />
              </ListItem>
            )}
          </li>
        ))}
      </List>
    </Box>
  );
}
