const socket = io();
const usernameModal = document.querySelector(".username-modal");
const modalInput = document.querySelector(".modal-input");
const modalButton = document.querySelector(".modal-button");
const form = document.querySelector(".form");
const input = document.querySelector(".input");
const messages = document.querySelector(".messages");
const modalContent = document.querySelector(".modal-content");
const commandModal = document.querySelector(".command-modal");
const closeModalButton = document.querySelector(".close-modal");
let username = "";

// Words to replace text with emoji
const textToEmoji = {
  react: "⚛",
  woah: "😮",
  hey: "👋🏽",
  lol: "😂",
  like: "❤",
  congratulations: "🎉",
};

// Show the username modal
usernameModal.style.display = "block";

// To take username input
const userNameInputAndError = () => {
  username = modalInput.value.trim();

  if (username !== "") {
    usernameModal.style.display = "none";
  } else {
    const usernameErr = document.createElement("div");
    usernameErr.classList.add("username-error");
    usernameErr.textContent = "Username cannot be empty!";
    modalContent.appendChild(usernameErr);
  }
};

// To execute slash command and emit message to emit message
const executeSlashCommandsAndEmitMessage = (eve) => {
  eve.preventDefault();
  if (input.value) {
    if (input.value.toLocaleLowerCase() == "/help") {
      commandModal.style.display = "block";
    } else if (input.value.toLocaleLowerCase() == "/random") {
      const li = document.createElement("li");
      li.classList.add("random");
      const strong = document.createElement("strong");
      strong.textContent = username;
      const message = document.createElement("div");

      message.textContent = `Your random number is ${Math.floor(
        Math.random() * 10
      )}`;

      li.appendChild(strong);
      li.appendChild(message);
      messages.appendChild(li);
    } else if (input.value.toLocaleLowerCase() == "/clear") {
      messages.innerHTML = "";
    } else {
      socket.emit("chat message", { username, message: input.value });
    }
    input.value = "";
  }
};

// To close the modal on help
const closeModalBtn = () => {
  commandModal.style.display = "none";
};

// Replace Emoji with words
const replaceWordsWithEmoji = (givenStr) => {
  for (const key in textToEmoji) {
    if (textToEmoji.hasOwnProperty(key)) {
      const value = textToEmoji[key];
      const regex = new RegExp(`\\b${key}\\b`, "gi");
      givenStr = givenStr.replace(regex, value);
    }
  }
  return givenStr;
};

// Socket message connection
socket.on("chat message", (data) => {
  const li = document.createElement("li");

  if (data.username === username) {
    li.classList.add("sent");
  } else {
    li.classList.add("received");
  }

  const replacedWords = replaceWordsWithEmoji(data.message);

  const strong = document.createElement("strong");
  strong.textContent = data.username;
  const message = document.createElement("div");
  message.textContent = replacedWords;

  li.appendChild(strong);
  li.appendChild(message);

  messages.appendChild(li);
});

// All Event Listeners
modalButton.addEventListener("click", userNameInputAndError);
form.addEventListener("submit", executeSlashCommandsAndEmitMessage);
closeModalButton.addEventListener("click", closeModalBtn);
