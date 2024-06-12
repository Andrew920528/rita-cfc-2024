import React from "react";
import {render, screen} from "@testing-library/react";
import App from "../App";
import Home from "../pages/Home";
test("renders app", () => {
  render(<Home />);
  const linkElements = screen.getAllByText(/Rita/);
  linkElements.forEach((element) => {
    expect(element).toBeInTheDocument();
  });
});
