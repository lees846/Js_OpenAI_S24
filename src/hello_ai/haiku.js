/**
 * This program prompts the user to enter their name and hometown
 * and then uses GPT-3 language model to generate a haiku about the user.
 */

import { gptPrompt } from "../shared/ai.js";
import { ask, say } from "../shared/cli.js";

main();

async function main() {
  say("Hello, GPT!");

  const name = await ask("What is your name?");
  const passtime = await ask("What's one of your hobbies?");

  say("");

  const prompt =
    `My name is ${name} and I like to do ${passtime} in my free time. Create a haiku about me.`;

  const haiku = await gptPrompt(prompt, { temperature: 0.7 });
  say(`"""\n${haiku}\n"""`);
}
