const API_URL = "https://elainpojat-chat-backend.onrender.com";

let currentContact = null;
let allMessages = [];

document.addEventListener("DOMContentLoaded", () => {
  const username = localStorage.getItem("username");
  if (!username && location.pathname.endsWith("chat.html")) {
    location.href = "index.html";
  } else if (username && location.pathname.endsWith("index.html")) {
    location.href = "chat.html";
  }

  if (location.pathname.endsWith("chat.html")) {
    document.getElementById("welcome").textContent = `Welcome, ${username}!`;
    loadMessages();
    setInterval(loadMessages, 3000);
  }
});

function register() {
  const username = document.getElementById("registerUsername").value.trim();
  const password = document.getElementById("registerPassword").value;
  if (!username || !password) return alert("Username and password required.");

  fetch(API_URL + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Registered! You can now log in.");
        location.href = "index.html";
      } else {
        alert(data.message);
      }
    });
}

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  const password = document.getElementById("loginPassword").value;
  if (!username || !password) return alert("Username and password required.");

  fetch(API_URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        localStorage.setItem("username", username);
        location.href = "chat.html";
      } else {
        alert(data.message);
      }
    });
}

function logout() {
  localStorage.removeItem("username");
  location.href = "index.html";
}

function sendMessage() {
  const from = localStorage.getItem("username");
  const to = document.getElementById("toUser").value.trim();
  const message = document.getElementById("message").value.trim();
  if (!to || !message) return alert("Enter receiver and message.");

  fetch(API_URL + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, message })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("message").value = "";
        currentContact = to; // ✅ Set current contact
        loadMessages();       // ✅ Load updated messages
      } else {
        alert(data.message);
      }
    })
    .catch(err => {
      console.error("Send failed:", err);
      alert("Message failed.");
    });
}


function loadMessages() {
  const username = localStorage.getItem("username");
  fetch(API_URL + "/messages/" + username)
    .then(res => res.json())
    .then(messages => {
      allMessages = messages;
      updateContacts();

      if (!currentContact && allMessages.length > 0) {
        // Automatically pick the first contact
        const msg = allMessages.find(
          m => m.from !== username || m.to !== username
        );
        if (msg) {
          currentContact = msg.from === username ? msg.to : msg.from;
          document.getElementById("toUser").value = currentContact;
        }
      }

      showMessages(currentContact);
    });
}

function updateContacts() {
  const username = localStorage.getItem("username");
  const contacts = new Set();
  allMessages.forEach(msg => {
    if (msg.from !== username) contacts.add(msg.from);
    if (msg.to !== username) contacts.add(msg.to);
  });

  const contactList = document.getElementById("contactList");
  contactList.innerHTML = "";
  Array.from(contacts).sort().forEach(name => {
    const div = document.createElement("div");
    div.className = "contact";
    div.textContent = name;
    div.onclick = () => {
      currentContact = name;
      document.getElementById("toUser").value = name;
      showMessages(name);
    };
    contactList.appendChild(div);
  });
}

function showMessages(withUser) {
  const username = localStorage.getItem("username");
  const msgBox = document.getElementById("messages");
  msgBox.innerHTML = "";
  console.log("Showing messages with", withUser);

  allMessages
    .filter(msg =>
      (msg.from === username && msg.to === withUser) ||
      (msg.to === username && msg.from === withUser)
    )
    .forEach(msg => {
      const div = document.createElement("div");
      div.textContent = `${msg.from}: ${msg.message}`;
      msgBox.appendChild(div);
    });

  msgBox.scrollTop = msgBox.scrollHeight;
}
