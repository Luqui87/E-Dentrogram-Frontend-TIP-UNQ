import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PacienteView from "./PacienteView";
import { toast } from "react-toastify";
import API, { handleApiError } from "../../service/API";

// Mocks
vi.mock("../../service/API", () => ({
  default: {
    getPatient: vi.fn(),
  },
  handleApiError: vi.fn(() => "Error mockeado"),
}));

vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
  },
}));

// Mock de subcomponentes para simplificar el test
vi.mock("../../components/PacienteCard/PacienteCard", () => ({
  default: () => <div>PacienteCard</div>,
}));

vi.mock("../../components/Odontograma/Odontograma", () => ({
  default: () => <div>Odontograma-Contenido</div>,
}));

vi.mock("../../components/Historial/Historial", () => ({
  default: () => <div>Historial-Contenido</div>,
}));

vi.mock("../../components/Comparar/Comparar", () => ({
  default: () => <div>Comparar-Contenido</div>,
}));

vi.mock("../../components/PatientsLogs/PatientLogs", () => ({
  default: () => <div>Bitacora-Contenido</div>,
}));

// Helper con router y params simulados
const renderWithRouter = (ui, { route = "/paciente/123" } = {}) => {
  window.history.pushState({}, "Test page", route);

  return render(
    <BrowserRouter>
      <Routes>
        <Route path="/paciente/:id" element={ui} />
      </Routes>
    </BrowserRouter>
  );
};

describe("PacienteView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("muestra el loader mientras carga", () => {
    API.getPatient.mockReturnValue(new Promise(() => {})); // nunca resuelve

    renderWithRouter(<PacienteView />);
    expect(screen.getByText((_, el) => el?.classList.contains("loader"))).toBeInTheDocument();
  });

  it("muestra datos del paciente al cargar exitosamente", async () => {
    API.getPatient.mockResolvedValue({
      data: {
        id: "123",
        teeth: [],
        name: "Juan Pérez",
      },
    });

    renderWithRouter(<PacienteView />);

    await waitFor(() => {
      expect(API.getPatient).toHaveBeenCalledWith("123");
      expect(screen.getByText("PacienteCard")).toBeInTheDocument();
      expect(screen.getByText("Odontograma-Contenido")).toBeInTheDocument();
    });
  });

  it("muestra un error si falla la carga del paciente", async () => {
    API.getPatient.mockRejectedValue(new Error("Fallo API"));

    renderWithRouter(<PacienteView />);

    await waitFor(() => {
      expect(handleApiError).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Error mockeado");
    });
  });

  it("permite cambiar de pestaña a Bitacora", async () => {
    API.getPatient.mockResolvedValue({
      data: {
        id: "123",
        teeth: [],
      },
    });

    renderWithRouter(<PacienteView />);

    await waitFor(() => {
      expect(screen.getByText("Odontograma-Contenido")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Bitacora"));

    expect(screen.getByText("Bitacora-Contenido")).toBeInTheDocument();
  });

  it("permite cambiar a la pestaña Comparar y forzar el tipo a Adulto", async () => {
    API.getPatient.mockResolvedValue({
      data: {
        id: "123",
        teeth: [],
      },
    });

    renderWithRouter(<PacienteView />);

    await waitFor(() => {
      expect(screen.getByText("Odontograma-Contenido")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText("Comparar"));

    expect(screen.getByText("Comparar-Contenido")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Adulto")).toBeInTheDocument();
  }); 
});
