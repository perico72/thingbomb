const title = document.querySelector("title");

const customTitle = localStorage.getItem("pageTitle");

if (customTitle) {
  title.innerText = customTitle;
} else {
  title.innerText = "New Tab";
}
