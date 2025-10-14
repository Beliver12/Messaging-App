import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
  http.post(
    "http://localhost:8080/friends/notifications",
    async ({ request }) => {
      console.log("Intercepted POST /friends/notifications");
      return HttpResponse.json({ success: true });
    },
  ),
  http.post("http://localhost:8080/friends/openChat", async ({ request }) => {
    console.log("Intercepted POST /friends/openChat");
    return HttpResponse.json({ success: true });
  }),
];
