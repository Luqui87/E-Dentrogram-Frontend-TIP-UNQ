import { render, screen } from '@testing-library/react';
import PacienteCard from './PacienteCard';
import { describe, it, expect } from 'vitest';

describe('PacienteCard', () => {
  const mockPatient = {
    name: 'Juan Pérez',
    medicalRecord: '123456',
    dni: '12345678',
    address: 'Calle Falsa 123',
    birthdate: '1990-05-15',
    telephone: '1122334455',
    email: 'juan@example.com',
  };

  it('muestra todos los datos del paciente correctamente', () => {
    render(<PacienteCard patient={mockPatient} />);

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('123456')).toBeInTheDocument();
    expect(screen.getByText('12345678')).toBeInTheDocument();
    expect(screen.getByText('Calle Falsa 123')).toBeInTheDocument();
    expect(screen.getByText('15/05/1990')).toBeInTheDocument();
    expect(screen.getByText('1122334455')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
  });

  it('muestra los labels correctamente', () => {
    render(<PacienteCard patient={mockPatient} />);

    expect(screen.getByText(/historia clinica/i)).toBeInTheDocument();
    expect(screen.getByText(/d\.n\.i\./i)).toBeInTheDocument();
    expect(screen.getByText(/dirección/i)).toBeInTheDocument();
    expect(screen.getByText(/fecha de nacimiento/i)).toBeInTheDocument();
    expect(screen.getByText(/telefono/i)).toBeInTheDocument();
    expect(screen.getByText(/correo/i)).toBeInTheDocument();
  });
});