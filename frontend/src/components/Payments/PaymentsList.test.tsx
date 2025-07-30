import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentsList, { type Payment } from './PaymentsList';

jest.mock('./PaymentsRead', () => ({
  __esModule: true,
  default: ({ renderItem }: { renderItem: (p: Payment) => React.ReactNode }) => {
    const dummy: Payment[] = [
      {
        id: 1,
        accountId: 10,
        account: { name: 'Alpha Co' },
        amount: 50,
        recipientName: 'Bob',
        recipientBank: 'Bank1',
        recipientBAN: '0001',
        status: 1,
        notes: 'Note A',
        createdAt: new Date('2025-01-01T12:00:00Z'),
      },
      {
        id: 2,
        accountId: 20,
        account: { name: 'Beta LLC' },
        amount: 75.5,
        recipientName: 'Carol',
        recipientBank: 'Bank2',
        recipientBAN: '0002',
        status: 2,
        notes: '',
        createdAt: new Date('2025-02-02T15:30:00Z'),
      },
    ];
    return (
      <div data-testid="payments-read">
        {dummy.map((p) => (
          <div key={p.id}>{renderItem(p)}</div>
        ))}
      </div>
    );
  },
}));

describe('<PaymentsList />', () => {
  const currencySymbol = '$';
  const refreshKey = 123;
  let onNew: jest.Mock;
  let onSelect: jest.Mock;
  let onEdit: jest.Mock;

  beforeEach(() => {
    onNew = jest.fn();
    onSelect = jest.fn();
    onEdit = jest.fn();
  });

  it('renders header and calls onNew when add icon clicked', () => {
    render(
      <PaymentsList
        currencySymbol={currencySymbol}
        refreshKey={refreshKey}
        selectedPaymentId={null}
        onNew={onNew}
        onSelect={onSelect}
        onEdit={onEdit}
      />
    );
    expect(screen.getByRole('heading', { name: /Payments/i })).toBeInTheDocument();

    const addBtn = screen.getByTestId('AddIcon').closest('button')!;
    expect(addBtn).toBeInTheDocument();
    fireEvent.click(addBtn);
    expect(onNew).toHaveBeenCalled();
  });

    it('renders dummy payments and wires up select/edit', () => {
    render(
        <PaymentsList
        currencySymbol={currencySymbol}
        refreshKey={refreshKey}
        selectedPaymentId={null}
        onNew={onNew}
        onSelect={onSelect}
        onEdit={onEdit}
        />
    );

    // Bob’s text
    expect(screen.getByText(/Bob \(Pending\)/i)).toBeInTheDocument();

    const bobBtn = screen.getByRole('button', {
        name: /paid to: Bob/i,
    });
    fireEvent.click(bobBtn);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));

    expect(screen.getByText(/Carol \(Approved\)/i)).toBeInTheDocument();
    const carolBtn = screen.getByRole('button', {
        name: /paid to: Carol/i,
    });
    fireEvent.click(carolBtn);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: 2 }));

    const editBtns = screen.getAllByTestId('EditIcon').map(icon =>
        icon.closest('button')!
    );
    expect(editBtns).toHaveLength(2);
    fireEvent.click(editBtns[0]);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({ id: 1 }));
    });


  it('highlights the selectedPaymentId', () => {
    render(
      <PaymentsList
        currencySymbol={currencySymbol}
        refreshKey={refreshKey}
        selectedPaymentId={2}
        onNew={onNew}
        onSelect={onSelect}
        onEdit={onEdit}
      />
    );

    const selected = screen.getByText(/paid to: Carol/i).closest('div');
    expect(selected?.className).toMatch(/MuiListItemText-root/);
  });
});
