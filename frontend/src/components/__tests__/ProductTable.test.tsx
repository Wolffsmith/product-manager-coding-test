import { render, screen, fireEvent } from "@testing-library/react";
import ProductTable from "../ProductTable";

const products = [
  { id: 1, name: "Available Product", available: true },
  { id: 2, name: "Unavailable Product", available: false },
];

describe("ProductTable", () => {
  it("disables delete button for available products", () => {
    render(<ProductTable products={products} handleDeleteProduct={() => {}} />);

    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });

    expect(deleteButtons[0]).toBeDisabled(); // Available product
    expect(deleteButtons[1]).not.toBeDisabled(); // Unavailable product
  });
});
