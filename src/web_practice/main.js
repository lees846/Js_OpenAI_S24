// This project is made in collaboration with ChatGPT

const navImages = document.getElementsByClassName("nav-image");

// nav image click -> toggle article visibility & darken selected image
for (let i = 0; i < navImages.length; i++) {
  navImages[i].addEventListener("click", function (event) {
    // Refer to the image that was selected
    const clickedImage = event.currentTarget.querySelector("img");

    // Find the corresponding article
    const articleId = clickedImage.id.replace("-img", "-article");
    const targetArticle = document.getElementById(articleId);

    toggleClass(targetArticle, "hidden");
    toggleClass(clickedImage, "darken");
  });
}

function toggleClass(whichElement, whichClass) {
  if (whichElement.classList.contains(whichClass)) {
    whichElement.classList.remove(whichClass);
  } else {
    whichElement.classList.add(whichClass);
  }
}
