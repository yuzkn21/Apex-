// Kullanıcı verileri (Tarayıcıda saklanır, Replit'te kalıcı olur)
let users = JSON.parse(localStorage.getItem('apex_users')) || {};
let currentUser = null;

function kayitOl() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const msg = document.getElementById('message');

    if (!user || !pass) { 
        msg.innerText = "Lütfen tüm alanları doldurun!"; 
        return; 
    }
    if (users[user]) { 
        msg.innerText = "Bu kullanıcı adı zaten alınmış!"; // Benzersiz isim kuralı
        return; 
    }
    if (pass.length < 6) { 
        msg.innerText = "Şifre en az 6 karakter olmalıdır!"; // 6 karakter kuralı
        return; 
    }

    // Yeni kullanıcıyı kaydet
    users[user] = { password: pass, balance: 0 };
    localStorage.setItem('apex_users', JSON.stringify(users));
    msg.style.color = "#2ea44f";
    msg.innerText = "Kayıt başarılı! Şimdi giriş yapabilirsin.";
}

function girisYap() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;
    const msg = document.getElementById('message');

    if (users[user] && users[user].password === pass) {
        currentUser = user;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        document.getElementById('current-user').innerText = user;
        guncelleArayuz();
        msg.innerText = "";
    } else {
        msg.style.color = "red";
        msg.innerText = "Hatalı kullanıcı adı veya şifre!";
    }
}

function apexKazan() {
    users[currentUser].balance += 10; // Apex kazanma
    guncelleArayuz();
    localStorage.setItem('apex_users', JSON.stringify(users)); // Otomatik bulut kayıt
}

function guncelleArayuz() {
    document.getElementById('balance').innerText = users[currentUser].balance;
}

function cikisYap() {
    location.reload(); // Sayfayı yenileyerek çıkış yap
}
