import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import PatientLogs from "./PatientLogs";
import API from "../../service/API";
import { vi } from "vitest";

// Mock de AddPatientLogModal
vi.mock("./AddPatientLogModal", () => ({
  default: () => <div data-testid="modal-mock" />,
}));

// Mock de react-vertical-timeline-component
vi.mock("react-vertical-timeline-component", () => ({
  VerticalTimeline: ({ children }) => (
    <div data-testid="vertical-timeline">{children}</div>
  ),
  VerticalTimelineElement: ({
    children,
    date,
    iconOnClick,
  }) => (
    <div data-testid={`${date}`}>
      {date && <span>{date}</span>}
      {iconOnClick && (
        <button data-testid="icon-button" onClick={iconOnClick}>
          +
        </button>
      )}
      {children}
    </div>
  ),
}));

// Mock de la API
vi.mock("../../service/API", async () => {
  const actual = await vi.importActual("../../service/API");
  return {
    ...actual,
    default: {
      getPatientJournal: vi.fn(),
    },
    handleApiError: vi.fn(() => "Error mockeado"),
  };
});

describe("PatientLogs", () => {
  const logsPage1 = [
  {
    date: "2023-07-11T03:00:00Z", // UTC+0 → 2023-07-10 23:00 ARG
    log: "Primera entrada",
    tags: ["tag1", "tag2"],
  },
  {
    date: "2023-07-16T03:00:00Z", // UTC+0 → 2023-07-15 23:00 ARG
    log: "Segunda entrada",
    tags: ["tag3"],
  },
];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza correctamente los logs con fechas y tags", async () => {
    API.getPatientJournal.mockResolvedValueOnce({ data: { journal: logsPage1 } });

    render(<PatientLogs id="1" active="active" />);

    await waitFor(() => {
    expect(screen.getByTestId("2023-07-11T03:00:00Z")).toBeInTheDocument();
    expect(screen.getByTestId("2023-07-16T03:00:00Z")).toBeInTheDocument();
    });

    expect(screen.getByText("Primera entrada")).toBeInTheDocument();
    expect(screen.getByText("Segunda entrada")).toBeInTheDocument();
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.getByText("tag3")).toBeInTheDocument();
  });

  /* it("abre el modal al hacer click en el primer botón", async () => {
    API.getPatientJournal.mockResolvedValueOnce({ data: { journal: [] } });

    render(<PatientLogs id="1" active="active" />);

    const buttons = await screen.findAllByTestId("icon-button");
    fireEvent.click(buttons[0]);

    expect(screen.getByTestId("modal-mock")).toBeInTheDocument();
  });

  it("carga más entradas al hacer click en el segundo botón", async () => {
    API.getPatientJournal
      .mockResolvedValueOnce({ data: { journal: logsPage1 } }) // Página inicial
      .mockResolvedValueOnce({ data: { journal: logsPage2 } }); // Más entradas

    render(<PatientLogs id="1" active="active" />);

    await waitFor(() =>
      expect(screen.getByTestId("log-10 de jul")).toBeInTheDocument()
    );

    const buttons = await screen.findAllByTestId("icon-button");
    fireEvent.click(buttons[1]); // botón de "más entradas"

    await waitFor(() =>
      expect(screen.getByTestId("log-20 de jul")).toBeInTheDocument()
    );

    expect(screen.getByText("Tercera entrada")).toBeInTheDocument();
    expect(screen.getByText("tag4")).toBeInTheDocument();
  });

  it("maneja errores con handleApiError", async () => {
    const errorMock = new Error("Fallo");
    API.getPatientJournal.mockRejectedValueOnce(errorMock);

    render(<PatientLogs id="1" active="active" />);

    await waitFor(() => {
      expect(API.handleApiError).toHaveBeenCalledWith(errorMock);
    });
  }); */
});
