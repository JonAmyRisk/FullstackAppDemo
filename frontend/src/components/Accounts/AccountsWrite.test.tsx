import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AccountsWrite from './AccountsWrite';
import fetchMock from 'jest-fetch-mock';

describe('<AccountsWrite />', () => {
  beforeEach(() => fetchMock.resetMocks());

  it('shows validation errors when required fields are empty', async () => {
    render(<AccountsWrite onSuccess={() => {}} />);
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(await screen.findByText(/Name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Address is required/i)).toBeInTheDocument();
    expect(screen.getByText(/Phone number is required/i)).toBeInTheDocument();
  });

  it('submits the form and calls onSuccess', async () => {
  const onSuccess = jest.fn();
  
  fetchMock.mockResponseOnce(
    JSON.stringify({ id: 1, name: 'Foo', address: 'Bar', phoneNumber: '123' }),
  );

  render(<AccountsWrite onSuccess={onSuccess} />);

  await userEvent.type(screen.getByLabelText(/Name/i), 'Foo');
  await userEvent.type(screen.getByLabelText(/Address/i), 'Bar');
  await userEvent.type(screen.getByLabelText(/Phone Number/i), '123');
  await userEvent.click(screen.getByRole('button', { name: /register/i }));

  await waitFor(() => {
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  const [url, options] = fetchMock.mock.calls[0]!;

  // Basic assertions on URL + method + headers
  expect(url).toContain('/accounts');
  expect(options.method).toBe('POST');
  expect(options.headers).toEqual({ 'Content-Type': 'application/json' });

  const payload = JSON.parse(options.body as string);
  expect(payload).toEqual({
    name: 'Foo',
    address: 'Bar',
    phoneNumber: '123',
  });

  expect(onSuccess).toHaveBeenCalled();
});
});
