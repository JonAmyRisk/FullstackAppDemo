import { useEffect, useState } from 'react';
import {
  Box,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

interface User {
  id: number;
  name?: string;
  email: string;
}

interface UsersReadProps {
  refreshKey: number;
}

export default function UsersRead( {refreshKey} : UsersReadProps ) {
  const [users, setUsers] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: User[]) => {
        setUsers(data);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load users');
      })
      .finally(() => {
        setLoading(false);
      });
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

  if (!users || users.length === 0) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <Typography>No users found.</Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      p={2}
      sx={{ width: '100%' }}
    >
      <Typography variant="h5" gutterBottom>
        Users
      </Typography>
      <List sx={{ width: '100%', maxWidth: 600 }}>
        {users.map((u) => (
          <ListItem
            key={u.id}
            sx={{
              mb: 1,
              borderRadius: 1,
              boxShadow: 1,
              '&:hover': { boxShadow: 4 },
            }}
          >
            <ListItemText
              primary={u.name || '— no name —'}
              secondary={u.email}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
