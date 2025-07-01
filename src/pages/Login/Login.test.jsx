import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Login from "./Login";
import { BrowserRouter } from "react-router-dom";
import  API, {handleApiError } from "../../service/API";
import { toast } from "react-toastify";
import { useGoogleApi } from "react-gapi";

// Mocks
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

vi.mock("../../service/API", () => {
  return {
    default: {
      login: vi.fn(),
      loginGoogle: vi.fn(),
      // podés mockear otras funciones si las necesitás
    },
    handleApiError: vi.fn(() => "Error mockeado"),
  };
});


vi.mock("react-toastify", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("react-gapi", () => ({
  useGoogleApi: vi.fn(),
}));

vi.mock("../../components/GoogleAuth", () => ({
  default: ({ handleGoogleLogin }) => (
    <button onClick={handleGoogleLogin}>Google Login</button>
  ),
}));

const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Login Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renderiza correctamente los campos", () => {
    renderWithRouter(<Login />);
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByLabelText(/Username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    expect(screen.getByText("Ingresar")).toBeInTheDocument();
  });

   it("muestra advertencia si los campos están vacíos", () => {
    renderWithRouter(<Login />);
    fireEvent.click(screen.getByText("Ingresar"));
    expect(
      screen.getByText("*Se deben completar todos los campos")
    ).toBeInTheDocument();
  });

  it("realiza login exitoso", async () => {
    API.login.mockResolvedValue({
      data: { accessToken: "fake-token" },
    });

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "lucas" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "1234" },
    });

    fireEvent.click(screen.getByText("Ingresar"));

    await waitFor(() => {
      expect(API.login).toHaveBeenCalledWith({
        username: "lucas",
        password: "1234",
      });
      expect(localStorage.getItem("token")).toBe("fake-token");
      expect(toast.success).toHaveBeenCalledWith("Dentista ingresado exitosamente");
    });
  });

    
  it("muestra error en login fallido", async () => {
    API.login.mockRejectedValue(new Error("Credenciales inválidas"));

    renderWithRouter(<Login />);
    fireEvent.change(screen.getByLabelText(/Username/i), {
      target: { value: "lucas" },
    });
    fireEvent.change(screen.getByLabelText(/Contraseña/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByText("Ingresar"));

    await waitFor(() => {
      expect(handleApiError).toHaveBeenCalled();
      expect(toast.error).toHaveBeenCalledWith("Error mockeado");
    });
  });

    
  it("realiza login con Google correctamente", async () => {
    const signInMock = vi.fn().mockResolvedValue({
      xc: { id_token: "google-token" },
    });

    useGoogleApi.mockReturnValue({
      auth2: { getAuthInstance: () => ({ signIn: signInMock }) },
    });

    API.loginGoogle.mockResolvedValue({
      data: { accessToken: "access-token" },
    });

    renderWithRouter(<Login />);
    fireEvent.click(screen.getByText("Google Login"));

    await waitFor(() => {
      expect(signInMock).toHaveBeenCalled();
      expect(API.loginGoogle).toHaveBeenCalledWith({ token: "google-token" });
      expect(localStorage.getItem("token")).toBe("access-token");
      expect(localStorage.getItem("GoogleToken")).toBe("google-token");
    });
  }); 
});
