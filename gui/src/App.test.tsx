import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import App from "./App";
import Home from "./pages/Home/Home";
import {renderWithProviders} from "./utils/test_utils";
import Login from "./pages/Login/Login";
import {MemoryRouter} from "react-router-dom";

test("renders app", () => {
  renderWithProviders(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );
  const linkElements = screen.getAllByText(/Rita/);
  linkElements.forEach((element) => {
    expect(element).toBeInTheDocument();
  });
});
