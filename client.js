const socket = io();

// Avatars array
const avatars = [
  'assets/avatar1.png',
  'assets/avatar2.png',
  'assets/avatar3.png',
  'assets/avatar4.png'
];

// Prompt for username
let username = prompt("Enter your name:");
if (!username || !username.trim()) {
  username = "Anonymous";
}
username = username.trim();

// DOM Elements
const form = document.getElementById("chat-form");
const input = document.getElementById("message-input");
const messages = document.getElementById("messages");

// Helper: Get avatar index based on username
function getAvatarIndex(name) {
  let sum = 0;
  for (let i = 0; i < name.length; i++) {
    sum += name.charCodeAt(i);
  }
  return sum % avatars.length;
}

// Submit chat message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = input.value.trim();
  if (msg) {
    const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    socket.emit("chat message", {
      user: username,
      message: msg,
      time: timestamp,
    });
    input.value = "";
  }
});

// Receive chat message
socket.on("chat message", (data) => {
  const li = document.createElement("li");
  // Decide sent or received class
  const isSent = data.user.toLowerCase() === username.toLowerCase();
  li.classList.add(isSent ? "sent" : "received");

  // Avatar image
  const avatarImg = document.createElement("img");
  avatarImg.src = avatars[getAvatarIndex(data.user)];
  avatarImg.alt = `${data.user} avatar`;
  avatarImg.classList.add("avatar");

  // Message bubble container
  const messageContent = document.createElement("div");
  messageContent.classList.add("message-content");

  if (!isSent) {
  const userNameElem = document.createElement("strong");
  userNameElem.classList.add("username");
  userNameElem.textContent = data.user;
  messageContent.appendChild(userNameElem);
}
  // Message text
  const messageText = document.createElement("p");
  messageText.textContent = data.message;

  // Timestamp
  const timeSpan = document.createElement("span");
  timeSpan.classList.add("time");
  timeSpan.textContent = data.time;

  messageContent.appendChild(messageText);
  messageContent.appendChild(timeSpan);

  // Append avatar and message bubble depending on sent or received
  if (isSent) {
    li.appendChild(messageContent);
    li.appendChild(avatarImg);
  } else {
    li.appendChild(avatarImg);
    li.appendChild(messageContent);
  }

  messages.appendChild(li);

  // Auto scroll
  messages.scrollTop = messages.scrollHeight;
});

// Typing indicator
const typingDiv = document.getElementById("typing");

input.addEventListener("input", () => {
  socket.emit("typing", username);
});

socket.on("typing", (user) => {
  if (user.toLowerCase() === username.toLowerCase()) return;

  typingDiv.style.display = "block";
  typingDiv.textContent = `${user} is typing...`;

  clearTimeout(typingDiv.timer);
  typingDiv.timer = setTimeout(() => {
    typingDiv.style.display = "none";
    typingDiv.textContent = "";
  }, 1500);
});

