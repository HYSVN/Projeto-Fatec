// Elementos da DOM
const loginContainer = document.getElementById('loginContainer');
const registerContainer = document.getElementById('registerContainer');
const showRegisterLink = document.getElementById('showRegister');
const showLoginLink = document.getElementById('showLogin');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginPhone = document.getElementById('loginPhone');
const registerPhone = document.getElementById('registerPhone');

// Event Listeners
showRegisterLink.addEventListener('click', showRegisterForm);
showLoginLink.addEventListener('click', showLoginForm);
loginPhone.addEventListener('input', formatPhoneInput);
registerPhone.addEventListener('input', formatPhoneInput);
loginForm.addEventListener('submit', handleLogin);
registerForm.addEventListener('submit', handleRegister);

// Funções
function showRegisterForm(e) {
    e.preventDefault();
    loginContainer.classList.add('hidden');
    registerContainer.classList.remove('hidden');
}

function showLoginForm(e) {
    e.preventDefault();
    registerContainer.classList.add('hidden');
    loginContainer.classList.remove('hidden');
}

function formatPhoneInput(e) {
    let phone = e.target.value.replace(/\D/g, '');
    
    if (phone.length > 0) {
        phone = phone.match(/(\d{0,2})(\d{0,5})(\d{0,4})/);
        phone = (!phone[2] ? phone[1] : '(' + phone[1] + ') ' + phone[2] + (phone[3] ? '-' + phone[3] : ''));
    }
    
    e.target.value = phone;
}

function handleLogin(e) {
    e.preventDefault();
    
    const name = document.getElementById('loginName').value;
    const phone = document.getElementById('loginPhone').value;
    
    if (!name || !phone) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    if (phone.replace(/\D/g, '').length < 10) {
        alert('Por favor, insira um número de celular válido');
        return;
    }
    
    alert(`Bem-vinda, ${name}! Login realizado com sucesso.`);
    window.location.href = 'home.html';
}

function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('registerName').value;
    const phone = document.getElementById('registerPhone').value;
    
    if (!name || !phone) {
        alert('Por favor, preencha todos os campos');
        return;
    }
    
    if (phone.replace(/\D/g, '').length < 10) {
        alert('Por favor, insira um número de celular válido');
        return;
    }
    
    const user = { name, phone };
    localStorage.setItem('manicureUser', JSON.stringify(user));
    
    alert('Cadastro realizado com sucesso!');
    showLoginForm(e);
    
    document.getElementById('loginName').value = name;
    document.getElementById('loginPhone').value = phone;
}
