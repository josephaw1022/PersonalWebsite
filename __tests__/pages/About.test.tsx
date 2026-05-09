import { render, screen } from '@testing-library/react';
import About from '@/app/about/page';

describe('About Page', () => {
  it('renders the main heading', () => {
    render(<About />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/My Philosophy/i);
  });

  it('renders the focus areas and approach sections', () => {
    render(<About />);
    expect(screen.getByRole('heading', { name: /My Focus Areas/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /How I Approach Platform Work/i })).toBeInTheDocument();
  });
});
