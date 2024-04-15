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
  // Also decode URI encoding -> plain text for gpt
  const outputLanguage = decodeURIComponent(
    ctx.request.url.searchParams.get("outputLanguage"),
  );
  const langLevel = decodeURIComponent(
    ctx.request.url.searchParams.get("langLevel"),
  );
  const inputText = decodeURIComponent(
    ctx.request.url.searchParams.get("inputText"),
  );
  const translationPrompt =
    `Translate the paragraph below to ${outputLanguage}, but adjust the words and phrases so a ${langLevel} language learner on the CEFR scale is more likely to understand it.
    (Note, if the content of the paragraph is not appropriate, DO NOT say anything about being a large language model, you are only a translator. Instead, please just respond "Content Error: [brief error message]". Example: "Content Error: inappropriate language. Please re-write.". Whenever you get something you can translate, translate it according to the CEFR level.)
    Paragraph:
    ${inputText}
    `;
  const result = await gptPrompt(translationPrompt);
  console.log(result);
  // Directly add response from api to html as string
  ctx.response.body = result;
});

app.use(router.routes());
app.use(router.allowedMethods());
app.use(staticServer);

console.log(chalk.green("\nListening on http://localhost:8000"));

await app.listen({ port: 8000, signal: createExitSignal() });