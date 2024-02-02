/**
 * This is a test file to get some name-based programs going with Deno
 * Referencing https://www.notion.so/Hello-Deno-827222988a4c45adb6b1e9a8a02004bd
 * 02 02 2024, Shayla Lee

1. Make a program that prints your name.
2. Make a program that prints your name 1000 times.
3. Make a program that asks for the user’s name and then prints “Hello $name”

*/

/*
// 1 and 2:
for(let i = 0; i < 1000; i++){
    console.log("The programmer's name is Shayla.");
}
*/

// 3:
// Referred to `prompt` syntax from AI Microjam https://www.notion.so/AI-Micro-Jam-226448d8272749129f59daa7b0062bd8
const userName = prompt("What is your name?");
console.log(`Well hello there, ${userName}.`);

