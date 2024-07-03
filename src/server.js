import { createServer } from "http";
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

const startServer = async () => {
  const port = process.env.PORT || 3000;
  const env = {
    DISCORD_APPLICATION_ID: process.env.DISCORD_APPLICATION_ID,
    DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
  };

  const server = createServer((req, res) => {
    const { method, url } = req;
    if (method === "POST" && url === "/") {
      let body = "";
      req.on("data", chunk => {
        body += chunk.toString();
      });
      req.on("end", async () => {
        const message = JSON.parse(body);
        switch (message.type) {
          case InteractionType.PING:
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ type: InteractionResponseType.PONG }));
            break;
          case InteractionType.APPLICATION_COMMAND:
            const response = await applicationComponentRouteHandler(message, env);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(response));
            break;
          case InteractionType.MESSAGE_COMPONENT:
            const componentResponse = await messageComponentRouteHandler(message, env);
            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(JSON.stringify(componentResponse));
            break;
          default:
            console.error("Unknown Type");
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Unknown Type" }));
        }
      });
    } else if (method === "GET" && url === "/") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end(`👋 ${env.DISCORD_APPLICATION_ID}`);
    } else {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not Found.");
    }
  });

  server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

startServer();
