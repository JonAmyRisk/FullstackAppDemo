import { render, screen, waitFor } from '@testing-library/react';
import AccountsRead from './AccountsRead';
import fetchMock from 'jest-fetch-mock';

describe('<AccountsRead />', () => {
  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('shows a spinner while loading', () => {
    fetchMock.mockResponseOnce(() => new Promise(() => {})); // never resolves
    render(<AccountsRead refreshKey={0} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders "No accounts" if API returns empty array', async () => {
    fetchMock.mockResponseOnce(JSON.stringify([]));
    render(<AccountsRead refreshKey={0} />);
    await waitFor(() => {
      expect(screen.getByText(/No accounts registered/i)).toBeInTheDocument();
    });
  });

  it('renders a list of accounts when API returns data', async () => {
    const mockData = [
      { id: 1, name: 'Alice', address: 'Addr A', phoneNumber: '111', bankAccountNumber: 123 },
      { id: 2, name: 'Bob',   address: 'Addr B', phoneNumber: '222', bankAccountNumber: null },
    ];
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    render(<AccountsRead refreshKey={0} />);

    // wait for items to appear
    for (const account of mockData) {
      await waitFor(() => {
        expect(screen.getByText(account.name)).toBeInTheDocument();
        expect(screen.getByText(new RegExp(account.address))).toBeInTheDocument();
      });
    }
  });

  it('renders custom renderItem prop', async () => {
    const mockData = [{ id: 5, name: 'X', address: '', phoneNumber: '', bankAccountNumber: null }];
    fetchMock.mockResponseOnce(JSON.stringify(mockData));

    render(
      <AccountsRead
        refreshKey={0}
        renderItem={(acc) => <div data-testid="custom">{acc.name}-custom</div>}
      />
    );

    await waitFor(() => {
      expect(screen.getByTestId('custom')).toHaveTextContent('X-custom');
    });
  });
});
