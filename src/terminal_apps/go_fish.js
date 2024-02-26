/**
 * This program is a 2-player Go Fish! game that is played between
 * the user and the GPT API through the terminal.
 *
 * Shayla Lee Feb 25, 2024 - Mar, 2024
 */

import { gptPrompt } from "../shared/ai.js";
import { ask, say } from "../shared/cli.js";

const deck_of_cards = [
  "2",
  "2",
  "2",
  "2",
  "3",
  "3",
  "3",
  "3",
  "4",
  "4",
  "4",
  "4",
  "5",
  "5",
  "5",
  "5",
  "6",
  "6",
  "6",
  "6",
  "7",
  "7",
  "7",
  "7",
  "8",
  "8",
  "8",
  "8",
  "9",
  "9",
  "9",
  "9",
  "10",
  "10",
  "10",
  "10",
  "J",
  "J",
  "J",
  "J",
  "Q",
  "Q",
  "Q",
  "Q",
  "K",
  "K",
  "K",
  "K",
  "A",
  "A",
  "A",
  "A",
];
const discard_pile = [];
const user_hand = [];
const gpt_hand = []; // will never be shown to the user until the end of the game
let users_turn = true;
let playing = false;

main();

async function main() {
  shuffleDeck();
  say("Let's play Go Fish!");
  // const rulesKnown = await ask("Do you know the rules?");

  say("I'll deal the cards...");
  dealCards();

  // Game has started, this is where to make a "while playing"...
  while (playing) {
    showCurrentHands();

    // Check whose turn it is
    if (users_turn) {
      target_card = ask("Which card would you like to ask for?");
    } else {
      target_card = await gptPrompt(
        `We're playing Go Fish, here's your hand, here's the history, which card do you want to play?`,
      );
    }
    doYouHaveAny(target_card);
    checkForWinner();
  }
}

function shuffleDeck() {
  return;
}

function dealCards() {
  return;
}

function showCurrentHands() {
  say(`Your opponent has x cards`);
  say(`There are x cards in the discard pile`);
  say(`Your cards are: [array of cards]`);
}

function doYouHaveAny(card_num) {
  // if other player has card_num, transfer all of that number to asker
  say(`Yes, I have # x's`);
  // if not:
  say(`No I do not!`);
  goFish();

  return;
}

function goFish() {
  say("Go Fish!");
  // Draw top card from discard (last in discard_pile array)
  // Add to draw-er's hand
  return;
}

function checkForWinner() {
  if (someone_won) {
    playing = false;
  }
  return;
}
