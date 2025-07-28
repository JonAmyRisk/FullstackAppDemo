import { useState } from 'react';
import {
  Box,
  CircularProgress,
  Button,
  Alert,
  TextField,
  Typography,
} from '@mui/material';

interface UserInput {
  name?: string;
  email?: string;
}

interface UsersWriteProps{
    onSuccess?: () => void;
}

export default function UsersWrite( {onSuccess} : UsersWriteProps) {
  const [form, setForm] = useState<UserInput>({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleChange = (field: keyof UserInput) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
     setSuccess(false);
    if (!form.email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3000/registerUser', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      setSuccess(true);
      if (onSuccess) onSuccess();
      setForm({ name: '', email: '' });
    } catch (err) {
      console.error(err);
      setError('Failed to register user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{ width: '100%', maxWidth: 400, mx: 'auto', p: 2 }}
    >
      <Typography variant="h6" gutterBottom>
        Register New User
      </Typography>

      {error && <Alert severity="error" sx={{ width: '100%', mb: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
        User registered!
      </Alert>}

      <TextField
        label="Name (optional)"
        value={form.name}
        onChange={handleChange('name')}
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Email"
        value={form.email}
        onChange={handleChange('email')}
        required
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        fullWidth
      >
        {loading ? <CircularProgress size={20} /> : 'Register'}
      </Button>
    </Box>
  );
}