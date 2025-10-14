import { describe, it, expect, test } from "vitest";

import { App, LogInForm } from "../src/App";
import { Notifications } from "../src/routes/Notification";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";


test("responds with the user", async () => {
  const response = await fetch("https://api.example.com/user");

  await expect(response.json()).resolves.toEqual({
    id: "abc-123",
    firstName: "John",
    lastName: "Maverick",
  });
});

describe("App", () => {
  it("It renders Log-in form if user is null", () => {
    render(
      <BrowserRouter>
        <LogInForm user={null} />
      </BrowserRouter>,
    );

    const heading = screen.getByRole("heading", { name: "Log In" });
    expect(heading).toBeInTheDocument();
  });

  it("It renders Messaging app if user logs in and user is not null", () => {
    render(<LogInForm user={"Nikola"} />);
    const heading = screen.getByRole("heading", { name: "Nikola" });
    expect(heading).toBeInTheDocument();
  });

  it("It sets notificationsOpen state to true and renders Notifications component when user clicks Notifications button", () => {
    const mocksetNotificationsOpen = vi.fn();
    render(<LogInForm user={"Nikola"} />);
    const notificationButton = screen.getByRole("button", {
      name: "Notifications 0",
    });
    fireEvent.click(notificationButton);
    render(<Notifications notificationsOpen={true}  setNotificationsOpen={mocksetNotificationsOpen} />);

    //screen.debug();
  });

  it("It sets notificationsOpen state to false when user clicks close button and removes Notifications component", () => {
    const mocksetNotificationsOpen = vi.fn();
    render(<LogInForm user={"Nikola"} />);
   const {rerender} = render(
      <Notifications
        notificationsOpen={true}
        setNotificationsOpen={mocksetNotificationsOpen}
      />,
    );
    screen.debug();
    const closeNotificationButton = screen.getByRole("button", {
      name: "Close",
    });
    fireEvent.click(closeNotificationButton);

    rerender(<Notifications notificationsOpen={false}  setNotificationsOpen={mocksetNotificationsOpen}/>);

   
    
  });
});
