import { useState, useEffect } from 'react';
import Alert from '@mui/material/Alert'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';


export interface AccountInput {
  id?: number;
  name: string;
  address: string;
  phoneNumber: string;
  bankAccountNumber?: number;
}

interface AccountsWriteProps {
  /** If present, we’re in “edit” mode and prepopulate the form */
  initialData?: AccountInput;
  onSuccess?: () => void;
}

export default function AccountsWrite({
  initialData,
  onSuccess,
}: AccountsWriteProps) {
  // Decide if we’re editing or creating
  const isEdit = Boolean(initialData?.id);

  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

  // Initialize form from initialData or empty defaults
  const [form, setForm] = useState<AccountInput>({
    name: '',
    address: '',
    phoneNumber: '',
    bankAccountNumber: undefined,
    ...initialData,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // If initialData changes (e.g. user clicks a different item), rehydrate form
  useEffect(() => {
    setForm({
      name: '',
      address: '',
      phoneNumber: '',
      bankAccountNumber: undefined,
      ...initialData,
    });
  }, [initialData]);

  const handleChange =
    (field: keyof AccountInput) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setForm((f) => ({
        ...f,
        // parse bankAccountNumber into a number (REQUIREMENTS: Validation rules potentially?)
        [field]:
          field === 'bankAccountNumber'
            ? raw === ''
              ? undefined
              : Number(raw)
            : raw,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    // simple validation for now on what we know are required fields
    if (!form.name || !form.address || !form.phoneNumber) {
      setError('Name, address and phone are required');
      return;
    }

    setLoading(true);
    try {
      const url = isEdit
        ? `${BASE_URL}/accounts/${form.id}`
        : `${BASE_URL}/accounts`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
      setError(`Failed to ${isEdit ? 'update' : 'register'} account`);
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
        {isEdit ? 'Edit Account' : 'Register Account'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
          Account {isEdit ? 'updated' : 'registered'}!
        </Alert>
      )}

      <TextField
        label="Name"
        value={form.name}
        onChange={handleChange('name')}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Address"
        value={form.address}
        onChange={handleChange('address')}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Phone Number"
        value={form.phoneNumber}
        onChange={handleChange('phoneNumber')}
        required
        fullWidth
        sx={{ mb: 2 }}
      />
      <TextField
        label="Bank Account No."
        type="number"
        value={form.bankAccountNumber ?? ''}
        onChange={handleChange('bankAccountNumber')}
        fullWidth
        sx={{ mb: 2 }}
      />

      <Button
        type="submit"
        variant="contained"
        disabled={loading}
        fullWidth
      >
        {loading ? (
          <CircularProgress size={20} />
        ) : isEdit ? (
          'Save Changes'
        ) : (
          'Register'
        )}
      </Button>
    </Box>
  );
}
