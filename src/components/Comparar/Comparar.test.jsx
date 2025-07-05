import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Comparar from "./Comparar";
import { vi } from "vitest";
import API from "../../service/API";
import { toast } from "react-toastify"; 

vi.mock("../../service/API", () => ({
  default: {
    getTeethAtDate: vi.fn(),
  },
  handleApiError: vi.fn(() => "Mocked error"),
}));

vi.mock("react-toastify", () => ({
  toast: {
    warning: vi.fn(),
    error: vi.fn(),
  },
}));


const mockTeeth1 = [{ number: 1, up: "HEALTHY", center: "HEALTHY" }];
const mockTeeth2 = [{ number: 1, up: "CARIES", center: "HEALTHY" }];

describe("Comparar", () => {
  const baseProps = {
    active: "active",
    type: "Adulto",
    id: "1",
    comparacion: [],
    setComparacion: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  vi.mock("react-datetime-picker", () => ({
  __esModule: true,
  default: ({ onChange, value, "data-testid": testId }) => {
    return (
      <input
        data-testid={testId}
        type="datetime-local"
        value={value?.toISOString().slice(0, 16) || ""}
        onChange={(e) => onChange(new Date(e.target.value))}
      />
    );
  },
}));


  it("muestra DateTimePicker si no hay fechas", () => {
    render(<Comparar {...baseProps} />);
    const before = screen.getByTestId('date-picker-before')
    const after = screen.getByTestId('date-picker-after')
    expect(before).toBeInTheDocument()
    expect(after).toBeInTheDocument()
  });

   it("renderiza ambos odontogramas al recibir 2 fechas en comparacion", async () => {
    API.getTeethAtDate
      .mockResolvedValueOnce({ data: mockTeeth1 }) // primera fecha
      .mockResolvedValueOnce({ data: mockTeeth2 }); // segunda fecha

    const props = {
      ...baseProps,
      comparacion: [
        { date: "2023-08-01T00:00:00.000Z" },
        { date: "2023-08-02T00:00:00.000Z" },
      ],
    };

    render(<Comparar {...props} />);

    expect(await screen.findAllByText(/Odontograma a la fecha/)).toHaveLength(2);
    expect(API.getTeethAtDate).toHaveBeenCalledTimes(2);
  });


  it("muestra loader si está cargando", async () => {
    API.getTeethAtDate.mockImplementation(() => new Promise(() => {})); // no resuelve

    const props = {
      ...baseProps,
      comparacion: [
        { date: "2023-08-01T00:00:00.000Z" },
        { date: "2023-08-02T00:00:00.000Z" },
      ],
    };

    render(<Comparar {...props} />);
    expect(await screen.findAllByText(/Odontograma a la fecha/)).toHaveLength(2);
    expect(screen.getAllByText("", { selector: ".loader" })).toHaveLength(2);
  });

  it("al seleccionar fechas manualmente, carga los odontogramas", async () => {
  API.getTeethAtDate
    .mockResolvedValueOnce({ data: mockTeeth1 }) // para la primera fecha
    .mockResolvedValueOnce({ data: mockTeeth2 }); // para la segunda

  render(<Comparar {...baseProps} />);

  const beforeInput = screen.getByTestId("date-picker-before");
  const afterInput = screen.getByTestId("date-picker-after");

  fireEvent.change(beforeInput, { target: { value: "2023-08-01T23:59" } });
  fireEvent.change(afterInput, { target: { value: "2023-08-02T23:59" } });

  await waitFor(() => {
    expect(API.getTeethAtDate).toHaveBeenCalledTimes(2);
  });
});


  it("resetea correctamente el estado al hacer click en el icono", async () => {
    API.getTeethAtDate
      .mockResolvedValueOnce({ data: mockTeeth1 })
      .mockResolvedValueOnce({ data: mockTeeth2 });

    const setComparacion = vi.fn();
    const props = {
      ...baseProps,
      comparacion: [
        { date: "2023-08-01T00:00:00.000Z" },
        { date: "2023-08-02T00:00:00.000Z" },
      ],
      setComparacion,
    };

    render(<Comparar {...props} />);
    const resetButton = await screen.findByTestId("reset-button");

    fireEvent.click(resetButton);

    expect(setComparacion).toHaveBeenCalledWith([]);
  });

  it("muestra advertencia si la segunda fecha es anterior", async () => {
    API.getTeethAtDate.mockResolvedValue({ data: [] });

    render(<Comparar {...baseProps} />);

    const beforeInput = screen.getByTestId("date-picker-before");
    const afterInput = screen.getByTestId("date-picker-after");

    fireEvent.change(beforeInput, { target: { value: "2023-08-03T23:59" } });
    fireEvent.change(afterInput, { target: { value: "2023-08-01T23:59" } });

    await waitFor(() => {
        expect(toast.warning).toHaveBeenCalledWith(
        "La segunda fecha seleccionada debe ser posterior a la primera"
        );
    });
    });


});
