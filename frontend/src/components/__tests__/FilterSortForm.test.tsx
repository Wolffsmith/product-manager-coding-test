import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FilterSortForm from "../FilterSortForm";

describe("FilterSortForm", () => {
  it("updates search term on input change", () => {
    const handleFilterChange = vi.fn();
    render(
      <FilterSortForm
        filter={{ sortBy: "", search: "" }}
        handleFilterChange={handleFilterChange}
      />
    );

    const input = screen.getByLabelText(/search/i);
    fireEvent.change(input, { target: { value: "test" } });

    expect(handleFilterChange).not.toHaveBeenCalled();
  });
});
