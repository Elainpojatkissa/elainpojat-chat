const API_URL = "https://elainpojat-chat-backend.onrender.com";

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
  if (!username) {
    alert("Username cannot be empty.");
    return;
  }

  fetch(API_URL + "/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        alert("Registered! Now log in.");
        location.href = "index.html";
      } else {
        alert(data.message);
      }
    });
}

function login() {
  const username = document.getElementById("loginUsername").value.trim();
  if (!username) {
    alert("Username cannot be empty.");
    return;
  }

  fetch(API_URL + "/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username })
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

function sendMessage() {
  const from = localStorage.getItem("username");
  const to = document.getElementById("toUser").value.trim();
  const message = document.getElementById("message").value.trim();

  if (!to || !message) {
    alert("Please enter both receiver and message.");
    return;
  }

  fetch(API_URL + "/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, message })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        document.getElementById("message").value = "";
        loadMessages();
      } else {
        alert("Error: " + data.message);
      }
    })
    .catch(err => {
      console.error("Send failed:", err);
      alert("Message failed. Is the backend online?");
    });
}

function loadMessages() {
  const username = localStorage.getItem("username");
  fetch(API_URL + "/messages/" + username)
    .then(res => res.json())
    .then(messages => {
      const msgBox = document.getElementById("messages");
      msgBox.innerHTML = "";
      messages.forEach(msg => {
        const div = document.createElement("div");
        div.textContent = `${msg.from}: ${msg.message}`;
        msgBox.appendChild(div);
      });
    });
}

function logout() {
  localStorage.removeItem("username");
  location.href = "index.html";
}
