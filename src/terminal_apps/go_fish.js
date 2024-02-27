/**
 * This program is a 2-player Go Fish! game that is played between
 * the user and the GPT API through the terminal.
 *
 * Shayla Lee Feb 25, 2024 - Mar, 2024
 *
 * Learned about the Fisher-Yates Shuffle algorithm https://bost.ocks.org/mike/shuffle/
 * to randomize the deck of cards
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
const draw_pile = [];
const user_hand = [];
const gpt_hand = []; // will never be shown to the user until the end of the game
let users_turn = true;
let playing = false;

main();

async function main() {
  shuffleDeck(deck_of_cards);
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

function shuffleDeck(deck) {
  // Implementation based on https://bost.ocks.org/mike/shuffle/
  let remaining_elements = deck.length;
  let card_to_move;

  // While there are still cards in the deck
  while (remaining_elements > 0) {
    // Select a card from the cards that are there
    card_to_move = Math.floor(Math.random() * remaining_elements--);

    // Add it to the shuffled draw pile
    draw_pile.push(deck.splice(card_to_move, 1)[0]);
  }
  console.log(draw_pile);
  return draw_pile;
}

function dealCards() {
  playing = true;
  for (let i = 0; i < 7; i++) {
    // Deal a card to the user
    user_hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);

    // Deal a card to GPT
    gpt_hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);
  }
  // console.log(`Draw pile: ${draw_pile.length}`);
  // console.log(`GPT hand: ${gpt_hand.length} cards, ${gpt_hand}`);
  // console.log(`User hand: ${user_hand.length} cards, ${user_hand}`);

  return;
}

function showCurrentHands() {
  say(`.\n`);
  say(`There are ${draw_pile.length} cards in the draw pile`);
  say(`Your opponent has ${gpt_hand.length} cards`);
  say(`Your cards are: ${user_hand}`);
  say(`\n.`);
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
