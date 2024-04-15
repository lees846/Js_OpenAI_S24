// Declare variables to reference each element that receives user input
const outputLanguageElement = document.getElementById("outputLanguage");
const langLevelElement = document.getElementById("langLevel");
const inputTextElement = document.getElementById("inputText");
const translateButton = document.getElementById("translate");
const suggestButton = document.getElementById("textSuggestion");
const outputModeToggle = document.getElementById("outputModeToggle");

// Some topics generated with ChatGPT
const topicsDeck = [
  "an office",
  "a basic science concept",
  "a forest scene",
  "grocery store shelf",
  "a beach scene",
  "a farmer's market",
  "a city park",
  "a classroom environment",
  "a coffee shop",
  "a home kitchen",
  "a music concert",
  "an interaction with a computer",
  "an interaction with a smartphone",
  "a winter landscape",
  "a wedding ceremony",
  "an art museum",
  "a gym workout",
  "a family dinner",
  "a bakery",
  "a bank interior",
  "a flower garden",
  "a playground",
  "public transportation",
  "a restaurant",
  "a meetup with an old friend",
  "a doctor's office",
  "an interaction at a hotel",
  "a pet store/animal shelter",
];

translateButton.addEventListener("click", () => {
  // Reference the current values of the input fields and convert to URI components for the url
  const langLevel = encodeURIComponent(
    langLevelElement[langLevelElement.selectedIndex].firstChild.data,
  );
  const outputLanguage = encodeURIComponent(outputLanguageElement.value);
  const inputText = encodeURIComponent(inputTextElement.value);

  fetch(
    `/api/gpt/response?outputLanguage=${outputLanguage}&langLevel=${langLevel}&inputText=${inputText}`,
  )
    .then((response) => response.text())
    .then((responseText) => {
      const outputParagraph = document.getElementById("outputParagraph");
      console.log(`Response text: ${responseText}`);
      outputParagraph.innerText = responseText;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
});

suggestButton.addEventListener("click", () => {
  const langLevel = encodeURIComponent(
    langLevelElement[langLevelElement.selectedIndex].firstChild.data,
  );
  // Select a random topic from topicsDeck
  const randomIndex = Math.round(Math.random() * topicsDeck.length);

  // TODO: Clear/change the text currently in box before re-generating ("..."?)
  // Send random topic to backend with language level
  fetch(
    `/api/gpt/suggest?randomTopic=${
      topicsDeck[randomIndex]
    }&langLevel=${langLevel}`,
  )
    .then((response) => response.text())
    .then((inputSuggestion) => {
      console.log(`Input text: ${inputSuggestion}`);
      inputTextElement.innerText = inputSuggestion;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
});

// TODO: inquiry mode
// Referenced https://stackoverflow.com/questions/14544104/checkbox-check-event-listener for correct listener
outputModeToggle.addEventListener("change", () => {
  if (outputModeToggle.checked) {
    console.log("You're going to learn so many THINGS!");
  }
});
