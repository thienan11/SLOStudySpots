const darkMode = localStorage.getItem("dark-mode") === "true";

function enableDarkMode() {
  document.body.classList.add("dark-mode");
  localStorage.setItem("dark-mode", "true");
}

function disableDarkMode() {
  document.body.classList.remove("dark-mode");
  localStorage.setItem("dark-mode", "false");
}

function setDarkMode(checked: boolean) {
  if (checked) enableDarkMode();
  else disableDarkMode();
}

setDarkMode(darkMode);

document.body.addEventListener("dark-mode", () => {
  const prev = localStorage.getItem("dark-mode") === "true";
  setDarkMode(!prev);
});