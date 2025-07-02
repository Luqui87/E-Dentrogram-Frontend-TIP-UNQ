import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Historial from "./Historial";
import { vi } from "vitest";
import API from "../../service/API";

vi.mock("../../service/API", () => ({
  default: {
    getPatientRecord: vi.fn(),
  },
}));

const mockChanges = [
  {
    date: "2023-08-01T12:00:00.000Z",
    tooth_number: 3,
    before: [0, 1, 2, 3, 4, 5],
    after: [1, 2, 3, 4, 5, 6],
    dentistName: "Dr. Smith",
  },
  {
    date: "2023-08-02T12:00:00.000Z",
    tooth_number: 10,
    before: [0, 0, 0, 0, 0, 0],
    after: [1, 1, 1, 1, 1, 1],
    dentistName: "Dra. García",
  },
];

describe("Historial", () => {
  const baseProps = {
    id: "1",
    active: "active",
    rerender: false,
    setComparacion: vi.fn(),
    goToCompareTab: vi.fn(),
    comparacion: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra 'Cargando...' mientras se obtienen los datos", async () => {
    API.getPatientRecord.mockReturnValue(
      new Promise(() => {}) // nunca resuelve
    );

    render(<Historial {...baseProps} />);
    expect(await screen.findByText("Cargando...")).toBeInTheDocument();
  });

  it("muestra mensaje si no hay registros", async () => {
    API.getPatientRecord.mockResolvedValue({
      data: {
        records: [],
        total: 0,
      },
    });

    render(<Historial {...baseProps} />);
    expect(
      await screen.findByText("No hay registros disponibles.")
    ).toBeInTheDocument();
  });

  it("renderiza registros correctamente", async () => {
    API.getPatientRecord.mockResolvedValue({
      data: {
        records: mockChanges,
        total: mockChanges.length,
      },
    });

    render(<Historial {...baseProps} />);
    expect(await screen.findByText("Dr. Smith")).toBeInTheDocument();
    expect(await screen.findByText("Dra. García")).toBeInTheDocument();
  });

  it("permite seleccionar dos registros y mostrar botón de comparar", async () => {
    API.getPatientRecord.mockResolvedValue({
      data: {
        records: mockChanges,
        total: mockChanges.length,
      },
    });

    render(<Historial {...baseProps} />);
    const rows = await screen.findAllByRole("row");

    fireEvent.click(rows[0]); // Selecciona primer registro
    fireEvent.click(rows[1]); // Selecciona segundo registro

    const compareButton = await screen.findByRole("button", { name: /comparar/i });
    expect(compareButton).toBeInTheDocument();
  });

  /* it("llama a setComparacion y goToCompareTab al comparar", async () => {
    API.getPatientRecord.mockResolvedValue({
      data: {
        records: mockChanges,
        total: mockChanges.length,
      },
    });

    const setComparacion = vi.fn();
    const goToCompareTab = vi.fn();

    render(
      <Historial
        {...baseProps}
        setComparacion={setComparacion}
        goToCompareTab={goToCompareTab}
      />
    );

    const rows = await screen.findAllByRole("row");
    fireEvent.click(rows[0]);
    fireEvent.click(rows[1]);

    fireEvent.click(screen.getByRole("button", { name: /comparar/i }));

    await waitFor(() => {
      expect(setComparacion).toHaveBeenCalled();
      expect(goToCompareTab).toHaveBeenCalled();
    });
  }); */
});
