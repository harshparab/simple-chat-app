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
const showLiveCount = document.querySelector(".show-live-count");
let username = "";
let userCount = 0;

// Words to replace text with emoji
const textToEmoji = {
  react: "⚛",
  woah: "😮",
  hey: "👋🏽",
  lol: "😂",
  like: "❤",
  congratulations: "🎉",
};

const remObj = {};

// Show the username modal
usernameModal.style.display = "block";

// To take username input
const userNameInputAndError = () => {
  username = modalInput.value.trim();

  if (username != "") {
    usernameModal.style.display = "none";
    userCount += 1;
    socket.emit("live user count", { userCount: userCount });
  } else {
    const usernameErr = document.createElement("div");
    usernameErr.classList.add("username-error");
    usernameErr.textContent = "Username cannot be empty!";
    modalContent.appendChild(usernameErr);
  }
};

// function for object creation for /rem
const functionForObjectCreation = (givenStr) => {
  const li = document.createElement("li");
  li.classList.add("random");
  const message = document.createElement("div");

  const strArray = givenStr.split(" ");

  if (strArray.length == 3) {
    remObj[strArray[1]] = strArray[2];
    message.textContent = "INFO: Data Saved Successfully";
  } else if (strArray.length == 2) {
    message.textContent = `${remObj[strArray[1]]}`;
  } else {
    message.textContent = "WARNING: Insufficent / Extra Values passed";
  }

  li.appendChild(message);
  messages.appendChild(li);
};

const calculator = (givenStr) => {
  const calcArray = givenStr.split(" ");

  const li = document.createElement("li");
  li.classList.add("random");
  const message = document.createElement("div");

  if (calcArray.length > 2) {
    message.textContent = "WARNING: Spaces are not allowed!!";
  } else {
    let result = eval(calcArray[1]);
    message.textContent = `Result: ${result}`;
    result = 0;
  }

  li.appendChild(message);
  messages.appendChild(li);
};

const slashCommands = (inputValue) => {
  if (inputValue.toLocaleLowerCase().includes("help")) {
    console.log("Inside help", inputValue);
    commandModal.style.display = "block";
  } else if (inputValue.toLocaleLowerCase().includes("clear")) {
    console.log("Inside clear", inputValue);
    messages.innerHTML = "";
  } else if (inputValue.toLocaleLowerCase().includes("random")) {
    console.log("Inside random", inputValue);
    const li = document.createElement("li");
    li.classList.add("random");
    const message = document.createElement("div");

    message.textContent = `Your random number is ${Math.floor(
      Math.random() * 10
    )}`;

    li.appendChild(message);
    messages.appendChild(li);
  } else if (inputValue.toLocaleLowerCase().includes("rem")) {
    functionForObjectCreation(inputValue);
  } else if (inputValue.toLocaleLowerCase().includes("calc")) {
    calculator(inputValue);
  } else {
    console.log("Inside socket", inputValue);
    socket.emit("chat message", { username, message: inputValue });
  }
};

// To execute slash command and emit message to emit message
const executeSlashCommandsAndEmitMessage = (eve) => {
  eve.preventDefault();
  if (input.value) {
    slashCommands(input.value);
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

  if (data.username == username) {
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

socket.on("live user count", (data) => {
  showLiveCount.innerHTML = data.userCount;
});

// All Event Listeners
modalButton.addEventListener("click", userNameInputAndError);
form.addEventListener("submit", executeSlashCommandsAndEmitMessage);
closeModalButton.addEventListener("click", closeModalBtn);
