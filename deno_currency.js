/**
 * This is a sketch program to practice working with Deno
 * Referencing https://www.notion.so/Hello-Deno-827222988a4c45adb6b1e9a8a02004bd
 * 02 04 2024, Shayla Lee
 * 
 * 7. Make a program that converts USD to the currency of your choice.
*/

// Currency: USD to CRC (Costa Rican Colones), source — https://www.xe.com/currencyconverter/convert/?Amount=1&From=USD&To=CRC
// 1 USD = 515.41 CRC

function usdToCRC(dollars){
    // To retain 2 decimal places, referred to an article by Izzaz: https://www.programmingbasic.com/round-to-nearest-hundredth-javascript
    const colones = Math.round(dollars * 515.41 * 100) / 100;
    console.log(colones);
}

// Invoke the function to test the output
usdToCRC(23);
usdToCRC(402);
usdToCRC(15);