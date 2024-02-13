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
  say("\nLet's play the Silly Sentence Game!");

  let sentence = "";
  const first_word = ask(
    `We will take turns adding a word to the end of a sentence until one of us ends it with a '.', '!' or '?'. 
    What should the first word be?\n   `,
  );
  sentence = first_word;

  const promptTemplate =
    `We are taking turns adding a word to the end of a sentence until one of us ends it 
    with a '.', '!' or '?'. Only add one word or ending punctuation, and ALWAYS send the existing 
    portion of the sentence with your new word at the end. Use a variety of adjectives, verbs, and nouns.
    Example 1: the current sentence is 'Hello my', you pick 'name', send only 'Hello my name'
    Example 2: current sentence = 'when the world is blue,', send 'when the world is blue, I'
    Example 3: current sentence = 'I wish I could fly, don't you', send 'I wish I could fly, don't you?'.
    Make sure you display the whole sentence and your new word or punctuation at the end.`;

  let next_word = "";

  // Referencing https://www.w3schools.com/js/js_string_search.asp#mark_includes for more flexible checking
  while (
    !next_word.includes("!") &&
    !next_word.includes(".") &&
    !next_word.includes("?")
  ) {
    sentence = await gptPrompt(
      `${promptTemplate} The current sentence is: '${sentence}'`,
      { max_tokens: 90, temperature: 1.2 },
    );

    say(`Add the next word:`);
    next_word = ask(`${sentence} `);
    sentence += ` ${next_word}`;
  }

  say(
    `\nOur final silly sentence is: 
    \n*\n\n"${sentence}"\n\n*\n
    Thanks for playing!`,
  );
}
