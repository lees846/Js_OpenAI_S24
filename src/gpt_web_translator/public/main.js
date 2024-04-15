// Declare variables to reference each element that receives user input
const outputLanguageElement = document.getElementById("outputLanguage");
const langLevelElement = document.getElementById("langLevel");
const inputTextElement = document.getElementById("inputText");
const translateButton = document.getElementById("translate");

translateButton.addEventListener("click", () => {
  // Reference the current values of the input fields and convert to URI components for the url
  const langLevel = encodeURIComponent(
    langLevelElement[langLevelElement.selectedIndex].firstChild.data,
  );
  const outputLanguage = encodeURIComponent(outputLanguageElement.value);
  const inputText = encodeURIComponent(inputTextElement.value);

  fetch(
    `/api/gpt?outputLanguage=${outputLanguage}&langLevel=${langLevel}&inputText=${inputText}`,
    // {method: "POST"}
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
