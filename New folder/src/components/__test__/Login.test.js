import { render, screen } from "@testing-library/react";
import Login from "../Login";

describe("Test the Login Component", () => {
  test("render the login form submit button on the screen", async () => {
    render(<Login />);
    const buttonList = await screen.findAllByRole("button");
    expect(buttonList).toHaveLength(2);
  });

  test("should first", () => {});
});
