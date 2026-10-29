import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { beforeAll, describe, expect, it, vi } from 'vitest';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AdminSidebar } from './AdminSidebar';

beforeAll(() => {
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => ({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() })),
  );
});

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <SidebarProvider>
        <AdminSidebar />
      </SidebarProvider>
    </MemoryRouter>,
  );

describe('AdminSidebar', () => {
  it('shows the top-level sections in order', () => {
    renderAt('/admin');

    const labels = screen
      .getAllByRole('listitem')
      .filter((item) => item.dataset.sidebar === 'menu-item')
      .map((item) => item.textContent);

    expect(labels).toEqual(['Users', 'News', 'Library', 'Questions', 'Map', 'Settings']);
  });

  it('opens the section containing the current page', () => {
    renderAt('/admin/tags');

    expect(screen.getByRole('link', { name: 'Tags' })).toHaveAttribute('data-active');
    expect(screen.getByRole('link', { name: 'Profile types' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Overview' })).not.toBeInTheDocument();
  });
});
