import { useState } from 'react';
import Box from '@mui/material/Box';
import PaymentsList from '../../components/Payments/PaymentsList';
import EditDialog from '../../components/Payments/Dialogs/EditDialog';

export default function Payments() {
  const BASE_URL = `${import.meta.env.VITE_BASE_URL}`;

  //Should come from locale object//
  const currencySymbol = '£'

  const [refreshKey, setRefreshKey] = useState(0);
  const [editingPayment, setEditingPayment] = useState<any>(null);
  const [writeOpen, setWriteOpen] = useState(false);
  
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);

  const handlePaymentChanged = () => setRefreshKey((k) => k + 1);
  const handleNew = () => { setEditingPayment(null); setWriteOpen(true); };
  const handleEdit = (payment: any) => { setEditingPayment(payment); setWriteOpen(true); };
 
  const selectPayment = async (payment: any) => {
    setSelectedPayment(payment);
    const res = await fetch(`${BASE_URL}/payments/${payment.id}`);
    const data = await res.json();
    setPayments(data.payments || []);
  };

  return (
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
        open={writeOpen}
        paymentId={selectedPayment?.id}
        initialData={selectedPayment}
        onClose={() => setWriteOpen(false)}
        onSuccess={() => {
          setWriteOpen(false);
          handlePaymentChanged();
        }}
      />
    </Box>
  );
}

