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
  say("\nLet's play the silly sentence game!");

  let sentence = "";
  const first_word = ask(
    `We will take turns adding a word to the end of a sentence until one of us 
    ends it with a '.', '!' or '?'. What should the first word be?\n`,
  );
  sentence = first_word;

  const promptTemplate =
    `We are taking turns adding a word to the end of a sentence until one of us ends it 
    with a '.', '!' or '?'. Only add one word or ending punctuation, and always send the existing 
    portion of the sentence with your new word at the end. Use a variety of adjectives, verbs, and nouns.
    Example: the current sentence is 'Hello my', you pick 'name', send only 'Hello my name'.`;

  let next_word = "";

  while (
    next_word != "!" &&
    next_word != "." &&
    next_word != "?"
  ) {
    sentence = await gptPrompt(
      `${promptTemplate} The current sentence is: '${sentence}'`,
      { max_tokens: 50, temperature: 0.7 },
    );

    say(`Add the next word:`);
    next_word = ask(`${sentence} `);
    sentence += ` ${next_word}`;
  }

  say(`/n Our final silly sentence is: \n***\n"${sentence}"\n***\n`);
}
