import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, act } from "@testing-library/react";
import QR from "./QR";
import API, { handleApiError } from "../../service/API";
import { afterEach } from "vitest";

// Mock de la API
vi.mock("../../service/API", async () => {
  const actual = await vi.importActual("../../service/API");
  return {
    ...actual,
    default: {
      ...actual.default,
      getWhatsappQr: vi.fn(),
    },
    handleApiError: vi.fn(),
  };
});

// Mock del componente QR
vi.mock("react-qr-code", () => ({
  default: ({ value }) => <div data-testid="mocked-qr-code">QR: {value}</div>,
}));

describe("QR", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.useRealTimers(); // Por si algún test usa fakeTimers
  });

  it("debe mostrar el mensaje de carga mientras espera la respuesta", () => {
    API.getWhatsappQr.mockReturnValue(new Promise(() => {})); // Nunca resuelve
    render(<QR />);
    expect(screen.getByText("Cargando código QR...")).toBeInTheDocument();
  });

  it("debe renderizar el código QR cuando se recibe una respuesta exitosa", async () => {
    API.getWhatsappQr.mockResolvedValue({
      data: { qr: "http://example.com/qr" },
    });

    render(<QR />);

    await waitFor(() =>
      expect(screen.getByText("Escanea este QR con WhatsApp para poder vincularte:")).toBeInTheDocument()
    );

    const qrMock = screen.getByTestId("mocked-qr-code");
    expect(qrMock).toBeInTheDocument();
    expect(qrMock).toHaveTextContent("QR: http://example.com/qr");
  });

  it("debe mostrar que ya está vinculado si el backend responde con 404", async () => {
    API.getWhatsappQr.mockRejectedValue({
      response: { status: 404 },
    });

    render(<QR />);

    await waitFor(() =>
      expect(screen.getByText("El sistema ya se encuentra vinculado.")).toBeInTheDocument()
    );
  });

  it("debe manejar errores genéricos mostrando mensaje de error", async () => {
    API.getWhatsappQr.mockRejectedValue(new Error("Error de red"));

    render(<QR />);

    await waitFor(() =>
      expect(screen.getByText("No se pudo cargar el código QR")).toBeInTheDocument()
    );
  });



});
