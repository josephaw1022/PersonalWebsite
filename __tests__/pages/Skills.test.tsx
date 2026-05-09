import { render, screen } from '@testing-library/react';
import Skills from '@/app/skills/page';

describe('Skills Page', () => {
  it('renders the main heading', () => {
    render(<Skills />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/My Tech Stack/i);
  });

  it('renders a list of skills', () => {
    render(<Skills />);
    // Just verifying a couple of known skills are present
    expect(screen.getByText('Kubernetes')).toBeInTheDocument();
    expect(screen.getByText('Argo CD')).toBeInTheDocument();
    expect(screen.getByText('Terraform')).toBeInTheDocument();
    
    // Check that images are rendered
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(5); // At least a good chunk are there
  });
});
