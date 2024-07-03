import { Router } from "itty-router";
import { InteractionResponseType, InteractionType, verifyKey } from "discord-interactions";
import JsonResponse from "./core/JsonResponse.js";
import { applicationComponentRouteHandler } from "./routes/applicationComponentRouteHandler.js";
import { messageComponentRouteHandler } from "./routes/messageComponentRouteHandler.js";

const router = Router();

router.get("/", (request, env) => {
  return new Response(`👋 ${env.DISCORD_APPLICATION_ID}`);
});

router.post("/", async (request, env) => {
  const message = await request.json();
  switch (message.type) {
    case InteractionType.PING:
      return new JsonResponse({ type: InteractionResponseType.PONG });
    case InteractionType.APPLICATION_COMMAND:
      return applicationComponentRouteHandler(message, env);
    case InteractionType.MESSAGE_COMPONENT:
      return messageComponentRouteHandler(message, env);
    default:
      console.error("Unknown Type");
      return new JsonResponse({ error: "Unknown Type" }, { status: 400 });
  }
});

router.all("*", () => new Response("Not Found.", { status: 404 }));

// Create and start the server
const startServer = async () => {
  const port = process.env.PORT || 3000;
  const env = {
    DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
    DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
  };

  addEventListener("fetch", event => {
    event.respondWith(router.handle(event.request, env));
  });

  console.log(`Server is running on port ${port}`);
};

startServer();
