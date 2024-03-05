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
      ask(
        `Yes, I have ${target_indices.length} ${card_id}'s\n>>Pass cards over`,
      );

      // Remove them from opponent.hand
      for (let i = 0; i < target_indices.length; i++) {
        // Save length of current hand
        let saved_length = opponent.hand.length;
        for (let j = 0; j < opponent.hand.length; j++) {
          if (opponent.hand.length < saved_length) {
            saved_length = opponent.hand.length;
          } else if (opponent.hand[j] === card_id) {
            opponent.hand.splice(j, 1);
          }
        }
      }
    } else {
      say(`Nope, I don't have any ${card_id}'s!`);
      ask(">>Go Fish!");
      this.goFish(opponent);
    }
    return this.hand, opponent.hand;
  }

  // TODO: Don't announce which card the opponent picks up unless it's right!
  goFish(opponent) {
    // Pick a card from "top of pile", add to hand, and take from deck
    this.hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);
    ask(`It's a ${this.hand[this.hand.length - 1]}!\n[hit enter]`);

    if (this.hand[this.hand.length - 1] === target_card) {
      say(`It's just what ${opponent} was looking for~ \n Go again!`);
      say(`Your cards are: ${this.hand}`);
      // TODO: Make player/gpt specific - function?
      getTargetCard(this);
      this.askForCard(opponent, target_card);
    } else {
      this.isMyTurn = false;
      return this.hand, opponent.hand;
    }
  }

  updateBooks() {
    const repeat_card_ids = [];
    const numOfRepeats = [];
    // Check each card in this.hand
    for (let i = 0; i < this.hand.length; i++) {
      const current_card_id = this.hand[i];
      // Check if value of current card is found after the current index & not already stored
      if (
        this.hand.indexOf(current_card_id, i + 1) != -1 &&
        repeat_card_ids.indexOf(current_card_id) === -1
      ) {
        // If there's a new repeat, add the value to repeat cards
        repeat_card_ids.push(current_card_id);
        let repeats = 0;
        // Then increment a counter whenever that value is found in the hand
        for (let j = 0; j < this.hand.length; j++) {
          // If the card is the same as the newest card added to the repeat_card_ids list
          if (this.hand[j] === repeat_card_ids[repeat_card_ids.length - 1]) {
            // Count it
            repeats++;
          }
        }
        numOfRepeats.push(repeats);
      }
    }
    ask(
      `Just looked for repeats.\n Your Hand: ${this.hand}, Repeat Cards: ${repeat_card_ids}, Each Repeats: ${numOfRepeats}\nYour Books: ${this.books}`,
    );
    // Save repeats of 4+ to books & pull those cards from active hand
    for (let i = 0; i < numOfRepeats.length; i++) {
      if (numOfRepeats[i] >= 4) {
        this.books.push(repeat_card_ids[i]);
        ask(`I just pushed ${repeat_card_ids[i]} to books!`);

        for (let j = this.hand.length; j > 0; j--) {
          // Remove them from this.hand
          if (this.hand[j] === repeat_card_ids[i]) {
            this.hand.splice(j, 1);
          }
        }
      }
    }
    ask(
      `Just pulled books from hand.\n Your Hand: ${this.hand}, Repeat Cards: ${repeat_card_ids}, Each Repeats: ${numOfRepeats}\nYour Books: ${this.books}`,
    );
    // Remove repeats from repeat array if they've been moved to books
    for (let i = repeat_card_ids.length; i > 0; i--) {
      // Remove them from repeat_card_ids
      if (this.books.indexOf(repeat_card_ids[i]) != -1) {
        repeat_card_ids.splice(i, 1);
        numOfRepeats.splice(i, 1);
      }
    }
    ask(
      `Just Pulled books from repeats.\n Your Hand: ${this.hand}, Repeat Cards: ${repeat_card_ids}, Each Repeats: ${numOfRepeats}\nYour Books: ${this.books}`,
    );
  }
}

const user = new Player(true, true, [], []); // User will always go first for now
const AI_player = new Player(false, false, [], []);

main();

// * MAIN FUNCTION
async function main() {
  startGame();
  while (playing) {
    showCurrentHands();

    if (user.isMyTurn) {
      getTargetCard(user);
      user.askForCard(AI_player, target_card);
    } else {
      say("Your opponent wants to know if you have any...");
      await getTargetCard(AI_player);
      AI_player.askForCard(user, target_card);
      ask(`Your current cards: ${user.hand}\n[hit enter]`);
      user.isMyTurn = true;
      // TODO: make sure to narrate.
    }
    user.updateBooks();
    // AI_player.updateBooks();
    // TODO: check for books/matches/points
    checkGameOver();
  }
}

function startGame() {
  // looks like shuffling 3 times helps randomize better from a perfect deck
  shuffleDeck(deck_of_cards, draw_pile);
  shuffleDeck(draw_pile, deck_of_cards);
  shuffleDeck(deck_of_cards, draw_pile);

  say("Let's play Go Fish!");
  // const rulesKnown = await ask("Do you know the rules?");

  say("I'll deal the cards...");
  dealCards(7);
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
  return newDeck;
}

function dealCards(numCards) {
  playing = true;
  // TODO: Can I do for each Player, deal 7 cards?
  for (let i = 0; i < numCards; i++) {
    // Deal a card to the user
    user.hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);

    // Deal a card to GPT
    AI_player.hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);
  }

  return;
}

function showCurrentHands() {
  say(`.\n`);
  say(`There are ${draw_pile.length} cards in the draw pile`);
  say(`Your opponent has ${AI_player.hand.length} cards`);
  say(`PSSST... They're ${AI_player.hand}`);
  // show books
  say(`Your cards are: ${user.hand}`);
  // show books
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

// function goFish() {
//   // Pick a card from "top of pile"
//   if (user.isMyTurn) {
//     // Add card to user hand and take from deck
//     user.hand.push(draw_pile[draw_pile.length - 1]);
//     draw_pile.pop(draw_pile[draw_pile.length - 1]);
//     say(`You picked up a ${user.hand[user.hand.length - 1]}!`);
//     if (user.hand[user.hand.length - 1] === target_card) {
//       say(`It's just what you were looking for~ \n Go again!`);
//       say(`Your cards are: ${user.hand}`);
//       target_card = ask("Which card would you like to ask for?");
//       doYouHaveAny(target_card);
//     } else {
//       user.isMyTurn = false;
//       return;
//     }
//   } else {
//     // GPT picks up a card
//     AI_player.hand.push(draw_pile[draw_pile.length - 1]);
//     draw_pile.pop(draw_pile[draw_pile.length - 1]);
//   }
//   return user.hand, AI_player.hand;
// }

async function getTargetCard(whosAsking) {
  if (whosAsking.isUser) {
    target_card = ask(
      "Which card would you like to ask for? Only respond with the letter or number: ",
    );
  } else {
    target_card = await gptPrompt(
      `We are playing a game of Go Fish! You may ask me if I have any one of the cards in your hand, 
      and the goal is to make sets ("books") of 4 matching cards, represented by numbers or letters. 
      Your hand is ${whosAsking.hand}.
      What card would you like to ask me for? Respond with ONLY ONE letter OR number that corresponds with a card in your hand. 10 is the only 2-digit exception.
      Example 1: your hand = [J, J, K, 1, 4, 5], your output = J
      Example 2: your hand = [A, 2, 2, 1, 6, Q], your output = 2
      Example 3: your hand = [10, 10, 3, J, 10, K], your output = 10
      I will read the string you return with javascript, so make sure it is only one number or letter.
      `,
    );
    say(`${target_card}'s?\n[hit enter]`);
  }
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
