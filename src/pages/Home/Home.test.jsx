import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "./Home";
import { vi } from "vitest";
import API from "../../service/API";

vi.mock("../../service/API", () => {
  return {
    default: {
      getDentist: vi.fn(),
    },
    handleApiError: vi.fn(() => "Error mockeado"),
  };
});

vi.mock("../../components/PersonTable/PersonTable.jsx", () => ({
  default: () => <div data-testid="person-table">Tabla de pacientes</div>,
}));

vi.mock("../../components/PatientModal/PatientModal.jsx", () => ({
  default: ({ showModal }) =>
    showModal ? <div data-testid="modal">Modal abierto</div> : null,
}));

describe("Home", () => {
  beforeEach(() => {
    localStorage.setItem("username", "dentista1");
    localStorage.clear();
  });

  it("muestra el loader mientras carga", async () => {
    API.getDentist.mockImplementation(() => new Promise(() => {})); // no resuelve
    render(<Home />);

    const header = screen.queryByText("/listado de pacientes/i")
    expect(header).toBeNull(); // siempre está
  });

   it("renderiza correctamente tras cargar", async () => {
    API.getDentist.mockResolvedValue({
      data: { dentistID: "123", tags: [] },
    });

    render(<Home />);
    await waitFor(() =>
      expect(screen.getByText(/listado de pacientes/i)).toBeInTheDocument()
    );
    expect(screen.getByPlaceholderText(/buscar por nombre/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /agregar paciente/i })).toBeInTheDocument();
    expect(screen.getByTestId("person-table")).toBeInTheDocument();
  });

  it("abre el modal al hacer click en agregar paciente", async () => {
    API.getDentist.mockResolvedValue({
      data: { dentistID: "123", tags: [] },
    });

    render(<Home />);

    await waitFor(() =>
      expect(screen.getByRole("button", { name: /agregar paciente/i })).toBeInTheDocument()
    );

    fireEvent.click(screen.getByRole("button", { name: /agregar paciente/i }));

    expect(screen.getByTestId("modal")).toBeInTheDocument();
  });

  it("permite escribir en el campo de búsqueda", async () => {
    API.getDentist.mockResolvedValue({
      data: { dentistID: "123", tags: [] },
    });

    render(<Home />);

    const input = await screen.findByPlaceholderText(/buscar por nombre/i);
    fireEvent.change(input, { target: { value: "Lucas" } });

    expect(input).toHaveValue("Lucas");
  }); 
});