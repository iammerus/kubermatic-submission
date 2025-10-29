import { render, screen } from '@testing-library/react';
import { StatusIcon } from '../StatusIcon';

describe('StatusIcon', () => {
  it('renders running status with green color', () => {
    const { container } = render(<StatusIcon status="running" />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders pending status with orange color', () => {
    const { container } = render(<StatusIcon status="pending" />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });

  it('renders error status with red color', () => {
    const { container } = render(<StatusIcon status="error" />);
    const icon = container.querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
