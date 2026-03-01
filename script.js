let users = JSON.parse(localStorage.getItem('apex_users')) || {};
let currentUser = null;

function kayitOl() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (user.length < 1 || pass.length < 6) {
        alert("Kullanıcı adı boş olamaz ve şifre en az 6 karakter olmalıdır!");
        return;
    }
    if (users[user]) {
        alert("Bu kullanıcı adı zaten alınmış!");
        return;
    }
    users[user] = { password: pass, balance: 0, clickPower: 10 };
    saveData();
    alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
}

function girisYap() {
    const user = document.getElementById('username').value;
    const pass = document.getElementById('password').value;
    if (users[user] && users[user].password === pass) {
        currentUser = user;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        document.getElementById('current-user').innerText = currentUser;
        guncelleArayuz();
    } else {
        alert("Kullanıcı adı veya şifre hatalı!");
    }
}

function apexKazan() {
    users[currentUser].balance += users[currentUser].clickPower;
    guncelleArayuz();
    saveData();
}

function esyaAl(isim, fiyat, bonus) {
    if (users[currentUser].balance >= fiyat) {
        users[currentUser].balance -= fiyat;
        users[currentUser].clickPower += bonus;
        alert(isim + " alındı! Kazancın arttı.");
        guncelleArayuz();
        saveData();
    } else {
        alert("Yeterli Apex yok!");
    }
}

function guncelleArayuz() {
    document.getElementById('balance').innerText = users[currentUser].balance;
}

function saveData() {
    localStorage.setItem('apex_users', JSON.stringify(users));
}

function cikisYap() {
    location.reload();
}
