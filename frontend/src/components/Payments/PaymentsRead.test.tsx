import { render, screen, waitFor } from '@testing-library/react';
import fetchMock from 'jest-fetch-mock';
import PaymentsRead, { type Payment } from './PaymentsRead';

describe('<PaymentsRead />', () => {
  const currencySymbol = '$';

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('shows a spinner while loading', () => {
    fetchMock.mockResponse(() => new Promise(() => {}));
    render(<PaymentsRead currencySymbol={currencySymbol} refreshKey={0} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('shows an error message on fetch failure', async () => {
    fetchMock.mockRejectOnce(new Error('network error'));
    render(<PaymentsRead currencySymbol={currencySymbol} refreshKey={0} />);
    await waitFor(() =>
      expect(screen.getByText(/Failed to load Payments/i)).toBeInTheDocument()
    );
  });

  it('shows "No Payments registered." when API returns []', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    render(<PaymentsRead currencySymbol={currencySymbol} refreshKey={0} />);
    await waitFor(() =>
      expect(screen.getByText(/No Payments registered\./i)).toBeInTheDocument()
    );
  });

  it('renders fetched payments with default layout', async () => {
    const data: Payment[] = [
      {
        id: 1,
        accountId: 1,
        account: { name: 'Acme' },
        amount: 12.34,
        recipientName: 'Bob',
        recipientBank: 'Bank A',
        recipientBAN: '123',
        status: 2, 
        notes: 'Urgent',
        createdAt: new Date('2025-01-01T12:00:00Z'),
      },
      {
        id: 2,
        accountId: 1,
        account: { name: 'Acme' },
        amount: 56.78,
        recipientName: 'Alice',
        recipientBank: 'Bank B',
        recipientBAN: '456',
        status: 1, 
        notes: '',
        createdAt: new Date('2025-02-02T15:30:00Z'),
      },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(data));

    render(<PaymentsRead currencySymbol={currencySymbol} refreshKey={0} />);
    
    await waitFor(() =>
      expect(screen.getByText(/\$ 12.34 paid to: Bob : Approved/i)).toBeInTheDocument()
    );
    expect(screen.getByText("From Acme on 01/01/2025, 12:00:00")).toBeInTheDocument()
    
    expect(
      screen.getByText(/\$ 56.78 paid to: Alice : Pending/i)
    ).toBeInTheDocument();
  });

  it('uses custom renderItem when provided', async () => {
    const data: Payment[] = [
      { id: 5, accountId: 1, account: { name: 'Foo' }, amount: 1, recipientName: 'X', recipientBank: '', recipientBAN: '0', status: 1, notes: '', createdAt: new Date() },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(data));
    render(
      <PaymentsRead
        currencySymbol={currencySymbol}
        refreshKey={0}
        renderItem={(p) => <div data-testid="custom">{`PAY#${p.id}`}</div>}
      />
    );
    await waitFor(() =>
      expect(screen.getByTestId('custom')).toHaveTextContent('PAY#5')
    );
  });
});
