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
  let working_sentence = "";
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

  if (who_starts.toLowerCase() === "me") {
    first_word = ask(
      `Great! What's the first word?`,
    );
    working_sentence = first_word;
  } else {
    // ! I cannot make the AI pick different words each time even with different temps >:(
    first_word = await gptPrompt(
      `Let's create a sentence together by taking turns adding a word to the end. 
      Choose the first word for the sentence. Send only one word. NEVER send more than one word.
      Start with a character name, an interesting object, a time word, or an adverb.`,
      { max_tokens: 20, temperature: 0.5 },
    );
    working_sentence = first_word;
    say(`Let's start with ${working_sentence}!`);
    say(`Add the next word:`);
    next_word = ask(`${working_sentence} `);
    working_sentence += ` ${next_word}`;
  }

  // Referencing https://www.w3schools.com/js/js_string_search.asp#mark_includes for more flexible checking
  while (
    !next_word.includes("!") &&
    !next_word.includes(".") &&
    !next_word.includes("?") &&
    !working_sentence.includes("!") &&
    !working_sentence.includes(".") &&
    !working_sentence.includes("?")
  ) {
    working_sentence = await gptPrompt(
      `${promptTemplate} The current sentence is: '${working_sentence}'`,
      { max_tokens: 90, temperature: Math.random() },
    );

    say(`Add the next word:`);
    next_word = ask(`${working_sentence} `);
    working_sentence += ` ${next_word}`;
  }

  let final_sentence;
  // If working_sentence has a space before the last chtr, remove it
  // Referring to https://www.w3schools.com/jsref/jsref_replace.asp
  if (working_sentence.endsWith(" .")) {
    final_sentence = working_sentence.replace(" .", ".");
  } else if (working_sentence.endsWith(" !")) {
    final_sentence = working_sentence.replace(" !", "!");
  } else if (working_sentence.endsWith(" ?")) {
    final_sentence = working_sentence.replace(" ?", "?");
  } else {
    final_sentence = working_sentence;
  }

  say(
    `\nOur final silly sentence is: 
    \n*\n\n"${final_sentence}"\n\n*\n
    Thanks for playing!`,
  );
}
