import { render, screen } from '@testing-library/react';
import { App } from '../src/App';

describe('App', () => {
  test('renders loading state', () => {
    render(<App />);
    const loadingElement = screen.getByText(/Завантаження.../i);
    expect(loadingElement).toBeInTheDocument();
  });
});