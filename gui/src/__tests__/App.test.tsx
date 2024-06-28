import React from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import App from "../App";
import Home from "../pages/Home";
import {renderWithProviders} from "../utils/test_utils";
import Login from "../pages/Login";
import {MemoryRouter} from "react-router-dom";
import {loginService} from "../utils/service"; // Import the loginService
import {useApiHandler} from "../utils/service"; // Adjust path as necessary

test("renders app", () => {
  renderWithProviders(<Home />);
  const linkElements = screen.getAllByText(/Rita/);
  linkElements.forEach((element) => {
    expect(element).toBeInTheDocument();
  });
});

jest.mock("../utils/service", () => ({
  useApiHandler: jest.fn(() => useApiHandler), // Mock return value as needed
  loginService: jest.fn(() => Promise.resolve({success: true})), // Mock return value as needed
}));

describe("Login Page", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });
  test("handles click", () => {
    renderWithProviders(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // Fill in dummy account
    const nameField = screen.getByLabelText("username");
    const passwordField = screen.getByLabelText("password");
    fireEvent.change(nameField, {target: {value: "test user"}});
    fireEvent.change(passwordField, {target: {value: "123456"}});

    const button = screen.getByRole("button", {name: /登入/i});
    fireEvent.click(button);
    expect(loginService).toHaveBeenCalled();
  });
});
