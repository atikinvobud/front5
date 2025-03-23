const apiUrl = 'http://localhost:8000';
let token = ''; 

const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const messageDiv = document.getElementById('message');
const profileDiv = document.getElementById('profile');
const profileInfo = document.getElementById('profile-info');
const logoutBtn = document.getElementById('logout-btn');


const showMessage = (message, isError = true) => {
    messageDiv.textContent = message;
    messageDiv.style.color = isError ? 'red' : 'green';
    messageDiv.style.display = message ? 'block' : 'none'; 
};


const showLoginForm = () => {
    document.getElementById('login-form').style.display = 'block';
    profileDiv.style.display = 'none';
};


const showProfile = (user) => {
    document.getElementById('login-form').style.display = 'none';
    profileDiv.style.display = 'block';
    profileInfo.innerHTML = `Привет, ${user.username}!`;
};


loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        token = data.token; 
        showProfile({ username });
        showMessage('Успешный вход!', false); 
    } else {
        showMessage(data.message || 'Ошибка входа'); }
});


registerBtn.addEventListener('click', async () => {
    const username = document.getElementById('login').value;
    const password = document.getElementById('password').value;

    const response = await fetch(`${apiUrl}/registr`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        showMessage('Пользователь зарегистрирован!', false); 
    } else {
        showMessage(data.message || 'Ошибка регистрации'); 
    }
});


logoutBtn.addEventListener('click', () => {
    token = ''; 
    showLoginForm(); 
    showMessage('Вы вышли из системы.', false); 
});


const fetchProfile = async () => {
    if (token) {
        const response = await fetch(`${apiUrl}/profile`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });

        const data = await response.json();
        if (response.ok) {
            showProfile(data.user);
        } else {
            showMessage('Ошибка доступа к профилю. Токен недействителен.');
            showLoginForm();
        }
    } else {
        showLoginForm();
    }
};


fetchProfile();
