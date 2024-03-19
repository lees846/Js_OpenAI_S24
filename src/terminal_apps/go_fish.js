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
import boxen from "boxen";

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

// Variables for card graphics
const redCard = "1";
const whiteCard = "7";
const yellowCard = "3";

class Player {
  constructor(isUser, isMyTurn, hand, books, recentAsks) {
    this.isUser = isUser;
    this.isMyTurn = isMyTurn;
    this.hand = hand;
    this.books = books; // a book is a set of 4 cards, all the same number
    this.recentAsks = recentAsks;
  }

  askForCard(opponent, card_id) {
    // TODO: check if user has the card they want to ask for (later)
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
      // TODO: Singular vs. Plural
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
      if (!user.isMyTurn) {
        say(`((You currently have: ${user.hand}))`);
      }
      say(`Nope, I don't have any ${card_id}'s!`);
      ask(">>Go Fish!");
      this.goFish(opponent);
    }
    return this.hand, opponent.hand;
  }

  // TODO: Make sure GPT can go multiple times in a row
  goFish(opponent) {
    // Pick a card from "top of pile", add to hand, and take from deck
    this.hand.push(draw_pile[draw_pile.length - 1]);
    draw_pile.pop(draw_pile[draw_pile.length - 1]);

    // Different action depending on player vs. AI:
    if (!this.isUser) {
      ask(`They picked up a card...\n>>`);
      // Check if the card picked up is what they wanted
      if (this.hand[this.hand.length - 1] === target_card) {
        ask(`It's just the card I was looking for~ \n >>I'll go again!`);
        this.updateBooks("Opponent's");
        getTargetCard(this);
        this.askForCard(opponent, target_card);
      } else {
        this.isMyTurn = false;
        opponent.isMyTurn = true;
      }
    } else { // if this.isUser
      ask(`I picked up a ${this.hand[this.hand.length - 1]}!\n>>`); //TODO: "an Ace"
      if (this.hand[this.hand.length - 1] === target_card) {
        ask(`It's just the card you were looking for~ \n >>Go again!`);
        this.updateBooks("Your"); //TODO: Grammar w/ call  *******
        // say(`Your cards are now: ${this.hand}`);
        getTargetCard(this); //TODO: User vs this?
        this.askForCard(opponent, target_card);
      } else {
        this.isMyTurn = false;
        opponent.isMyTurn = true;
      }
    }
    return this.hand, opponent.hand;
  }

  //TODO: Iterate backwards through cards
  updateBooks(whoString) {
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

    // Save repeats of 4+ to books & pull those cards from active hand
    for (let i = 0; i < numOfRepeats.length; i++) {
      if (numOfRepeats[i] >= 4) {
        this.books.push(repeat_card_ids[i]);
        ask(`${whoString} now has ${repeat_card_ids[i]} added to books!`); //TODO: "Your now has ..."

        for (let j = this.hand.length; j > 0; j--) {
          // Remove them from this.hand
          if (this.hand[j] === repeat_card_ids[i]) {
            this.hand.splice(j, 1);
          }
        }
      }
    }

    // Remove repeats from repeat array if they've been moved to books
    for (let i = repeat_card_ids.length; i > 0; i--) {
      // Remove them from repeat_card_ids
      if (this.books.indexOf(repeat_card_ids[i]) != -1) {
        repeat_card_ids.splice(i, 1);
        numOfRepeats.splice(i, 1);
      }
    }
    if (this.isUser) {
      ask(
        `\n${whoString} Hand: ${this.hand}, Repeat Cards: ${repeat_card_ids}, Each Repeats: ${numOfRepeats}\n${whoString} Books: ${this.books}\n>>`,
      );
    }
  }
}

const user = new Player(true, true, [], [], []); // User will always go first for now
const AI_player = new Player(false, false, [], [], []);

main();

// * MAIN FUNCTION
async function main() {
  startGame();
  while (playing) {
    // Sort User's hand for legibilty
    user.hand.sort();
    showCurrentHands();

    if (user.isMyTurn) {
      getTargetCard(user);
      user.askForCard(AI_player, target_card);
    } else {
      say("Your opponent wants to know if you have any...");
      await getTargetCard(AI_player);
      AI_player.askForCard(user, target_card);
      // TODO: make sure to narrate.
    }
    user.updateBooks("Your");
    AI_player.updateBooks("Opponent");
    // TODO: check for books/matches/points
    checkGameOver();
  }
}

function startGame() {
  // looks like shuffling 3 times helps randomize better from a perfect deck
  shuffleDeck(deck_of_cards, draw_pile);
  shuffleDeck(draw_pile, deck_of_cards);
  shuffleDeck(deck_of_cards, draw_pile);

  say("Let's play Go Fish!"); //TODO: Boxen Start
  // const rulesKnown = await ask("Do you know the rules?");

  // TODO: Introduce GPT w/ call?
  ask("I'll deal the cards...\n>>Press Enter to continue!");
  dealCards(7);
  // Sort user's hand before displayed
  user.hand.sort();
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
  // The printCardsInRow function take an array of symbols & a color
  const AI_cards_array = [];
  for (let i = 0; i < AI_player.hand.length; i++) {
    // Select a symbol for the back of the cards :)
    AI_cards_array.push("★");
  }
  printCardsInRow(AI_cards_array, redCard);
  say(`Your opponent has ${AI_player.hand.length} cards`);
  say(`Opponent's books: ${AI_player.books}`);
  printCardsInRow(AI_player.books, yellowCard);
  // say(`PSSST... They're ${AI_player.hand}`);

  console.log(
    boxen(
      `${
        boxen(`${draw_pile.length}`, {
          borderStyle: "double",
          backgroundColor: "white",
        })
      }`,
      {
        Type: "singleDouble",
        padding: 4,
        backgroundColor: "#105e37",
        title: "DRAW PILE",
        titleAlignment: "center",
      },
    ),
  );

  say(`Your books: ${user.books}`);
  printCardsInRow(user.books, yellowCard);
  say(`Your cards are: ${user.hand}`);
  printCardsInRow(user.hand, whiteCard);

  say(`\n.`);
}

// GPT-Generated to work with strings taken from boxen using say() which prints the chtrs
// I knew I had to print the cards in sections and wanted to implement it faster
// Updated to deal with array of strings (breaks w/ 10's. sad.)
function printCardsInRow(chars, colInt) {
  let topRow = "";
  let middleRow = "";
  let bottomRow = "";

  // Check if chars is an array. If not, make it an array of one element.
  if (!Array.isArray(chars)) {
    chars = [chars];
  }

  for (let i = 0; i < chars.length; i++) {
    const top = "┌─┐";
    const middle = `│\x1b[4${colInt}m${chars[i]}\x1b[49m│`; // Use the ith character from the chars array
    const bottom = "└─┘";

    topRow += top;
    middleRow += middle;
    bottomRow += bottom;
  }

  // Join and print the complete card row
  console.log(topRow);
  console.log(middleRow);
  console.log(bottomRow);
}

async function getTargetCard(whosAsking) {
  if (whosAsking.isUser) {
    target_card = ask(
      "Which card would you like to ask for? Only respond with the letter or number: ",
    );
  } else {
    target_card = await gptPrompt(
      `We are playing a game of Go Fish! You may ask me if I have any one of the cards in your hand, 
      and the goal is to make sets ("books") of 4 matching cards, represented by numbers or letters. 
      Your hand is ${whosAsking.hand} and you have asked for these cards so far: ${whosAsking.recentAsks}. Might be worth switching your ask from time to time.
      What card would you like to ask me for? Respond with ONLY ONE letter OR number that corresponds with a card in your hand. 10 is the only 2-digit exception.
      Example 1: your hand = [J, J, K, 1, 4, 5], your output = J
      Example 2: your hand = [A, 6, 2, 1, 2, Q], your output = 2
      Example 3: your hand = [10, 10, 3, J, 10, K], your output = 10
      I will read the string you return with javascript, so make sure it is only one number or letter.
      `,
    );
    whosAsking.recentAsks.push(target_card);
    say(`${target_card}'s?\n>>`);
    // TODO: Say cards if user so they can see what they're about to play
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
  if (AI_player.books.length > user.books.length) {
    ask(`Opponent won! Thanks for playing!`);
  } else if (user.books.length > AI_player.books.length) {
    ask(`You won! Thanks for playing!`);
  } else if (user.books.length === AI_player.books.length) {
    ask(`You tied! Thanks for playing!`);
  }
  return;
}
