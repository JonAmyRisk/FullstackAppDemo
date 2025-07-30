import { render, screen, fireEvent } from '@testing-library/react';
import EditDialog from './EditDialog';
import type { PaymentInput } from '../PaymentsWrite';

jest.mock('../PaymentsWrite', () => (props: any) => {
  return (
    <button
      data-testid="mock-payments-write"
      onClick={() => props.onSuccess()}
    >
      Mock Write
    </button>
  );
});

describe('<EditDialog />', () => {
  const defaultProps = {
    currencySymbol: '£',
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

    const exampleData: PaymentInput = {
      id:              42,
      accountId:       7,
      accountName:     'Acme Corp',
      amount:          123.45,
      recipientName:   'Bob',
      recipientBank:   'Example Bank',
      recipientBAN:    '987654321',
      status:          2,
      notes:           'Monthly rent',
      createdAt:       new Date('2025-07-29T12:34:56Z'),
    };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "New Payment" title when no paymentId is provided', () => {
    render(<EditDialog {...defaultProps} />);
    expect(screen.getByText('New Payment')).toBeInTheDocument();
  });

  it('renders "Update Payment" title when paymentId is provided', () => {
    render(<EditDialog {...defaultProps} paymentId={123} initialData={exampleData} />);
    expect(screen.getByText('Update Payment')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<EditDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('when PaymentsWrite signals success, calls onSuccess then onClose', () => {
    render(<EditDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('mock-payments-write'));
    expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
