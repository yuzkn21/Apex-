let users = JSON.parse(localStorage.getItem('apex_users')) || {};
let currentUser = null;

const properties = [
    { id: 1, type: 'dukkan', name: 'Apex Market', price: 1500, income: 250, level: 1, img: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=200' },
    { id: 2, type: 'ciftlik', name: 'Zeytin Bahçesi', price: 20000, income: 3500, level: 10, img: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=200' },
    { id: 3, type: 'fabrika', name: 'Tekstil Fabrikası', price: 150000, income: 22000, level: 25, img: 'https://images.unsplash.com/photo-1558444458-5f75bc94356a?w=200' },
    { id: 4, type: 'maden', name: 'Altın Madeni', price: 450000, income: 65000, level: 40, img: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=200' },
    { id: 5, type: 'marka', name: 'Birhat Global', price: 2500000, income: 350000, level: 50, img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400' }
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
        save(); alert("Kayıt başarılı!"); authTab('login');
    }
}

function girisYap() {
    const u = document.getElementById('l-user').value.trim();
    const p = document.getElementById('l-pass').value;
    if(users[u] && users[u].password === p) {
        currentUser = u;
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('game-section').style.display = 'block';
        document.getElementById('display-user').innerText = currentUser;
        updateUI(); displayMarket('dukkan'); startSessizBotlar();
    }
}

function switchPane(p) {
    document.querySelectorAll('.pane').forEach(el => el.style.display = 'none');
    document.getElementById('pane-' + p).style.display = 'block';
    document.getElementById('category-bar').style.display = (p === 'shops') ? 'flex' : 'none';
    if(p === 'markalar') displayMarket('marka', 'brand-list');
}

function displayMarket(type, target = 'property-list') {
    const list = document.getElementById(target);
    const user = users[currentUser];
    list.innerHTML = "";
    properties.filter(p => p.type === type).forEach(p => {
        const isLocked = user.level < p.level;
        const owns = user.inventory.includes(p.id);
        list.innerHTML += `
            <div class="card ${isLocked ? 'locked' : ''}">
                <img src="${p.img}">
                <div class="card-body">
                    <h4>${p.name}</h4>
                    <small>${isLocked ? 'Lvl ' + p.level : user.city}</small>
                    <p>+${p.income.toLocaleString()} Apex</p>
                </div>
                ${owns ? `<button onclick="satisYap(${p.id})" class="btn-sell">SAT</button>` : 
                `<button onclick="esyaAl(${p.id})" ${isLocked ? 'disabled' : ''} class="btn-buy">${p.price}🪙</button>`}
            </div>`;
    });
}

function satisYap(id) {
    const p = properties.find(x => x.id === id);
    const u = users[currentUser];
    u.balance += p.income; u.xp += (p.type === 'marka' ? 1000 : 200);
    if(u.xp >= u.level * 2000) { u.level++; u.xp = 0; alert("Level Up!"); }
    updateUI(); save();
}

function esyaAl(id) {
    const p = properties.find(x => x.id === id);
    const u = users[currentUser];
    if(u.balance >= p.price) { u.balance -= p.price; u.inventory.push(id); save(); displayMarket(p.type); updateUI(); }
}

function toggleProfile() {
    const m = document.getElementById('profile-modal');
    const u = users[currentUser];
    if(m.style.display === 'none') {
        document.getElementById('p-name').innerText = currentUser;
        document.getElementById('p-city').innerText = u.city;
        document.getElementById('p-level').innerText = u.level;
        m.style.display = 'flex';
    } else m.style.display = 'none';
}

function gunlukOdulAl() {
    const u = users[currentUser];
    if(Date.now() - u.lastDaily > 86400000) {
        u.balance += 5000; u.lastDaily = Date.now(); save(); updateUI(); alert("5000 Apex alındı!");
    } else alert("Yarın gel!");
}

function startSessizBotlar() { setInterval(() => console.log("Bot yatırımı..."), 30000); }
function updateUI() {
    const u = users[currentUser];
    document.getElementById('balance').innerText = Math.floor(u.balance).toLocaleString();
    document.getElementById('u-level').innerText = u.level;
    document.getElementById('xp-fill').style.width = (u.xp / (u.level * 2000) * 100) + "%";
}
function save() { localStorage.setItem('apex_users', JSON.stringify(users)); }
function cikisYap() { location.reload(); }
