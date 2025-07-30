import { useEffect, useState } from 'react';
import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  MenuItem,
  CircularProgress,
  TextField,
  Select,
  InputAdornment,
  InputLabel,
  FormControl
} from '@mui/material';
import { BASE_URL } from '../../utils/constants'

export interface PaymentInput {
  id: number;
  accountId: number;
  accountName: string;
  amount: number;
  recipientName: string;
  recipientBank: string;
  recipientBAN: string;
  status: number;
  notes: string;
  createdAt: Date;
}

export interface PaymentFormValues {
  accountId: number;
  amount: number;
  recipientName: string;
  recipientBank: string;
  recipientBAN: string;
  status: number;
  notes: string;
}

interface Account {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  bankAccountNumber?: string | null;
}

interface PaymentsWriteProps {
  currencySymbol: string;
  paymentId?: number;
  initialData?: PaymentInput;
  onSuccess?: () => void;
  onError?: (msg: string) => void;
}

const schema = Yup.object({
  accountId: Yup.number().required('Account is required'),
  amount: Yup.number().required().positive(),
  recipientName: Yup.string().required(),
  recipientBank: Yup.string().required(),
  recipientBAN: Yup.number().required().integer(),
  status: Yup.number().oneOf([1,2,3]).required(),
  notes: Yup.string(),
});

export default function PaymentsWrite({
  currencySymbol,
  paymentId,
  initialData,
  onSuccess,
  onError,
}: PaymentsWriteProps) {
  const isEdit = Boolean(paymentId);
  
  const [accounts, setAccounts] = useState<Account[]>([]);
    useEffect(() => {
    fetch(`${BASE_URL}/accounts`)
    .then(r => r.json())
    .then(setAccounts)
    .catch(console.error);
    }, []);

     const initialValues: PaymentFormValues = initialData
    ? {
        accountId: initialData.accountId,
        amount: initialData.amount,
        recipientName: initialData.recipientName,
        recipientBank: initialData.recipientBank,
        recipientBAN: initialData.recipientBAN,
        status: initialData.status,
        notes: initialData.notes || '',
      }
    : {
        accountId: 0,
        amount: 0,
        recipientName: '',
        recipientBank: '',
        recipientBAN: '',
        status: 1,
        notes: '',
      };

  const handleSubmit = async (
    values: PaymentFormValues,
    { setSubmitting, setStatus }: FormikHelpers<PaymentFormValues>
  ) => {
    setStatus(undefined);
    const payload: Partial<PaymentInput> = {
    ...(paymentId !== undefined && { id: paymentId }),
    accountId: values.accountId,
    amount: values.amount,
    recipientName: values.recipientName,
    recipientBank: values.recipientBank,
    recipientBAN: values.recipientBAN,
    status: values.status,
    notes: values.notes,
    };
    try {
      const url = isEdit
        ? `${BASE_URL}/payments/${paymentId}`
        : `${BASE_URL}/payments`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      setStatus({ success: true });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      setStatus({ error: `Failed to ${isEdit ? 'update' : 'register'} payment` });
      const msg = isEdit ? 'Failed to update payment' : 'Failed to create payment';
      onError?.(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik<PaymentFormValues>
      initialValues={initialValues}
      validationSchema={schema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, errors, touched, getFieldProps }) => (
         <Form>
          <FormControl fullWidth margin="normal">
            <InputLabel id="account-label">Account</InputLabel>
            <Select
              labelId="account-label"
              label="Account"
              {...getFieldProps('accountId')}
              error={touched.accountId && !!errors.accountId}
            >
              {accounts.map(a =>
                <MenuItem key={a.id} value={a.id}>{a.name}</MenuItem>
              )}
            </Select>
          </FormControl>

          <TextField
            label="Amount"
            fullWidth
            margin="normal"
            type="number"
            {...getFieldProps('amount')}
            InputProps={{
              startAdornment: <InputAdornment position="start">{currencySymbol}</InputAdornment>,
            }}
            error={touched.amount && !!errors.amount}
            helperText={touched.amount && errors.amount}
          />

          <TextField
            label="Recipient Name"
            fullWidth margin="normal"
            {...getFieldProps('recipientName')}
            error={touched.recipientName && !!errors.recipientName}
            helperText={touched.recipientName && errors.recipientName}
          />
          <TextField
            label="Recipient Bank"
            fullWidth margin="normal"
            {...getFieldProps('recipientBank')}
            error={touched.recipientBank && !!errors.recipientBank}
            helperText={touched.recipientBank && errors.recipientBank}
          />
          <TextField
            label="Recipient BAN"
            fullWidth margin="normal"
            {...getFieldProps('recipientBAN')}
            error={touched.recipientBAN && !!errors.recipientBAN}
            helperText={touched.recipientBAN && errors.recipientBAN}
          />
          <FormControl fullWidth margin="normal">
            <InputLabel id="status-label">Status</InputLabel>
            <Select
              labelId="status-label"
              label="Status"
              {...getFieldProps('status')}
              error={touched.status && !!errors.status}
            >
              <MenuItem value={1}>Pending</MenuItem>
              <MenuItem value={2}>Approved</MenuItem>
              <MenuItem value={3}>Cancelled</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={4}
            margin="normal"
            {...getFieldProps('notes')}
          />

          <Box mt={2}>
            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? <CircularProgress size={20} /> : isEdit ? 'Save' : 'Add'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
