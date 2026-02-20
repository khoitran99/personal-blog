import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Layout } from '../Layout';
import { ThemeProvider } from '../theme-provider';

describe('Layout', () => {
  it('renders the blog title', () => {
    render(
      <BrowserRouter>
        <ThemeProvider>
          <Layout />
        </ThemeProvider>
      </BrowserRouter>,
    );

    // Check for desktop title
    expect(screen.getByText("Khoi Tran's Blog")).toBeInTheDocument();
  });
});
