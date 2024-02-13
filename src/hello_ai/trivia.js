/**
 * triva.js
 * Uses GPT to generate trivia questions based on a user-provided topic.
 * Uses GPT to evaluate the answers.
 *
 * Modified by Shayla Lee 02/16/2024
 * > I added logic to make the model indicate y/n to keep track of player score
 */
import { ask, say } from "../shared/cli.js";
import { gptPrompt } from "../shared/ai.js";

main();

async function main() {
  say("Hello, Player!");

  const topic = await ask("What do you want to be quizzed on?");

  const questionsString = await gptPrompt(
    `
    Generate 4 questions for a triva game. Do not provide answers.
    The topic is ${topic}.
    provide the questions as a javascript array of strings like this:
    ["question 1", "question 2", "question 3", "question 4"]

    Include only the array, start with [ and end with ].
    `,
    { max_tokens: 1024, temperature: 0.5 },
  );

  let score = 0;
  let questions = [];
  try {
    questions = JSON.parse(questionsString);
  } catch (_e) {
    say(`Error parsing questions string: "${questionsString}"`);
    end();
    return;
  }

  say("");

  for (const q of questions) {
    const a = await ask(q);
    const response = await gptPrompt(
      `
    The question was '${q}'.
    The provided answer was '${a}'.
    Was the answer correct?
    Be an easy grader. Accept answers that are close enough. Allow misspellings.
    Answer yes or no. If no, provide the correct answer.
    IMPORTANT: Every answer should start with the letter y or n to indicate whether the question is right or not.
    I will use this to check if I should add a point to their score.
    Examples: "y Yes, that is correct." "n No, the correct answer is fish."
    `,
      { max_tokens: 64, temperature: 0.1 },
    );
    // clip First letter from response and if y, increment score
    if (response[0] === "y") {
      score++;
    }

    const answer = response.slice(2); // Used GPT to remember the slice method
    say(answer);
    say("");
  }
  say(`You got ${score} out of ${questions.length} correct!`);
}
