/**
 * This is a test file to get some number and random-based programs going with Deno
 * Referencing https://www.notion.so/Hello-Deno-827222988a4c45adb6b1e9a8a02004bd
 * 02 02 2024, Shayla Lee

4. Make a program that asks the user for two numbers and then prints their sum.
5. Make a program that prints out a random number between 1 and 6 (inclusive)
6. Make a program that prints either your first name or your last name, chosen at random.

*/

/*
// 4:
// Ask for two numbers, and convert them to numbers from strings
const addend1 = Number(prompt("Give me a number"));
const addend2 = Number(prompt("Another number"));

// Add them
const sum = addend1 + addend2;

// Log to console
console.log(`Did you know those add up to ${sum}?`);

*/

/*
* 5:
* I'm familiar with map() in p5.js, so I asked gpt for an equivalent.
* It recommended a custom function similar to the one on this page: https://stackoverflow.com/questions/14224535/scaling-between-two-number-ranges 
* I ultimately referred to https://www.w3schools.com/jsref/jsref_random.asp
*/
/*
const randomNum = Math.round(Math.random() * 6);
console.log(randomNum);
*/

/*
6:
*/
// pick a random number
const choiceFactor = Math.random();
// if it's above 1/2, make it show last name else show first name
if (choiceFactor > 0.5){
    console.log("Lee")
} else {
    console.log("Shayla")
}