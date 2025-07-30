
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import fetchMock from 'jest-fetch-mock';
import PaymentsWrite from './PaymentsWrite';

describe('<PaymentsWrite />', () => {
  const currencySymbol = '£';
  const accountsApi = [
    { id: 1, name: 'Acme Corp', address: '', phoneNumber: '' },
    { id: 2, name: 'Globex', address: '', phoneNumber: '' },
  ];

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  it('loads account list and shows in dropdown', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(accountsApi));
    render(<PaymentsWrite currencySymbol={currencySymbol} onSuccess={() => {}} />);

    await waitFor(() =>
        expect(fetchMock).toHaveBeenCalledWith(
        expect.stringContaining('/accounts')
        )
    );
    userEvent.click(screen.getByRole('combobox', { name: /Account/i }));

    await screen.findByRole('listbox');
    expect(
        screen.getByRole('option', { name: /Acme Corp/i })
    ).toBeInTheDocument();
    expect(
        screen.getByRole('option', { name: /Globex/i })
    ).toBeInTheDocument();
    });

    it('shows validation errors if required fields are empty', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(accountsApi));
    render(<PaymentsWrite currencySymbol={currencySymbol} onSuccess={() => {}} />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    userEvent.click(screen.getByRole('button', { name: /Add/i }));

    expect(
        await screen.findByText(/must be a positive number/i, { selector: 'p' })
    ).toBeInTheDocument();
    });
});
