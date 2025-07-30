import { render, screen, fireEvent } from '@testing-library/react';
import EditDialog from './EditDialog';

jest.mock('../AccountsWrite', () => (props: any) => {
  return (
    <button
      data-testid="mock-accounts-write"
      onClick={() => props.onSuccess()}
    >
      Mock Write
    </button>
  );
});

describe('<EditDialog />', () => {
  const defaultProps = {
    open: true,
    onClose: jest.fn(),
    onSuccess: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders "New Account" title when no accountId is provided', () => {
    render(<EditDialog {...defaultProps} />);
    expect(screen.getByText('New Account')).toBeInTheDocument();
  });

  it('renders "Edit Account" title when accountId is provided', () => {
    render(<EditDialog {...defaultProps} accountId={123} />);
    expect(screen.getByText('Edit Account')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<EditDialog {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('when AccountsWrite signals success, calls onSuccess then onClose', () => {
    render(<EditDialog {...defaultProps} />);
    
    fireEvent.click(screen.getByTestId('mock-accounts-write'));
    expect(defaultProps.onSuccess).toHaveBeenCalledTimes(1);
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
