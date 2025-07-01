import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, beforeEach, afterEach, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Navbar from './Navbar';
import userEvent from '@testing-library/user-event';

vi.mock('src\assets\Logo.png', () => 'logo.png');


const mockedNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Navbar', () => {
  beforeEach(() => {
    localStorage.setItem('token', 'mock-token');
    mockedNavigate.mockReset();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('renderiza correctamente con token', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByAltText(/logo/i)).toBeInTheDocument();
    expect(screen.getByText(/e-dentogram/i)).toBeInTheDocument();
  });

  it('renderiza el botón de calendario si GoogleToken está presente', () => {
    localStorage.setItem('GoogleToken', 'mock-google-token');
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    expect(screen.getByText(/calendario/i)).toBeInTheDocument();
  });

  it('abre y cierra el modal al hacer click en el botón de logout', () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutBtn = screen.getAllByRole('button')[1]; 
    fireEvent.click(logoutBtn);
    expect(screen.getByText(/¿está seguro que desea salir/i)).toBeInTheDocument();

    const cancelarBtn = screen.getByText(/cancelar/i);
    fireEvent.click(cancelarBtn);
    expect(screen.queryByText(/¿está seguro que desea salir/i)).not.toBeInTheDocument();
  });

  it('cierra sesión y navega al inicio cuando se confirma el logout', async () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    );

    const logoutBtn = screen.getAllByRole('button')[1];
    fireEvent.click(logoutBtn);

    const confirmButton = screen.getByRole('button', { name: /confirmar/i });
    await userEvent.click(confirmButton);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('GoogleToken')).toBeNull();
    expect(mockedNavigate).toHaveBeenCalledWith('/');
  });
});