// OYUN VERİLERİ VE KAYIT SİSTEMİ
let users = JSON.parse(localStorage.getItem('apex_users')) || {};
let currentUser = null;

// GİRİŞ VE KAYIT EKRANI SEKMELERİ
function authTabDegistir(tab) {
    const loginForm = document.getElementById('login-form');
    const regForm = document.getElementById('register-form');
    const loginBtn = document.getElementById('login-tab-btn');
    const regBtn = document.getElementById('register-tab-btn');

    if (tab === 'login') {
        loginForm.style.display = 'block';
        regForm.style.display = 'none';
        loginBtn.classList.add('active');
        regBtn.classList.remove('active');
    } else {
        loginForm.style.display = 'none';
        regForm.style.display = 'block';
        loginBtn.classList.remove('active');
        regBtn.classList.add('active');
    }
}

// KAYIT OLMA FONKSİYONU
function kayitOl() {
    const user = document.getElementById('reg-username').value.trim();
    const pass = document.getElementById('reg-password').value;

    if (user.length < 1 || pass.length < 6) {
        alert("Kullanıcı adı boş olamaz ve şifre en az 6 karakter olmalıdır!");
        return;
    }
    if (users[user]) {
        alert("Bu kullanıcı adı zaten alınmış!");
        return;
    }

    // Yeni kullanıcı şablonu
    users[user] = { 
        password: pass, 
        balance: 0, 
        crystal: 0, 
        clickPower: 10,
        inventory: [] 
    };
    
    saveData();
    alert("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
    authTabDegistir('login');
}

// GİRİŞ YAPMA FONKSİYONU
function girisYap() {
    const user = document.getElementById('login-username').value.trim();
    const pass = document.getElementById('login-password').value;

    if (users[user] && users[user].password === pass) {
        currentUser = user;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        document.getElementById('current-user-display').innerText = currentUser;
        
        // Eğer clickPower tanımlı değilse varsayılan yap
        if(!users[currentUser].clickPower) users[currentUser].clickPower = 10;
        
        guncelleArayuz();
    } else {
        alert("Kullanıcı adı veya şifre hatalı!");
    }
}

// OYUN İÇİ SEKME DEĞİŞTİRME
function tabDegistir(target) {
    document.querySelectorAll('.content-tab').forEach(tab => tab.style.display = 'none');
    document.getElementById(target).style.display = 'block';
    
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
}

// APEX KAZANMA (TIKLAMA)
function apexKazan() {
    users[currentUser].balance += users[currentUser].clickPower;
    
    // Küçük bir görsel efekt
    const coin = document.querySelector('.coin-wrapper');
    coin.style.transform = "scale(0.95)";
    setTimeout(() => coin.style.transform = "scale(1)", 50);

    guncelleArayuz();
    saveData();
}

// MARKET SİSTEMİ (MÜLK ALMA)
function esyaAl(isim, fiyat, bonus) {
    if (users[currentUser].balance >= fiyat) {
        users[currentUser].balance -= fiyat;
        users[currentUser].clickPower += bonus;
        
        alert("Hayırlı olsun! " + isim + " imparatorluğunu büyüttü.");
        guncelleArayuz();
        saveData();
    } else {
        alert("Yeterli Apex yok! Daha fazla tıklamalısın.");
    }
}

// KRİSTAL DÖNÜŞTÜRME
function kristalDonustur() {
    if (users[currentUser].balance >= 10000) {
        users[currentUser].balance -= 10000;
        users[currentUser].crystal = (users[currentUser].crystal || 0) + 1;
        alert("Tebrikler! 1 Apex Kristali kazandın.");
        guncelleArayuz();
        saveData();
    } else {
        alert("Kristal için 10.000 Apex gerekiyor!");
    }
}

// CHAT SİSTEMİ
function mesajGonder() {
    const msg = document.getElementById('chat-input').value.trim();
    if(msg) {
        const chatBox = document.getElementById('messages');
        const time = new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
        chatBox.innerHTML += `<p style="margin: 5px 0;">[${time}] <strong>${currentUser}:</strong> ${msg}</p>`;
        document.getElementById('chat-input').value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// ARAYÜZÜ GÜNCELLEME
function guncelleArayuz() {
    document.getElementById('balance').innerText = users[currentUser].balance.toLocaleString('tr-TR');
    document.getElementById('crystal').innerText = (users[currentUser].crystal || 0).toLocaleString('tr-TR');
    document.getElementById('user-level').innerText = "Kazanç: " + users[currentUser].clickPower.toLocaleString('tr-TR') + " / tık";
}

// VERİ KAYDETME
function saveData() {
    localStorage.setItem('apex_users', JSON.stringify(users));
}

// ÇIKIŞ YAPMA
function cikisYap() {
    if(confirm("Çıkış yapmak istediğine emin misin?")) {
        location.reload();
    }
        }
            // SADECE GERÇEK OYUNCULAR İÇİN ÖZEL SOHBET
function mesajGonder() {
    const msg = document.getElementById('chat-input').value.trim();
    if(msg) {
        const chatBox = document.getElementById('messages');
        const time = new Date().toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'});
        
        // Mesaj Baloncuğu Tasarımı
        chatBox.innerHTML += `
            <div style="background: #1e293b; padding: 10px; border-radius: 10px; margin-bottom: 8px; border-left: 4px solid #f1c40f; align-self: flex-start; max-width: 90%;">
                <small style="color: #f1c40f; font-weight: bold; display: block; margin-bottom: 3px;">${currentUser} <span style="color: #94a3b8; font-weight: normal; font-size: 10px;">• ${time}</span></small>
                <span style="color: white; font-size: 14px;">${msg}</span>
            </div>`;
            
        document.getElementById('chat-input').value = '';
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}
