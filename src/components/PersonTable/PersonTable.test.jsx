import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PersonTable from "./PersonTable";
import { vi } from "vitest";
import API from "../../service/API";
import { toast } from "react-toastify";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../service/API", () => ({
  default: {
    getDentistPatinet: vi.fn(),
    getDentistPatientByQuery: vi.fn(),
    removePatient: vi.fn(),
  },
  handleApiError: vi.fn((e) => "Mocked error"),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}));

// Mockear useNavigate antes de los tests:
const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const mockPatients = [
  {
    name: "Juan Perez",
    medicalRecord: "123",
    dni: "12345678",
    telephone: "5491123456789",
  },
  {
    name: "Maria Gomez",
    medicalRecord: "456",
    dni: "87654321",
    telephone: "5491198765432",
  },
];

describe("PersonTable", () => {
  const baseProps = {
    searchTerm: "",
    dentistId: "1",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  function renderWithRouter(ui) {
    return render(<BrowserRouter>{ui}</BrowserRouter>);
  }

  it("muestra loading y luego la tabla con pacientes", async () => {
    API.getDentistPatinet.mockResolvedValueOnce({
      data: { patients: mockPatients, pageSize: 10, total: 2 },
    });

    renderWithRouter(<PersonTable {...baseProps} />);

    expect(screen.getByText(/Cargando/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Juan Perez")).toBeInTheDocument();
      expect(screen.getByText("Maria Gomez")).toBeInTheDocument();
    });
  });

  it("muestra mensaje cuando no hay pacientes", async () => {
    API.getDentistPatinet.mockResolvedValueOnce({
      data: { patients: [], pageSize: 10, total: 0 },
    });

    renderWithRouter(<PersonTable {...baseProps} />);

    await waitFor(() => {
      expect(screen.getByText(/No hay pacientes/i)).toBeInTheDocument();
    });
  });

  it("navega al hacer click en una fila", async () => {
    API.getDentistPatinet.mockResolvedValueOnce({
        data: { patients: mockPatients, pageSize: 10, total: 2 },
    });

    renderWithRouter(<PersonTable {...baseProps} />);

    await waitFor(() => screen.getByText("Juan Perez"));

    fireEvent.click(screen.getByText("Juan Perez").closest("tr"));

    expect(navigateMock).toHaveBeenCalledWith("/paciente/123");
    });


  it("abre modal de confirmación al hacer click en borrar", async () => {
    API.getDentistPatinet.mockResolvedValueOnce({
      data: { patients: mockPatients, pageSize: 10, total: 2 },
    });

    renderWithRouter(<PersonTable {...baseProps} />);

    await waitFor(() => screen.getByText("Juan Perez"));

    const deleteButtons = screen.getAllByRole("button", { name: "" }); 

    fireEvent.click(deleteButtons[1]);

    expect(screen.getByText(/¿Estás seguro de que deseas eliminar al paciente/i)).toBeInTheDocument();
  });

  it("confirma eliminación y elimina paciente", async () => {
    API.getDentistPatinet.mockResolvedValueOnce({
      data: { patients: mockPatients, pageSize: 10, total: 2 },
    });
    API.removePatient.mockResolvedValueOnce({});

    renderWithRouter(<PersonTable {...baseProps} />);

    await waitFor(() => screen.getByText("Juan Perez"));

    const deleteButtons = screen.getAllByRole("button", { name: "" });
    fireEvent.click(deleteButtons[1]);

    const confirmButton = screen.getByText(/Confirmar/i);

    fireEvent.click(confirmButton);

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith("Se ha eliminado al paciente");
      expect(screen.queryByText("Juan Perez")).not.toBeInTheDocument();
    });
  });

  it("abre modal de edición al hacer click en editar", async () => {
    API.getDentistPatinet.mockResolvedValueOnce({
      data: { patients: mockPatients, pageSize: 10, total: 2 },
    });

    renderWithRouter(<PersonTable {...baseProps} />);

    await waitFor(() => screen.getByText("Juan Perez"));

    const editButtons = screen.getAllByRole("button", { name: "" });

    fireEvent.click(editButtons[0]); // primer botón es editar

    expect(screen.getByText(/Paciente/i)).toBeInTheDocument(); // asumiendo que PatientModal muestra un título con "Paciente"
  });

  it("cambia página al clickear paginación", async () => {
    API.getDentistPatinet.mockResolvedValue({
      data: { patients: mockPatients, pageSize: 10, total: 20 },
    });

    renderWithRouter(<PersonTable {...baseProps} />);

    await waitFor(() => screen.getByText("Juan Perez"));

    const page2 = screen.getByText("2");

    fireEvent.click(page2);

    expect(API.getDentistPatinet).toHaveBeenCalledTimes(2);
  });
});
