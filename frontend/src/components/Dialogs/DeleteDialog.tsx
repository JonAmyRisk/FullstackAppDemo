import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import type { TransitionProps } from '@mui/material/transitions';

//This component is not being used currently as not in requirements but is a key part of CRUD so kept here for example//

const Transition = React.forwardRef<HTMLDivElement, TransitionProps>(function Transition(props, ref) {
  const { children, ...rest } = props;
  return (
    <Slide direction="up" ref={ref} {...rest}>
      {children as React.ReactElement}
    </Slide>
  );
});

interface DeleteDialogProps {
  open: boolean;
  title?: string;
  message?: string;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function DeleteDialog({
  open,
  title = 'Confirm Delete',
  message = 'Are you sure you want to delete this item?',
  onCancel,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel} 
      slots={{
        transition: Transition
      }}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{message}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancel</Button>
        <Button color="error" onClick={onConfirm}>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}
