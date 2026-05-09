import { render, screen } from '@testing-library/react';
import Footer from '@/components/Footer';

describe('Footer', () => {
  it('renders copyright info with current year', () => {
    render(<Footer />);
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    expect(screen.getByText(/Joseph Whiteaker/i)).toBeInTheDocument();
  });

  it('renders social links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /linkedin/i })).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/joseph-whiteaker-iii-02482a198/'
    );
    expect(screen.getByRole('link', { name: /github/i })).toHaveAttribute(
      'href',
      'https://github.com/josephaw1022'
    );
    expect(screen.getByRole('link', { name: /medium/i })).toHaveAttribute(
      'href',
      'https://medium.com/@josephsims1'
    );
  });
});
