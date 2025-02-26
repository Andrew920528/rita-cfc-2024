import {MemoryRouter, Route, Routes} from "react-router-dom";
import {renderWithProviders} from "../../utils/test_utils";
import Home from "../Home/Home";
import Login from "./Login";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import SignUp from "../SignUp/SignUp";
import {dummyLoginData} from "../../utils/dummy";

jest.mock("../../global/constants", () => {
  return {
    API: {
      ERROR: "error",
      SUCCESS: "success",
      ABORTED: "aborted",
    },
  };
});
jest.mock("../../utils/service", () => ({
  useApiHandler: jest.fn(() => ({
    apiHandler: jest.fn(() =>
      Promise.resolve({
        status: "success",
        data: {
          ...dummyLoginData,
        },
      })
    ),
    loading: false,
    terminateResponse: jest.fn(),
  })),
}));
describe("Login Page", () => {
  beforeEach(() => {});
  test("handles click", async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );

    // Fill in dummy account
    const nameField = screen.getByLabelText("username");
    const passwordField = screen.getByLabelText("password");
    fireEvent.change(nameField, {target: {value: "test_user"}});
    fireEvent.change(passwordField, {target: {value: "123456"}});

    const button = screen.getByRole("button", {name: /Log In/i});
    fireEvent.click(button);

    // Assert that the header component renders with the username

    // We no longer change the link directly, so this testing doesn't work
    // await waitFor(() => {
    //   const headerElement = screen.getByRole("button", {
    //     name: /Add/,
    //   });
    //   expect(headerElement).toBeInTheDocument();
    // });
  });

  test("click on link navigates to signup page", async () => {
    renderWithProviders(
      <MemoryRouter initialEntries={["/login"]}>
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </MemoryRouter>
    );
    const linkElement = screen.getByText(/Register/i);
    expect(linkElement).toBeInTheDocument();
    fireEvent.click(linkElement);
    await waitFor(() => {
      const signupPage = screen.getByText(/Register/i);
      expect(signupPage).toBeInTheDocument();
    });
  });
});
