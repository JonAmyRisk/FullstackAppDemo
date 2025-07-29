import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import PaymentsWrite from './PaymentsWrite';
import type { PaymentInput } from './PaymentsWrite';

const Transition = React.forwardRef<
  HTMLDivElement,
  TransitionProps & { children: React.ReactElement }
>(function Transition(props, ref) {
  const { children, ...rest } = props;
  return (
    <Slide direction="down" ref={ref} {...rest}>
      {children}
    </Slide>
  );
});

interface EditorDialogProps {
  open: boolean;
  initialData?: PaymentInput;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditDialog({
  open,
  initialData,
  onClose,
  onSuccess,
}: EditorDialogProps) {
  const isEdit = Boolean(initialData && initialData.id);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slots={{
        transition: Transition
      }}
    >
      <DialogTitle>{isEdit ? 'Update Payment' : 'New Payment'}</DialogTitle>
      <DialogContent>
        <PaymentsWrite
          initialData={initialData}
          onSuccess={() => {
            onSuccess();
            onClose();
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
}