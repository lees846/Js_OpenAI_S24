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
let playing = false;
let target_card;

class Player {
  constructor(isUser, isMyTurn, hand, books) {
    this.isUser = isUser;
    this.isMyTurn = isMyTurn;
    this.hand = hand;
    this.books = books; // a book is a set of 4 cards, all the same number
  }

  askForCard(opponent, card_id) {
    // Check who's asking
    // TODO: check if user has the card they asked for (later)
    // Check opponent's hand for target_number
    if (opponent.hand.indexOf(card_id) != -1) {
      const target_indices = [];
      for (let i = 0; i < opponent.hand.length; i++) {
        // Add each matching card to this.hand
        if (opponent.hand[i] === card_id) {
          this.hand.push(opponent.hand[i]);
          target_indices.push(i);
        }
      }
      say(`Yes, I have ${target_indices.length} ${card_id}'s`);

      // Remove them from opponent.hand
      for (let i = 0; i < target_indices.length; i++) {
        opponent.hand.splice(i, 1);
      }
    } else {
      say(`Nope, I don't have any ${card_id}'s!`);
      say("Go Fish!");
      goFish();
    }
  }
}

const user = new Player(true, true, [], []); // User will always go first for now
const AI_player = new Player(false, false, [], []);

main();

async function main() {
  // looks like shuffling 3 times helps randomize better from a perfect deck
  shuffleDeck(deck_of_cards, draw_pile);
  shuffleDeck(draw_pile, deck_of_cards);
  shuffleDeck(deck_of_cards, draw_pile);

  say("Let's play Go Fish!");
  // const rulesKnown = await ask("Do you know the rules?");

  say("I'll deal the cards...");
  dealCards();

  // Game has started, this is where to make a "while playing"...
  while (playing) {
    showCurrentHands();
    ask(`It's ${user.isMyTurn} that it's your turn. Quit?`);
    if (user.isMyTurn) {
      target_card = ask(
        "Which card would you like to ask for? Only respond with the letter or number: ",
      );
      user.askForCard(AI_player, target_card);
    } else {
      console.log(
        "I would now send a prompt to GPT asking what card it wants to ask for",
      );
      // TODO: ask gpt to define target card
      // AI_player.askForCard(user, target_card)
    }
    // TODO: check for books/matches/points
    checkGameOver();
    ask(`It's ${user.isMyTurn} that it's your turn. Quit?`);
  }
}

// TODO: Currently making both hands fairly similar 02/27/24
// 03/03/24: Call >1x for better shuffle
function shuffleDeck(deck, newDeck) {
  // Implementation based on https://bost.ocks.org/mike/shuffle/
  let remaining_elements = deck.length;
  let card_to_move;

  // While there are still cards in the deck
  while (remaining_elements > 0) {
    // Select a card from the cards that are there
    card_to_move = Math.floor(Math.random() * remaining_elements--);

    // Add it to the shuffled draw pile
    newDeck.push(deck.splice(card_to_move, 1)[0]);
  }
  console.log(newDeck);
  return newDeck;
}

function dealCards() {
  playing = true;
  for (let i = 0; i < 7; i++) {
    // Deal a card to the user
    user.hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);

    // Deal a card to GPT
    AI_player.hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);
  }
  // console.log(`Draw pile: ${draw_pile.length}`);
  console.log(
    `Pssst... GPT hand: ${AI_player.hand.length} cards, ${AI_player.hand}`,
  );
  // console.log(`User hand: ${user.hand.length} cards, ${user.hand}`);

  return;
}

function showCurrentHands() {
  say(`.\n`);
  say(`There are ${draw_pile.length} cards in the draw pile`);
  say(`Your opponent has ${AI_player.hand.length} cards`);
  say(`Your cards are: ${user.hand}`);
  say(`\n.`);
}

function doYouHaveAny(card_id) {
  // Check who's asking
  if (user.isMyTurn) {
    // TODO: check if user has the card they asked for (later)
    // Check AI_player.hand for target_number
    if (AI_player.hand.indexOf(card_id) != -1) {
      const target_indices = [];
      // Check each index of AI_player.hand
      for (let i = 0; i < AI_player.hand.length; i++) {
        // Add each match to user's hand
        if (AI_player.hand[i] === card_id) {
          user.hand.push(AI_player.hand[i]);
          target_indices.push(i);
        }
      }
      say(`Yes, I have ${target_indices.length} ${card_id}'s`);

      // Remove them from AI_player.hand
      for (let i = 0; i < target_indices.length; i++) {
        AI_player.hand.splice(i, 1);
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
  if (user.isMyTurn) {
    // Add card to user hand and take from deck
    user.hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);
    say(`You picked up a ${user.hand[user.hand.length - 1]}!`);
    if (user.hand[user.hand.length - 1] === target_card) {
      say(`It's just what you were looking for~ \n Go again!`);
      say(`Your cards are: ${user.hand}`);
      target_card = ask("Which card would you like to ask for?");
      doYouHaveAny(target_card);
    } else {
      user.isMyTurn = false;
      return;
    }
  } else {
    // GPT picks up a card
    AI_player.hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);
  }
  return user.hand, AI_player.hand;
}

function checkGameOver() {
  if (draw_pile.length <= 0 || AI_player.hand <= 0 || user.hand <= 0) {
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
