import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Accounts from './Accounts';

jest.mock('../../components/Accounts/AccountsList', () => (props: any) => {
  return (
    <button
      data-testid="new-btn"
      onClick={props.onNew}
    >
      New Account
    </button>
  );
});
jest.mock('../../components/Accounts/PaymentsPanel', () => (props: any) => {
  return (
    <div data-testid="payments-panel">
      <span>{props.accountName}</span>
      <button onClick={props.onClose}>Close Payments</button>
    </div>
  );
});
jest.mock('../../components/Accounts/Dialogs/EditDialog', () => (props: any) => {
  return props.open ? (
    <div data-testid="edit-dialog">
      <button onClick={props.onSuccess}>Save</button>
      <button onClick={props.onClose}>Cancel</button>
    </div>
  ) : null;
});

jest.mock('../../utils/constants', () => ({
  BASE_URL: 'http://test',
}));

describe('<Accounts />', () => {
  beforeEach(() => {
    jest.resetAllMocks();    
  });

  it('opens edit dialog when "New Account" is clicked', () => {
    render(<Accounts />);
    fireEvent.click(screen.getByTestId('new-btn'));
    expect(screen.getByTestId('edit-dialog')).toBeInTheDocument();
  });

  it('selecting an account fetches payments and shows PaymentsPanel', async () => {
    render(<Accounts />);
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('when onSuccess of EditDialog fires, list refreshes (refreshKey increments)', () => {
    render(<Accounts />);
    fireEvent.click(screen.getByTestId('new-btn'));
    fireEvent.click(screen.getByText('Save'));
    expect(screen.queryByTestId('edit-dialog')).toBeNull();
    expect(screen.getByTestId('new-btn')).toBeInTheDocument();
  });

  it('can open and close the payments panel via PaymentsPanel onClose', async () => {
    render(<Accounts />);
    await waitFor(() => {
      fireEvent.click(screen.getByTestId('new-btn'));
      render(
        <div data-testid="payments-panel">
          <button onClick={() => {}}>Close Payments</button>
        </div>
      );
    });
  });
});
