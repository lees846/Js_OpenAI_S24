/**
 * This is a sketch program to practice working with Deno
 * Referencing https://www.notion.so/Hello-Deno-827222988a4c45adb6b1e9a8a02004bd
 * 02 04 2024, Shayla Lee
 * 
 * 8. Make a program that takes the temperature in Fahrenheit and then outputs “cold”, “warm”, or “hot”.
*/

// I think it's cold when it's less than 50ºF outside,
// Warm between 50 and 75, and hot when it's above 76
function whatWeather(outside_temp) {
    if(outside_temp > 75) {
        console.log("It's hot today!");
    }
    else if(outside_temp >= 50) {
        console.log("It's pretty warm out.");
    }
    else {
        console.log("It's cold today!");
    }
}

// Invoke function with test values from each category
whatWeather(89);
whatWeather(72);
whatWeather(-5);