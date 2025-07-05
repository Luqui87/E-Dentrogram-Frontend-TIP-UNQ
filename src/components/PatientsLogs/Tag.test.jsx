// Tag.test.jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Tag from "./Tag";

describe("Tag", () => {
  it("renderiza el texto del tag", () => {
    render(<Tag setTag={() => {}} isSelected={false}>Ortodoncia</Tag>);
    expect(screen.getByText("Ortodoncia")).toBeInTheDocument();
  });

  it("muestra el ícono AddIcon cuando no está seleccionado", () => {
    render(<Tag setTag={() => {}} isSelected={false}>Prótesis</Tag>);
    const icon = screen.getByTestId("add-icon");
    expect(icon).toBeInTheDocument();
  });
 
  it("muestra el ícono SelectedIcon cuando está seleccionado", () => {
    render(<Tag setTag={() => {}} isSelected={true}>Implantes</Tag>);
    const icon = screen.getByTestId("selected-icon");
    expect(icon).toBeInTheDocument();
  });

  it("cambia al ícono CloseIcon al hacer hover cuando está seleccionado", async () => {
  render(<Tag setTag={() => {}} isSelected={true}>Endodoncia</Tag>);
  const tagElement = screen.getByTestId("tag");
  
  fireEvent.mouseEnter(tagElement);

  await waitFor(() => {
    expect(screen.getByTestId("close-icon")).toBeInTheDocument();
  });

  fireEvent.mouseLeave(tagElement);

  await waitFor(() => {
    expect(screen.getByTestId("selected-icon")).toBeInTheDocument();
  });
});


  it("llama a setTag al hacer clic", () => {
    const setTagMock = vi.fn();
    render(<Tag setTag={setTagMock} isSelected={false}>Cirugía</Tag>);

    fireEvent.click(screen.getByText("Cirugía"));
    expect(setTagMock).toHaveBeenCalled();
  }); 
});
