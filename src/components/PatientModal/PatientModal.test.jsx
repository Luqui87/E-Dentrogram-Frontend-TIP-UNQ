import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PatientModal from "./PatientModal";
import { toast } from "react-toastify";
import API, { handleApiError } from "../../service/API";

// Mocks
vi.mock("../../service/API", () => ({
  default: {
    addPatient: vi.fn(),
    updatePatient: vi.fn(),
  },
  handleApiError: vi.fn(() => "Error mockeado"),
}));

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../Modal", () => ({
  default: ({ isOpen, onClose, children }) => (
    isOpen ? <div data-testid="modal">{children}</div> : null
  ),
}));

describe("PatientModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const baseProps = {
    showModal: true,
    onClose: vi.fn(),
    dentistId: 1,
    handleEditedPatient: vi.fn(),
  };

  it("renderiza pestañas y campos correctamente (modo agregar)", () => {
    render(<PatientModal {...baseProps} patient={null} />);

    expect(screen.getByText("Agregar")).toBeInTheDocument();
    expect(screen.getByText("Registrar")).toBeInTheDocument();
    expect(screen.getByLabelText("Historia Clínica")).toBeInTheDocument();
  });

  it("muestra error si el campo Historia Clínica está vacío al confirmar", async () => {
    render(<PatientModal {...baseProps} patient={null} />);
    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith("Hay campos vacios");
    });
  });

  it("llama a API.addPatient correctamente y cierra el modal", async () => {
    API.addPatient.mockResolvedValue({});

    render(<PatientModal {...baseProps} patient={null} />);

    fireEvent.change(screen.getByLabelText("Historia Clínica"), {
      target: { value: "123" },
    });

    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(API.addPatient).toHaveBeenCalledWith(1, expect.objectContaining({
        medicalRecord: "123",
      }));
      expect(toast.success).toHaveBeenCalledWith("Paciente agregado exitosamente.");
      expect(baseProps.onClose).toHaveBeenCalled();
    });
  });

  it("llama a API.updatePatient correctamente en modo editar", async () => {
    const patient = {
      medicalRecord: "HC123",
      dni: "12345678",
      name: "Juan",
      address: "Calle Falsa 123",
      birthdate: "2000-01-01",
      telephone: 54911223344,
      email: "juan@mail.com",
    };

    API.updatePatient.mockResolvedValue({ data: { ...patient } });

    render(<PatientModal {...baseProps} patient={patient} />);

    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(API.updatePatient).toHaveBeenCalledWith(expect.objectContaining({
            telephone: expect.any(Number),
            name: "Juan",
        }));
      expect(baseProps.handleEditedPatient).toHaveBeenCalledWith(patient);
      expect(baseProps.onClose).toHaveBeenCalled();
    });
  });

  it("muestra mensaje de error si updatePatient falla", async () => {
    const patient = {
      medicalRecord: "HC123",
      dni: "12345678",
      name: "Juan",
      address: "Calle Falsa 123",
      birthdate: "2000-01-01",
      telephone: 54911223344,
      email: "juan@mail.com",
    };

    API.updatePatient.mockRejectedValue(new Error("Error"));

    render(<PatientModal {...baseProps} patient={patient} />);

    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => {
      expect(handleApiError).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Error mockeado");
    });
  });

  it("puede editar campos y ver reflejado el valor", () => {
  render(<PatientModal {...baseProps} patient={null} />);

  fireEvent.click(screen.getByText("Registrar"));

  const nameInput = screen.getByLabelText("Nombre");

  fireEvent.change(nameInput, { target: { value: "Carlos" } });

  expect(nameInput.value).toBe("Carlos");
});
});
