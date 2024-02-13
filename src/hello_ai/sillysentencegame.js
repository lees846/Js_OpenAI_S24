/**
 * This file asks GPT to play the "Silly Sentence Game", something I used
 * to play with my family on car rides as a kid.
 *
 * In the live game, there are as many players as you want, but in this case
 * there will be two (one user and GPT). Each player takes turns adding a single word
 * to the end of the sentence after saying any part of the sentence that already
 * has been made until one player deems it the end of the sentence.
 *
 * Shayla Lee 02/12/24
 */

import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/ai.js";

main();

async function main() {
  say("Let's play the silly sentence game!");
  say(
    "We will take turns adding a word to the end of a sentence until someone ends it with a '.', '!' or '?'.",
  );
  let sentence = "";
}
