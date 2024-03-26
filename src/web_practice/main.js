// This project is made in collaboration with ChatGPT

const navImages = document.getElementsByClassName("nav-image");
for (let i = 0; i < navImages.length; i++) {
  navImages[i].addEventListener("click", function (event) {
    // Refer to the image that was selected
    const clickedImage = event.currentTarget.querySelector("img");

    // Find the corresponding article
    const articleId = clickedImage.id.replace("-img", "-article");
    const targetArticle = document.getElementById(articleId);

    // Check if it has a hidden class, take it away/add it accordingly
    if (targetArticle.classList.contains("hidden")) {
      targetArticle.classList.remove("hidden");
    } else {
      targetArticle.classList.add("hidden");
    }
  });
}
