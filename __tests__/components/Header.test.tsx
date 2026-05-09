import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

// The navigation mock is in jest.setup.ts

describe('Header', () => {
  it('renders the branding logo and name', () => {
    render(<Header />);
    expect(screen.getByText('JW')).toBeInTheDocument();
    expect(screen.getByText('Joseph Whiteaker')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/');
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about');
    expect(screen.getByRole('link', { name: 'Skills' })).toHaveAttribute('href', '/skills');
  });

  it('renders the source code link', () => {
    render(<Header />);
    const sourceLink = screen.getByRole('link', { name: /source/i });
    expect(sourceLink).toHaveAttribute('href', 'https://github.com/josephaw1022/PersonalWebsite');
  });
});
