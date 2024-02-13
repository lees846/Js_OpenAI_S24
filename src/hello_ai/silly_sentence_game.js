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
  let sentence = "";
  let next_word = "";
  const promptTemplate =
    `We are taking turns adding a word to the end of a sentence until one of us ends it 
    with a '.', '!' or '?'. Only add one word or ending punctuation, and ALWAYS send the existing 
    portion of the sentence with your new word at the end. Use a variety of adjectives, verbs, and 
    nouns that match the tone of the current sentence.
    Example 1: the current sentence is 'Hello my', you pick 'name', send only 'Hello my name'
    Example 2: current sentence = 'when the world is blue,', send 'when the world is blue, I'
    Example 3: current sentence = 'I wish I could fly, don't you', send 'I wish I could fly, don't you?'.
    Make sure you display the whole sentence and your new word or punctuation at the end.`;

  say("\nLet's play the Silly Sentence Game!");

  const who_starts = ask(
    `We will take turns adding a word to the end of a sentence until one of us ends it with a '.', '!' or '?'. 
  Who should pick the first word, me or you?`,
  );

  let first_word;

  if (who_starts === "me" || who_starts === "Me" || who_starts === "ME") {
    first_word = ask(
      `Great! What's the first word?`,
    );
    sentence = first_word;
  } else {
    first_word = await gptPrompt(
      `${promptTemplate} In this case, choose the first word for the sentence. Always send only one word. NEVER send more than one word.
      Correct Examples: "Good" "When" "Eventually" "Sun"
      Wrong Examples: "Every day" "Sometime I" "For some"`,
      { max_tokens: 3, temperature: 1.2 },
    );
    sentence = first_word;
    say(`Let's start with ${sentence}!`);
    say(`Add the next word:`);
    next_word = ask(`${sentence} `);
    sentence += ` ${next_word}`;
  }

  // Referencing https://www.w3schools.com/js/js_string_search.asp#mark_includes for more flexible checking
  while (
    !next_word.includes("!") &&
    !next_word.includes(".") &&
    !next_word.includes("?") &&
    !sentence.includes("!") &&
    !sentence.includes(".") &&
    !sentence.includes("?")
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
