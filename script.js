let users = JSON.parse(localStorage.getItem('apex_users')) || {};
let currentUser = null;

const properties = [
    { id: 1, type: 'dukkan', name: 'Apex Market', price: 1500, income: 250, level: 1, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200' },
    { id: 2, type: 'bahce', name: 'Zeytin Bahçesi', price: 12000, income: 2100, level: 5, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200' },
    { id: 3, type: 'ciftlik', name: 'Büyükbaş Çiftliği', price: 50000, income: 9000, level: 15, img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=200' },
    { id: 4, type: 'fabrika', name: 'Tekstil Fabrikası', price: 180000, income: 28000, level: 30, img: 'https://images.unsplash.com/photo-1558444458-5f75bc94356a?w=200' },
    { id: 5, type: 'maden', name: 'Altın Madeni', price: 600000, income: 95000, level: 45, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200' },
    { id: 6, type: 'marka', name: 'Birhat Global Holding', price: 3000000, income: 450000, level: 50, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400' }
];

function authTab(t) {
    document.getElementById('login-form').style.display = t === 'login' ? 'block' : 'none';
    document.getElementById('register-form').style.display = t === 'register' ? 'block' : 'none';
}

function kayitOl() {
    const u = document.getElementById('r-user').value.trim();
    const p = document.getElementById('r-pass').value;
    const c = document.getElementById('r-city').value;
    if(u && p.length >= 6) {
        users[u] = { password: p, city: c, balance: 2500, crystal: 0, xp: 0, level: 1, inventory: [], lastDaily: 0 };
        save(); alert("Hesap açıldı, giriş yap!"); authTab('login');
    }
}

function girisYap() {
    const u = document.getElementById('l-user').value.trim();
    const p = document.getElementById('l-pass').value;
    if(users[u] && users[u].password === p) {
        currentUser = u;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        updateUI(); displayMarket('dukkan'); startSessizBotlar();
    }
}

function displayMarket(kategori) {
    const list = document.getElementById('property-list');
    const user = users[currentUser];
    list.innerHTML = "";
    properties.filter(p => p.type === kategori).forEach(p => {
        const isLocked = user.level < p.level;
        const owns = user.inventory.includes(p.id);
        list.innerHTML += `
            <div class="card ${isLocked ? 'locked' : ''}" onclick="${isLocked ? '' : (owns ? `satisYap(${p.id})` : `esyaAl(${p.id})`)}">
                <img src="${p.img}" class="prop-img">
                <div class="card-info">
                    <h3>${p.name} ${isLocked ? '🔒' : ''}</h3>
                    <p>${isLocked ? 'Seviye: '+p.level : user.city}</p>
                    <span class="badge">${owns ? '+'+p.income.toLocaleString()+' Apex' : p.price.toLocaleString()+' 🪙'}</span>
                </div>
            </div>`;
    });
}

function satisYap(id) {
    const p = properties.find(x => x.id === id);
    const u = users[currentUser];
    u.balance += p.income; u.xp += (p.type === 'marka' ? 1200 : 250);
    if(u.xp >= u.level * 2000) { u.level++; u.xp = 0; alert("LEVEL UP!"); }
    updateUI(); save();
}

function esyaAl(id) {
    const p = properties.find(x => x.id === id);
    const u = users[currentUser];
    if(u.balance >= p.price) { u.balance -= p.price; u.inventory.push(id); save(); displayMarket(p.type); updateUI(); }
}

function updateUI() {
    const u = users[currentUser];
    document.getElementById('display-user').innerText = currentUser;
    document.getElementById('balance').innerText = Math.floor(u.balance).toLocaleString();
    document.getElementById('u-level').innerText = u.level;
    document.getElementById('xp-fill').style.width = (u.xp / (u.level * 2000) * 100) + "%";
}

function toggleProfile() {
    const m = document.getElementById('profile-modal');
    const u = users[currentUser];
    if(m.style.display === 'none') {
        document.getElementById('p-name').innerText = currentUser;
        document.getElementById('p-city').innerText = u.city;
        document.getElementById('p-wealth').innerText = u.balance.toLocaleString();
        m.style.display = 'flex';
    } else m.style.display = 'none';
}

function gunlukOdulAl() {
    const u = users[currentUser];
    if(Date.now() - u.lastDaily > 86400000) {
        u.balance += 5000; u.lastDaily = Date.now(); save(); updateUI(); alert("5000 Apex eklendi!");
    } else alert("Yarın tekrar gel!");
}

function startSessizBotlar() { setInterval(() => console.log("Hizmet çalışıyor..."), 60000); }
function save() { localStorage.setItem('apex_users', JSON.stringify(users)); }
function cikisYap() { location.reload(); }

let users = JSON.parse(localStorage.getItem('birhat_users')) || {};
let currentUser = null;

const properties = [
    { id: 1, type: 'dukkan', name: 'Apex Market', price: 1500, income: 250, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=100' },
    { id: 2, type: 'bahce', name: 'Zeytinlik', price: 10000, income: 1800, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=100' },
    { id: 3, type: 'ciftlik', name: 'Tavuk Çiftliği', price: 40000, income: 8000, img: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=100' },
    { id: 4, type: 'fabrika', name: 'Un Fabrikası', price: 180000, income: 32000, img: 'https://images.unsplash.com/photo-1558444458-5f75bc94356a?w=100' },
    { id: 5, type: 'maden', name: 'Altın Ocağı', price: 800000, income: 135000, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=100' },
    { id: 6, type: 'marka', name: 'Birhat Global', price: 3000000, income: 550000, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=100' }
];

function kayitOl() {
    const u = document.getElementById('u-name-input').value.trim();
    const p = document.getElementById('u-pass-input').value;
    const c = document.getElementById('u-city-input').value;
    if(u && p.length >= 6) {
        if(users[u]) return alert("İsim alınmış!");
        users[u] = { password: p, city: c, balance: 2500, xp: 0, level: 1, inv: [] };
        save(); alert("Kayıt başarılı! Giriş yapabilirsin.");
    } else alert("Şifre en az 6 karakter olmalı.");
}

function girisYap() {
    const u = document.getElementById('u-name-input').value.trim();
    const p = document.getElementById('u-pass-input').value;
    if(users[u] && users[u].password === p) {
        currentUser = u;
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        updateUI(); displayMarket('dukkan');
    } else alert("Hatalı giriş!");
}

function displayMarket(cat) {
    const list = document.getElementById('property-list');
    const user = users[currentUser];
    list.innerHTML = "";
    properties.filter(p => p.type === cat).forEach(p => {
        const owns = user.inv.includes(p.id);
        list.innerHTML += `
            <div class="card" onclick="handleTouch(${p.id})">
                <img src="${p.img}">
                <div class="c-info">
                    <h4>${p.name}</h4>
                    <p>${owns ? 'Gelir: +' + p.income : user.city}</p>
                    <span class="badge">${owns ? 'KAZAN' : p.price + ' Apex'}</span>
                </div>
            </div>`;
    });
}

function handleTouch(id) {
    const p = properties.find(x => x.id === id);
    const u = users[currentUser];
    if(u.inv.includes(id)) {
        u.balance += p.income; u.xp += 200;
        if(u.xp >= u.level * 2000) { u.level++; u.xp = 0; alert("Seviye Atladın!"); }
    } else if(u.balance >= p.price) {
        u.balance -= p.price; u.inv.push(id); displayMarket(p.type);
    }
    updateUI(); save();
}

function updateUI() {
    const u = users[currentUser];
    document.getElementById('balance').innerText = Math.floor(u.balance).toLocaleString();
    document.getElementById('xp-fill').style.width = (u.xp / (u.level * 20)) + "%";
}

function toggleProfile() {
    const m = document.getElementById('profile-modal');
    const u = users[currentUser];
    if(m.style.display === 'none') {
        document.getElementById('p-user').innerText = currentUser;
        document.getElementById('p-city').innerText = u.city;
        document.getElementById('p-level').innerText = u.level;
        document.getElementById('p-inv').innerText = u.inv.length;
        m.style.display = 'flex';
    } else m.style.display = 'none';
}

function save() { localStorage.setItem('birhat_users', JSON.stringify(users)); }
function cikisYap() { location.reload(); }
            
