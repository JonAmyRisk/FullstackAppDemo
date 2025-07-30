import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Payments from './Payments';

jest.mock('../../components/Payments/PaymentsList', () => (props: any) => (
  <div>
    <button data-testid="new-payment" onClick={props.onNew}>
      New Payment
    </button>
    <button data-testid="edit-payment" onClick={() => props.onEdit({ id: 99 })}>
      Edit Payment
    </button>
  </div>
));

jest.mock('../../components/Payments/Dialogs/EditDialog', () => (props: any) =>
  props.open ? (
    <div data-testid="edit-dialog">
      <button data-testid="error-btn" onClick={() => props.onError('Oops')}>
        Trigger Error
      </button>
      <button data-testid="success-btn" onClick={props.onSuccess}>
        Trigger Success
      </button>
      <button data-testid="close-btn" onClick={props.onClose}>
        Close Dialog
      </button>
    </div>
  ) : null
);

describe('<Payments />', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('opens the edit dialog when "New Payment" is clicked', () => {
    render(<Payments />);
    fireEvent.click(screen.getByTestId('new-payment'));
    
    expect(screen.getByTestId('edit-dialog')).toBeInTheDocument();
  });

  it('opens the edit dialog when "Edit Payment" is clicked', () => {
    render(<Payments />);
    fireEvent.click(screen.getByTestId('edit-payment'));

    expect(screen.getByTestId('edit-dialog')).toBeInTheDocument();
  });

  it('shows an error snackbar when EditDialog calls onError', async () => {
    render(<Payments />);
    fireEvent.click(screen.getByTestId('new-payment'));
    fireEvent.click(screen.getByTestId('error-btn'));

    expect(await screen.findByText(/Oops/)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-colorError');
  });

  it('shows a success snackbar when EditDialog calls onSuccess', async () => {
    render(<Payments />);
    fireEvent.click(screen.getByTestId('new-payment'));
    fireEvent.click(screen.getByTestId('success-btn'));

    expect(await screen.findByText(/Payment created successfully/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('MuiAlert-colorSuccess');
  });

  it('closes the snackbar when its close handler is called', async () => {
    render(<Payments />);
    fireEvent.click(screen.getByTestId('new-payment'));
    fireEvent.click(screen.getByTestId('success-btn'));

    const alert = await screen.findByRole('alert');
    expect(alert).toBeInTheDocument();

    fireEvent.click(alert.querySelector('button')!);
    
    await waitFor(() => {
      expect(screen.queryByRole('alert')).toBeNull();
    });
  });
});
