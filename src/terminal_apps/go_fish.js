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

// Array of cards with just one number or letter, no suits
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
const users_books = []; // a book is a set of 4 cards, all the same number
const gpt_hand = []; // will never be shown to the user until the end of the game
const gpts_books = [];
let isUsersTurn = true;
let playing = false;
let target_card;

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
    ask(`It's ${isUsersTurn} that it's your turn. Quit?`);
    if (isUsersTurn) {
      usersTurn();
    } else {
      console.log(
        "I would now send a prompt to GPT asking what card it wants to ask for",
      );
      // gptsTurn();
    }
    // TODO: check for books/matches/points
    checkGameOver();
    ask(`It's ${isUsersTurn} that it's your turn. Quit?`);
  }
}

// TODO: Currently making both hands fairly similar 02/27/24
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
  console.log(`Pssst... GPT hand: ${gpt_hand.length} cards, ${gpt_hand}`);
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

function usersTurn() {
  target_card = ask(
    "Which card would you like to ask for? Only respond with the letter or number: ",
  );
  doYouHaveAny(target_card);
}

async function gptsTurn() {
  target_card = await gptPrompt(
    `We're playing Go Fish, here's your hand, here's the history, which card do you want to play?`,
  );
  doYouHaveAny(target_card);
}

function doYouHaveAny(card_id) {
  // Check who's asking
  if (isUsersTurn) {
    // TODO: check if user has the card they asked for (later)
    // Check gpt_hand for target_number
    if (gpt_hand.indexOf(card_id) != -1) {
      const target_indices = [];
      // Check each index of gpt_hand
      for (let i = 0; i < gpt_hand.length; i++) {
        // Add each match to user's hand
        if (gpt_hand[i] === card_id) {
          user_hand.push(gpt_hand[i]);
          target_indices.push(i);
        }
      }
      say(`Yes, I have ${target_indices.length} ${card_id}'s`);

      // Remove them from gpt_hand
      for (let i = 0; i < target_indices.length; i++) {
        gpt_hand.splice(i, 1);
      }
    } else {
      say(`Nope, I don't have any ${card_id}'s!`);
      say("Go Fish!");
      goFish();
    }
  } else {
    // TODO: GPT Turn
  }

  return;
}

function goFish() {
  // Pick a card from "top of pile"
  if (isUsersTurn) {
    // Add card to user hand and take from deck
    user_hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);
    say(`You picked up a ${user_hand[user_hand.length - 1]}!`);
    if (user_hand[user_hand.length - 1] === target_card) {
      say(`It's just what you were looking for~ \n Go again!`);
      target_card = ask("Which card would you like to ask for?");
      doYouHaveAny(target_card);
    } else {
      isUsersTurn = false;
      return;
    }
  } else {
    // GPT picks up a card
    gpt_hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);
  }
  return user_hand, gpt_hand;
}

function checkGameOver() {
  if (draw_pile.length <= 0 || gpt_hand <= 0 || user_hand <= 0) {
    whoWon();
    // TODO: ask what's next
    // TODO: clear hands and start over
    playing = false;
  } else {
    return; // keep playing
  }
}

function whoWon() {
  // TODO: say who won
  return;
}
