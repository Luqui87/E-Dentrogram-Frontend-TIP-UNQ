import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Register from "./Register";
import { BrowserRouter } from "react-router-dom";
import  API from "../../service/API";
import { vi } from "vitest";
import { toast } from "react-toastify";

vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../service/API", () => ({
  default: {
    register: vi.fn(() => Promise.resolve({ data: { accessToken: "fake-token" } })),
  },
  handleApiError: vi.fn(() => "Error simulado"),
}));


const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Register component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it("renderiza todos los inputs", () => {
    renderWithRouter(<Register />);

    expect(screen.getByText(/username/i)).toBeInTheDocument();
    expect(screen.getByText(/nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/email/i)).toBeInTheDocument();
    expect(screen.getByText('Contraseña')).toBeInTheDocument();
    expect(screen.getByText('Confirmar Contraseña')).toBeInTheDocument();
  });

  it("muestra advertencia si los campos están vacíos", async () => {
    renderWithRouter(<Register />);
    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));
    expect(await screen.findByText(/se deben completar todos los campos/i)).toBeInTheDocument();
  });

  it("muestra error si las contraseñas no coinciden", () => {
    renderWithRouter(<Register />);

    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), {
      target: { value: "OtraPassword" },
    });

    expect(screen.getByText(/contraseñas no coinciden/i)).toBeInTheDocument();
  });

   it("llama a API.register si todo es válido", async () => {
    API.register.mockResolvedValueOnce({
      data: { accessToken: "fakeToken" },
    });

    renderWithRouter(<Register />);

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: "user123" },
    });
    fireEvent.change(screen.getByLabelText(/nombre/i), {
      target: { value: "Juan Pérez" },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "juan@test.com" },
    });
    fireEvent.change(screen.getByLabelText('Contraseña'), {
      target: { value: "Password1" },
    });
    fireEvent.change(screen.getByLabelText('Confirmar Contraseña'), {
      target: { value: "Password1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /registrarse/i }));

    await waitFor(() => {
      expect(API.register).toHaveBeenCalledWith({
        username: "user123",
        name: "Juan Pérez",
        password: "Password1",
        email: "juan@test.com",
      });
    });

    expect(toast.success).toHaveBeenCalledWith("Dentista registrado exitosamente");
  });  
});