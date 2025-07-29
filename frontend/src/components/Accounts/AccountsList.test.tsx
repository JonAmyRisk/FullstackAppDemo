import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AccountsList, { type Account } from './AccountsList';

// 1) Mock AccountsRead so it just inlines renderItem results (no extra <li>)
jest.mock('./AccountsRead', () => {
  return function DummyAccountsRead({
    renderItem,
  }: {
    renderItem: (acc: Account) => React.ReactNode;
  }) {
    const fakeAccounts: Account[] = [
      { id: 1, name: 'Alice', address: 'A St', phoneNumber: '111', bankAccountNumber: '123' },
      { id: 2, name: 'Bob',   address: 'B Rd', phoneNumber: '222', bankAccountNumber: null },
    ];
    return (
      <div data-testid="dummy-read">
        {fakeAccounts.map((acc) => (
          <React.Fragment key={acc.id}>{renderItem(acc)}</React.Fragment>
        ))}
      </div>
    );
  };
});

describe('<AccountsList />', () => {
  const onNew = jest.fn();
  const onSelect = jest.fn();
  const onEdit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header and calls onNew when the + button is clicked', () => {
    render(
      <AccountsList
        refreshKey={0}
        selectedAccountId={null}
        onNew={onNew}
        onSelect={onSelect}
        onEdit={onEdit}
      />
    );

    expect(screen.getByText('Accounts')).toBeInTheDocument();

    // Note: we added aria-label="Add account" to the IconButton in AccountsList
    const addBtn = screen.getByLabelText('Add account');
    fireEvent.click(addBtn);
    expect(onNew).toHaveBeenCalled();
  });

  it('renders each account via renderItem and wires up select/edit', () => {
    render(
      <AccountsList
        refreshKey={0}
        selectedAccountId={null}
        onNew={onNew}
        onSelect={onSelect}
        onEdit={onEdit}
      />
    );

    // "Alice" button
    const aliceBtn = screen.getByRole('button', { name: 'Alice A St • 111 • Bank Acc: 123' });
    fireEvent.click(aliceBtn);
    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ "address": "A St", "bankAccountNumber": "123", "id": 1, "name": "Alice", "phoneNumber": "111" }));

    // "Bob" edit icon button
    // We gave that IconButton no label, but its child SVG has data-testid="EditIcon"
    const bobEditBtn = screen.getAllByTestId('EditIcon')
      .map((icon) => icon.closest('button') as HTMLElement)
      .find((btn) =>
        btn!.parentElement?.textContent?.includes('Bob')
      )!;
    fireEvent.click(bobEditBtn);
    expect(onEdit).toHaveBeenCalledWith(expect.objectContaining({"address": "B Rd", "bankAccountNumber": null, "id": 2, "name": "Bob", "phoneNumber": "222"}));
  });

  it('applies selected styling to the selectedAccountId', () => {
    render(
      <AccountsList
        refreshKey={0}
        selectedAccountId={2}
        onNew={onNew}
        onSelect={onSelect}
        onEdit={onEdit}
      />
    );

    // The button whose accessible name is "Bob" should have Mui-selected
    const bobBtn = screen.getByRole('button', { name: 'Bob B Rd • 222' });
    expect(bobBtn.className).toMatch(/Mui-selected/);
  });
});