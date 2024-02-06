/**
 * This is a sketch program to practice working with Deno
 * Referencing https://www.notion.so/Hello-Deno-827222988a4c45adb6b1e9a8a02004bd
 * 02 04 2024, Shayla Lee
 * 
 * 9. Make a program that asks three multiple choice questions, and then tells the user how many they got right.
*/

let numCorrect = 0;
const questions = [
    {
        question: "How many ounces in a pound?",
        A: "6",
        B: "8",
        C: "12",
        D: "16",
        answer: "d"
    },
    {
        question: "How many feet in a mile?",
        A: "5,280",
        B: "800",
        C: "1,860",
        D: "6,000",
        answer: "a"
    },
    {
        question: "What is the boiling point of water in Farenheit?",
        A: "180",
        B: "125",
        C: "212",
        D: "360",
        answer: "c"
    }
]

// Log instructions to the user
console.log("\n*\n*\nHello! I have a couple of questions for you about the IMPERIAL system!");
console.log("Each question is multiple choice, respond by typing the letter of the correct answer.");

// Ask if they're ready
const begin = prompt("Ready? (y/n)");
if (begin === 'y' || begin === 'Y'){
    // Ask each question
    for (let i=0; i < questions.length; i++) {
        const userResp = prompt(`\n${questions[i].question} \nA: ${questions[i].A} \nB: ${questions[i].B}\nC: ${questions[i].C} \nD: ${questions[i].D}\n`);
        // Increment numCorrect each time only if their answer is correct (check cap & lower letter)
        if (userResp === questions[i].answer || userResp === questions[i].answer.toUpperCase()) {
            numCorrect++;
        }
    }

    // Tell them how many were correct
    console.log(`\nYou got ${numCorrect}/3 questions correct!\n*\n*\n`);
} else {
    console.log("\nAlright, perhaps another time then!\n*\n*\n");
}

numCorrect = 0;
