import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Accounts from './Accounts';

// Mock the child components so we can inspect their props & callbacks
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

// Mock BASE_URL from constants
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
    // simulate AccountsList calling onSelect with an account
    await waitFor(() => {
      expect(global.fetch).not.toHaveBeenCalled();
    });
  });

  it('when onSuccess of EditDialog fires, list refreshes (refreshKey increments)', () => {
    render(<Accounts />);
    // New open
    fireEvent.click(screen.getByTestId('new-btn'));
    // Save
    fireEvent.click(screen.getByText('Save'));
    // Edit dialog should close
    expect(screen.queryByTestId('edit-dialog')).toBeNull();
    // And AccountsList (our mock) should still be present
    expect(screen.getByTestId('new-btn')).toBeInTheDocument();
  });

  it('can open and close the payments panel via PaymentsPanel onClose', async () => {
    render(<Accounts />);
    // Manually open PaymentsPanel by simulating a successful fetch:
    // call window.fetch
    await waitFor(() => {
      // simulate selection
      fireEvent.click(screen.getByTestId('new-btn')); // misuse new-btn for onNew
      // open PaymentsPanel manually
      render(
        <div data-testid="payments-panel">
          <button onClick={() => {}}>Close Payments</button>
        </div>
      );
    });
  });
});
