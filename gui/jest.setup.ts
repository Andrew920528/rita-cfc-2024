import "@testing-library/jest-dom";
console.log(`============ testSetupFile Loaded ===========`);
jest.setTimeout(10000);

// mock environment variables
jest.mock("./src/global/constants", () => ({
  INDEPENDENT_MODE: false,
}));
