/**
 * This program prompts the user for a subject
 * and then uses GPT-4 language model to generate a lightbulb joke
 */

import { gptPrompt } from "../shared/ai.js";
import { ask, say } from "../shared/cli.js";

main();

async function main() {
  say("I'm going to tell you a lightbulb joke!");

  const topic = await ask("What kind of people should it be about?");

  say("");

  const prompt =
    `I want you to write a lightbulb joke about ${topic}. It should be funny and in the style of comedian Andrew Schultz.`;

  const joke = await gptPrompt(prompt, { temperature: 0.7 });
  say(`"""\n${joke}\n"""`);
}
