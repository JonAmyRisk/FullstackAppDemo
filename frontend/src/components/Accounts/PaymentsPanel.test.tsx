import { render, screen, fireEvent } from '@testing-library/react';
import PaymentsPanel, { type Payment } from './PaymentsPanel';
import { PAYMENT_STATUS } from '../../utils/status';

describe('<PaymentsPanel />', () => {
  const onClose = jest.fn();
  const accountName = 'Test Account';
  const currencySymbol = '£';
  const payments: Payment[] = [
    { id: 1, amount: 12.5, recipientName: 'Alice', status: 1, notes: 'First payment' },
    { id: 2, amount: 100, recipientName: 'Bob',   status: 2, notes: '' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders header, payments list, and calls onClose', () => {
    render(
      <PaymentsPanel
        currencySymbol={currencySymbol}
        accountName={accountName}
        payments={payments}
        onClose={onClose}
      />
    );

    // Header
    expect(
      screen.getByRole('heading', { name: `Payments for ${accountName}` })
    ).toBeInTheDocument();

    // Close button (aria-label must match)
    const closeBtn = screen.getByLabelText('Close payments panel');
    expect(closeBtn).toBeInTheDocument();
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();

    // Payment entries
    payments.forEach((p) => {
      // Primary text
      const primary = `${currencySymbol}${p.amount.toFixed(2)} to ${p.recipientName}`;
      expect(screen.getByText(primary)).toBeInTheDocument();

      // Secondary text should use status lookup and notes
      const statusLabel = PAYMENT_STATUS[p.status];
      const notesPart = p.notes ? ` | ${p.notes}` : '';
      expect(
        screen.getByText(`Status: ${statusLabel}${notesPart}`)
      ).toBeInTheDocument();
    });
  });

  it('renders no-payments message and close button when list is empty', () => {
    render(
      <PaymentsPanel
        currencySymbol={currencySymbol}
        accountName={accountName}
        payments={[]}
        onClose={onClose}
      />
    );

    expect(
    screen.getByText(/No payments found for/i)
    ).toBeInTheDocument();
    expect(screen.getByText(accountName)).toBeInTheDocument();

    // Close button still present
    const closeBtn = screen.getByLabelText('Close payments panel');
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
