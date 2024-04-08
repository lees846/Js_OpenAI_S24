import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { gptPrompt } from "../shared/openai.ts";
import { createExitSignal, staticServer } from "../shared/server.ts";

import { Chalk } from "npm:chalk@5";
const chalk = new Chalk({ level: 1 });

const app = new Application();
const router = new Router();

// API routes
router.get("/api/gpt", async (ctx) => {
  // When html script accesses this url, the prompt
  // is sent to the api with fetch through here
  const playerName = ctx.request.url.searchParams.get("playerName");
  const playerPlace = ctx.request.url.searchParams.get("playerPlace");
  const limerickPrompt =
    `My name is ${playerName} and I am from ${playerPlace}. Create a limerick about me.`;
  const result = await gptPrompt(limerickPrompt);
  // Directly add response from api to html as string
  ctx.response.body = result;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal: createExitSignal() });
