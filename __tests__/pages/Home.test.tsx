import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    
    // We expect the text "Building Secure Platforms" to be part of an h1.
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Building Secure Platforms/i);
    expect(heading).toHaveTextContent(/Without Sacrificing Velocity/i);
  });

  it('renders call to action links', () => {
    render(<Home />);
    expect(screen.getByRole('link', { name: /explore my tech stack/i })).toHaveAttribute('href', '/skills');
    expect(screen.getByRole('link', { name: /about my approach/i })).toHaveAttribute('href', '/about');
  });
});
