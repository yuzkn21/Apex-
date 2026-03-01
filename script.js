let users = JSON.parse(localStorage.getItem('apex_users')) || {};
let currentUser = null;

// GİRİŞ/KAYIT MANTIĞI
function authTab(t) {
    document.getElementById('login-form').style.display = t === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = t === 'register' ? 'block' : 'none';
    document.getElementById('login-tab-btn').className = t === 'login' ? 'active' : '';
    document.getElementById('register-tab-btn').className = t === 'register' ? 'active' : '';
}

function kayitOl() {
    const u = document.getElementById('r-user').value;
    const p = document.getElementById('r-pass').value;
    if(u && p.length >= 6) {
        if(users[u]) return alert("Bu isim alınmış!");
        users[u] = { password: p, balance: 1000, crystal: 0, xp: 0, level: 1, crypto: 0 };
        save();
        alert("Kayıt başarılı! Giriş yapabilirsin.");
        authTab('login');
    }
}

function girisYap() {
    const u = document.getElementById('l-user').value;
    const p = document.getElementById('l-pass').value;
    if(users[u] && users[u].password === p) {
        currentUser = u;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        document.getElementById('display-user').innerText = currentUser;
        updateUI();
    } else alert("Hatalı giriş!");
}

// SATIŞ VE XP SİSTEMİ
function satisYap(kazanc, xp) {
    let user = users[currentUser];
    user.balance += kazanc;
    user.xp += xp;

    // Seviye Atlama (XP Barı Parapania Tarzı)
    let nextLevelXp = user.level * 1000;
    if(user.xp >= nextLevelXp) {
        user.level++;
        user.xp = 0;
        alert("TEBRİKLER! Seviye " + user.level + " oldun!");
    }
    updateUI();
    save();
}

// KRİPTO (BASİT BORSA)
let cryptoPrice = 3.85;
setInterval(() => {
    cryptoPrice += (Math.random() * 0.4 - 0.2); // Fiyat dalgalanması
    if(document.getElementById('xen-price')) 
        document.getElementById('xen-price').innerText = cryptoPrice.toFixed(2) + " Apex";
}, 3000);

function updateUI() {
    const u = users[currentUser];
    document.getElementById('balance').innerText = u.balance.toLocaleString();
    document.getElementById('crystal').innerText = u.crystal;
    document.getElementById('u-level').innerText = u.level;
    let progress = (u.xp / (u.level * 1000)) * 100;
    document.getElementById('xp-fill').style.width = progress + "%";
}

function switchPane(p) {
    document.querySelectorAll('.pane').forEach(el => el.style.display = 'none');
    document.getElementById('pane-' + p).style.display = 'block';
}

function save() { localStorage.setItem('apex_users', JSON.stringify(users)); }

function mesajGonder() {
    const m = document.getElementById('chat-msg').value;
    if(m) {
        const box = document.getElementById('chat-display');
        box.innerHTML += `<div class="msg"><strong>${currentUser}:</strong> ${m}</div>`;
        document.getElementById('chat-msg').value = "";
        box.scrollTop = box.scrollHeight;
    }
}

function cikisYap() { location.reload(); }
        
// Giriş başarılı olduktan sonra avatarı güncelle
document.getElementById('user-avatar').src = `https://api.dicebear.com/7.x/bottts/svg?seed=${currentUser}`;
