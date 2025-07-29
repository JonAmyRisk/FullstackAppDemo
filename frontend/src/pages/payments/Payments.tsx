import React, { useState } from 'react';
import Box from '@mui/material/Box';
import MuiAlert, { type AlertProps } from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import PaymentsList from '../../components/Payments/PaymentsList';
import EditDialog from '../../components/Payments/Dialogs/EditDialog';

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} variant="filled" ref={ref} {...props} />;
});


export default function Payments() {
  //Should come from locale object//
  const currencySymbol = '£'

  const [refreshKey, setRefreshKey] = useState(0);
  const [writeOpen, setWriteOpen] = useState(false);
  
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  
  const [snack, setSnack] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info' | 'warning';
  }>({ open: false, message: '', severity: 'info' });
  
  const showSnack = (message: string, severity: typeof snack.severity) => {
    setSnack({ open: true, message, severity });
  };
  const closeSnack = () => {
    setSnack((s) => ({ ...s, open: false }));
  };

  const handlePaymentChanged = () => setRefreshKey((k) => k + 1);
  const handleNew = () => { setWriteOpen(true); };
  const handleEdit = () => { setWriteOpen(true); };
 
  const selectPayment = async (payment: any) => {
    setSelectedPayment(payment);
  };

  return (
    <>
      <Box sx={{ display: 'flex', height: '100%' }}>
        <PaymentsList
          currencySymbol={currencySymbol} 
          refreshKey={refreshKey}
          selectedPaymentId={selectedPayment?.id ?? null}
          onSelect={selectPayment}
          onNew={handleNew}
          onEdit={handleEdit}
        />
        <EditDialog
          currencySymbol={currencySymbol}
          open={writeOpen}
          paymentId={selectedPayment?.id}
          initialData={selectedPayment}
          onError={(msg) => {showSnack(msg, 'error')}}
          onClose={() => {setWriteOpen(false); setSelectedPayment(null)}}
          onSuccess={() => {
            setWriteOpen(false);
            setSelectedPayment(null);
            showSnack(
              selectedPayment ? 'Payment updated successfully' : 'Payment created successfully',
              'success'
            );
            handlePaymentChanged();
          }}
        />
      </Box>
      <Snackbar
        open={snack.open}
        autoHideDuration={3000}
        onClose={closeSnack}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={closeSnack} severity={snack.severity}>
          {snack.message}
        </Alert>
      </Snackbar>
    </>
  );
}

