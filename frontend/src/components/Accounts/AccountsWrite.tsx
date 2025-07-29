import { Formik, Form, type FormikHelpers } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Button,
  Alert,
  CircularProgress,
  TextField,
  Typography,
} from '@mui/material';
import { BASE_URL } from '../../utils/constants';

export interface AccountInput {
  name: string;
  address: string;
  phoneNumber: string;
  bankAccountNumber: string | undefined;
}

interface AccountsWriteProps {
  accountId?: number;
  initialData?: AccountInput;
  onSuccess?: () => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  address: Yup.string().required('Address is required'),
  phoneNumber: Yup.string()
    .required('Phone number is required')
    .matches(/^\d+$/, 'Phone must be digits only'),
  bankAccountNumber: Yup.number()
    .typeError('Bank account must be a number')
    .integer('Must be an integer')
    .positive('Must be positive')
    .nullable(),
});

export default function AccountsWrite({
  accountId,
  initialData,
  onSuccess,
}: AccountsWriteProps) {
  const isEdit = Boolean(accountId);

  const handleSubmit = async (
    values: AccountInput,
    { setSubmitting, setStatus }: FormikHelpers<AccountInput>
  ) => {
    setStatus(undefined);
    try {
      const url = isEdit
        ? `${BASE_URL}/accounts/${accountId}`
        : `${BASE_URL}/accounts`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      await res.json();
      setStatus({ success: true });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      setStatus({ error: `Failed to ${isEdit ? 'update' : 'register'} account` });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{
        name: initialData?.name || '',
        address: initialData?.address || '',
        phoneNumber: initialData?.phoneNumber || '',
        bankAccountNumber: initialData?.bankAccountNumber ?? undefined,
      }}
      enableReinitialize
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ isSubmitting, status, errors, touched, getFieldProps }) => (
        <Form>
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ width: '100%', maxWidth: 400, mx: 'auto', p: 2 }}
          >
            <Typography variant="h6" gutterBottom>
              {isEdit ? 'Edit Account' : 'Register Account'}
            </Typography>

            {status?.error && (
              <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                {status.error}
              </Alert>
            )}
            {status?.success && (
              <Alert severity="success" sx={{ width: '100%', mb: 2 }}>
                Account {isEdit ? 'updated' : 'registered'}!
              </Alert>
            )}

            {/** Name */}
            <TextField
              label="Name"
              fullWidth
              sx={{ mb: 2 }}
              {...getFieldProps('name')}
              error={touched.name && Boolean(errors.name)}
              helperText={touched.name && errors.name}
            />

            {/** Address */}
            <TextField
              label="Address"
              fullWidth
              sx={{ mb: 2 }}
              {...getFieldProps('address')}
              error={touched.address && Boolean(errors.address)}
              helperText={touched.address && errors.address}
            />

            {/** Phone */}
            <TextField
              label="Phone Number"
              fullWidth
              sx={{ mb: 2 }}
              {...getFieldProps('phoneNumber')}
              error={touched.phoneNumber && Boolean(errors.phoneNumber)}
              helperText={touched.phoneNumber && errors.phoneNumber}
            />

            {/** Bank Account Number */}
            <TextField
              label="Bank Account No."
              fullWidth
              sx={{ mb: 2 }}
              {...getFieldProps('bankAccountNumber')}
              error={touched.bankAccountNumber && Boolean(errors.bankAccountNumber)}
              helperText={touched.bankAccountNumber && errors.bankAccountNumber}
            />

            <Button
              type="submit"
              variant="contained"
              disabled={isSubmitting}
              fullWidth
            >
              {isSubmitting ? <CircularProgress size={20} /> : isEdit ? 'Save' : 'Register'}
            </Button>
          </Box>
        </Form>
      )}
    </Formik>
  );
}
