import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import type { TransitionProps } from '@mui/material/transitions';
import AccountsWrite from '../AccountsWrite';
import type { AccountInput } from '../AccountsWrite';

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

interface AccountEditorDialogProps {
  open: boolean;
  accountId?: number;
  initialData?: AccountInput;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditDialog({
  open,
  accountId,
  initialData,
  onClose,
  onSuccess,
}: AccountEditorDialogProps) {
  const isEdit = Boolean(accountId);

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
      <DialogTitle>{isEdit ? 'Edit Account' : 'New Account'}</DialogTitle>
      <DialogContent>
        <AccountsWrite
          accountId={accountId}
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