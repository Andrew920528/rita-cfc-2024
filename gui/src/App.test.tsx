import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import App from "./App";
import Home from "./pages/Home/Home";
import {renderWithProviders} from "./utils/test_utils";
import Login from "./pages/Login/Login";
import {
  MemoryRouter,
  Navigate,
  Route,
  RouterProvider,
  Routes,
  createMemoryRouter,
} from "react-router-dom";
import {dummyLoginData} from "./utils/constants";
import {link} from "fs";
import SignUp from "./pages/SignUp/SignUp";

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

// jest.mock("./utils/service", () => ({
//   useApiHandler: jest.fn(() => ({
//     apiHandler: jest.fn(() =>
//       Promise.resolve({
//         status: "success",
//         data: {
//           ...dummyLoginData,
//         },
//       })
//     ),
//     loading: false,
//     terminateResponse: jest.fn(),
//   })),
// }));
// describe("Login Page", () => {
//   beforeEach(() => {});
//   test("handles click", async () => {
//     renderWithProviders(
//       <MemoryRouter initialEntries={["/login"]}>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </MemoryRouter>
//     );

//     // Fill in dummy account
//     const nameField = screen.getByLabelText("username");
//     const passwordField = screen.getByLabelText("password");
//     fireEvent.change(nameField, {target: {value: "test_user"}});
//     fireEvent.change(passwordField, {target: {value: "123456"}});

//     const button = screen.getByRole("button", {name: /登入/i});
//     fireEvent.click(button);

//     // Assert that the header component renders with the username
//     await waitFor(() => {
//       const headerElement = screen.getByRole("button", {
//         name: /新增/,
//       });
//       expect(headerElement).toBeInTheDocument();
//     });
//   });

//   test("click on link navigates to signup page", async () => {
//     renderWithProviders(
//       <MemoryRouter initialEntries={["/login"]}>
//         <Routes>
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<Login />} />
//         </Routes>
//       </MemoryRouter>
//     );
//     const linkElement = screen.getByText(/註冊/i);
//     expect(linkElement).toBeInTheDocument();
//     fireEvent.click(linkElement);
//     await waitFor(() => {
//       const signupPage = screen.getByText(/註冊/i);
//       expect(signupPage).toBeInTheDocument();
//     });
//   });
// });
