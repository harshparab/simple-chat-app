document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  let username = prompt("Enter your username:");

  while (!username) {
    username = prompt("Username cannot be empty. Enter your username:");
  }

  const form = document.getElementById("form");
  const input = document.getElementById("input");
  const messages = document.getElementById("messages");
  const textToEmoji = {
    react: "⚛",
    woah: "😮",
    hey: "👋🏽",
    lol: "😂",
    like: "❤",
    congratulations: "🎉",
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value) {
      if (input.value.toLocaleLowerCase() == "/help") {
        alert(`
          Available Commands:
          /help - Show this message
          /random - Print a random number
          /clear - Clear the chat
        `);
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
  });

  socket.on("chat message", (data) => {
    const li = document.createElement("li");

    if (data.username === username) {
      li.classList.add("sent");
    } else {
      li.classList.add("received");
    }

    let outputStr = data.message;
    for (const key in textToEmoji) {
      if (textToEmoji.hasOwnProperty(key)) {
        const value = textToEmoji[key];
        const regex = new RegExp(`\\b${key}\\b`, "gi");
        outputStr = outputStr.replace(regex, value);
      }
    }

    const strong = document.createElement("strong");
    strong.textContent = data.username;
    const message = document.createElement("div");
    message.textContent = outputStr;

    li.appendChild(strong);
    li.appendChild(message);

    messages.appendChild(li);
  });
});
