const API_URL = "https://elainpojat-chat-backend.onrender.com"; // <- replace with your actual backend

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').onsubmit = async (e) => {
      e.preventDefault();
      const username = e.target.username.value;
      const password = e.target.password.value;
      const res = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('username', username);
        location.href = 'chat.html';
      } else {
        alert(data.message);
      }
    };
  }

  if (document.getElementById('registerForm')) {
    document.getElementById('registerForm').onsubmit = async (e) => {
      e.preventDefault();
      const username = e.target.username.value;
      const password = e.target.password.value;
      const res = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) location.href = 'index.html';
    };
  }

  if (document.getElementById('sendMessageForm')) {
    document.getElementById('loggedInUser').textContent = localStorage.getItem('username');
    document.getElementById('sendMessageForm').onsubmit = async (e) => {
      e.preventDefault();
      const sender = localStorage.getItem('username');
      const receiver = document.getElementById('receiver').value;
      const message = document.getElementById('message').value;
    fetch(API_URL + "/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ from, to, message })
})

      loadMessages();
    };

    async function loadMessages() {
      const res = await fetch(`${API_URL}/messages/${localStorage.getItem('username')}`);
      const messages = await res.json();
      const container = document.getElementById('messages');
      container.innerHTML = messages.map(msg =>
        `<p><strong>${msg.from}:</strong> ${msg.message}</p>`).join('');
    }

    loadMessages();
    setInterval(loadMessages, 3000);
  }
});
