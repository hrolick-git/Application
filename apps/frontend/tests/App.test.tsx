import { render, screen } from '@testing-library/react';
import { App } from '../src/App';

test('renders navbar', () => {
  render(<App />);
  expect(screen.getByText(/Navbar/i)).toBeInTheDocument();
});
