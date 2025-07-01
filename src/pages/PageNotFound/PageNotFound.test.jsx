import { render, screen } from "@testing-library/react";
import PageNotFound from "./PageNotFound";

describe("PageNotFound", () => {
  it("muestra el mensaje de error 404", () => {
    render(<PageNotFound />);
    const mensaje = screen.getByText(/404 not found/i);
    expect(mensaje).toBeInTheDocument();
  });
});