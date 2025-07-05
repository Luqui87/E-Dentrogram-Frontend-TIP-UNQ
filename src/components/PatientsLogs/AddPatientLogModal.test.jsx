import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import AddPatientLogModal from "./AddPatientLogModal";
import API, { handleApiError } from "../../service/API";


vi.mock("../../service/API", async () => {
  const actual = await vi.importActual("../../service/API");
  return {
    ...actual,
    default: {
      ...actual.default,
      postPatientJournal: vi.fn(),
    },
    handleApiError: vi.fn(),
  };
});

vi.mock("../Modal", () => ({
  default: ({ isOpen, onClose, children }) =>
    isOpen ? <div data-testid="modal">{children}</div> : null,
}));

vi.mock("./Tag", () => ({
  default: ({ children, setTag, isSelected }) => (
    <span
      data-testid={`tag-${children}`}
      onClick={setTag}
      style={{ color: isSelected ? "red" : "black" }}
    >
      {children}
    </span>
  ),
}));

describe("AddPatientLogModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.setItem("userTags", JSON.stringify(["tag1", "tag2"]));
  });

  it("renderiza correctamente con tags y textarea vacío", () => {
    render(
      <AddPatientLogModal
        isOpen={true}
        onClose={vi.fn()}
        handleAddLog={vi.fn()}
        id="1"
      />
    );

    expect(screen.getByText("Ingresar Registro a la Bitacora")).toBeInTheDocument();
    expect(screen.getByText("tag1")).toBeInTheDocument();
    expect(screen.getByText("tag2")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toHaveValue("");
  });

   it("permite escribir en el textarea", () => {
    render(
      <AddPatientLogModal
        isOpen={true}
        onClose={vi.fn()}
        handleAddLog={vi.fn()}
        id="1"
      />
    );

    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Descripción de prueba" } });

    expect(textarea).toHaveValue("Descripción de prueba");
  });

   it("permite seleccionar y deseleccionar tags", () => {
    render(
      <AddPatientLogModal
        isOpen={true}
        onClose={vi.fn()}
        handleAddLog={vi.fn()}
        id="1"
      />
    );

    const tag1 = screen.getByTestId("tag-tag1");
    const tag2 = screen.getByTestId("tag-tag2");

    fireEvent.click(tag1);
    fireEvent.click(tag2);
    fireEvent.click(tag1); // deseleccionar tag1

    expect(tag1).toHaveStyle({ color: "rgb(0, 0, 0)" });
    expect(tag2).toHaveStyle({ color: "rgb(255, 0, 0)" });
  });

  it("llama a postPatientJournal y handleAddLog al confirmar", async () => {
  const handleAddLog = vi.fn();
  const onClose = vi.fn();
  API.postPatientJournal.mockResolvedValueOnce({});

  render(
    <AddPatientLogModal
      isOpen={true}
      onClose={onClose}
      handleAddLog={handleAddLog}
      id="1"
    />
  );

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "Texto de entrada" },
  });

  fireEvent.click(screen.getByTestId("tag-tag1"));
  fireEvent.click(screen.getByText("Confirmar"));

  await waitFor(() => {
    expect(API.postPatientJournal).toHaveBeenCalled();
    expect(handleAddLog).toHaveBeenCalledWith(
      expect.objectContaining({
        log: "Texto de entrada",
        tags: ["tag1"],
      })
    );
    expect(onClose).toHaveBeenCalled();
  });
});


  it("maneja errores llamando a handleApiError", async () => {
    const error = new Error("Fallo");
    API.postPatientJournal.mockRejectedValueOnce(error);

    render(
        <AddPatientLogModal
        isOpen={true}
        onClose={vi.fn()}
        handleAddLog={vi.fn()}
        id="1"
        />
    );

    fireEvent.change(screen.getByRole("textbox"), {
        target: { value: "Descripción con error" },
    });
    fireEvent.click(screen.getByText("Confirmar"));

    await waitFor(() => {
        expect(API.postPatientJournal).toHaveBeenCalled();
        expect(handleApiError).toHaveBeenCalledWith(error);
    });
});
  
});
