// ==========================================
// 1. VERİTABANI VE OYUN BİLGİLERİ (DETAYLI)
// ==========================================
// Kullanıcıların gelişimini kaydetmek için bulut/lokal depolama simülasyonu
let usersDB = JSON.parse(localStorage.getItem('birhat_mekani_users')) || {};
let activeUser = null;

// Tüm kategorileri içeren, detaylı ve uzun mülk listesi
const propertiesData = [
    // DÜKKANLAR
    { id: 101, type: 'dukkan', name: 'Küçük Büfe', price: 500, income: 50, icon: '🏪' },
    { id: 102, type: 'dukkan', name: 'Köşe Market', price: 2000, income: 250, icon: '🛒' },
    { id: 103, type: 'dukkan', name: 'Elektronik Mağazası', price: 7500, income: 1000, icon: '💻' },
    
    // BAHÇELER
    { id: 201, type: 'bahce', name: 'Elma Ağacı', price: 1500, income: 180, icon: '🍎' },
    { id: 202, type: 'bahce', name: 'Zeytinlik', price: 12000, income: 1600, icon: '🫒' },
    { id: 203, type: 'bahce', name: 'Ceviz Ormanı', price: 35000, income: 5000, icon: '🌳' },

    // ÇİFTLİKLER
    { id: 301, type: 'ciftlik', name: 'Tavuk Kümesi', price: 4000, income: 450, icon: '🐔' },
    { id: 302, type: 'ciftlik', name: 'Süt Çiftliği', price: 25000, income: 3200, icon: '🐄' },
    { id: 303, type: 'ciftlik', name: 'At Harası', price: 80000, income: 12000, icon: '🐎' },

    // FABRİKALAR
    { id: 401, type: 'fabrika', name: 'Tekstil Atölyesi', price: 150000, income: 22000, icon: '🧵' },
    { id: 402, type: 'fabrika', name: 'Otomobil Montajı', price: 400000, income: 65000, icon: '🚗' },
    
    // MADENLER
    { id: 501, type: 'maden', name: 'Kömür Madeni', price: 500000, income: 75000, icon: '⛏️' },
    { id: 502, type: 'maden', name: 'Altın Ocağı', price: 1200000, income: 200000, icon: '✨' },

    // MARKA (HOLDİNGLEŞME)
    { id: 601, type: 'marka', name: 'Şehir İçi Dağıtım Ağı', price: 2500000, income: 450000, icon: '🚚' },
    { id: 602, type: 'marka', name: 'Birhat Global Holding', price: 10000000, income: 2000000, icon: '🏢' }
];

// ==========================================
// 2. KAYIT VE GİRİŞ SİSTEMİ (KURALLARA UYGUN)
// ==========================================
function switchTab(tab) {
    document.getElementById('form-login').style.display = tab === 'login' ? 'flex' : 'none';
    document.getElementById('form-register').style.display = tab === 'register' ? 'flex' : 'none';
    
    document.getElementById('btn-login-tab').className = tab === 'login' ? 'active' : '';
    document.getElementById('btn-register-tab').className = tab === 'register' ? 'active' : '';
}

function saveDB() {
    // Her işlemde veriyi buluta/depolamaya kaydeder
    localStorage.setItem('birhat_mekani_users', JSON.stringify(usersDB));
}

function register() {
    const username = document.getElementById('reg-user').value.trim();
    const password = document.getElementById('reg-pass').value;
    const city = document.getElementById('reg-city').value;

    if (!username || !password || !city) {
        return alert("Lütfen tüm alanları doldur (Şehir seçimi zorunludur)!");
    }
    
    // Şifre kuralı: En az 6 karakter
    if (password.length < 6) {
        return alert("Güvenliğin için şifren en az 6 karakter olmalıdır!");
    }

    // Kullanıcı adı benzersizlik kuralı
    if (usersDB[username]) {
        return alert("Bu kullanıcı adı alınmış, lütfen başka bir isim seç.");
    }

    // Yeni kullanıcı oluşturma
    usersDB[username] = {
        password: password,
        city: city,
        apex: 2500, // Başlangıç parası
        crystal: 0,
        xp: 0,
        level: 1,
        inventory: [] // Sahip olduğu mülklerin ID listesi
    };
    
    saveDB();
    alert("Kayıt başarılı! İmparatorluğunu kurmaya hazırsın. Lütfen giriş yap.");
    switchTab('login');
}

function login() {
    const username = document.getElementById('login-user').value.trim();
    const password = document.getElementById('login-pass').value;

    if (usersDB[username] && usersDB[username].password === password) {
        activeUser = username;
        document.getElementById('auth-screen').style.display = 'none';
        document.getElementById('game-screen').style.display = 'block';
        
        updateGameUI();
        loadMarket('dukkan'); // Oyuna girince dükkanlar açılsın
    } else {
        alert("Hatalı kullanıcı adı veya şifre!");
    }
}

// ==========================================
// 3. OYUN MOTORU VE ETKİLEŞİM
// ==========================================
function updateGameUI() {
    const user = usersDB[activeUser];
    
    document.getElementById('ui-username').innerText = activeUser;
    document.getElementById('ui-level').innerText = user.level;
    document.getElementById('ui-apex').innerText = Math.floor(user.apex).toLocaleString();
    document.getElementById('ui-crystal').innerText = user.crystal.toLocaleString();

    // XP Hesaplama ve Barı Doldurma (Her seviyede zorlaşır)
    const xpGereksinimi = user.level * 1500;
    const yuzde = (user.xp / xpGereksinimi) * 100;
    document.getElementById('ui-xp-fill').style.width = Math.min(yuzde, 100) + "%";
}

function loadMarket(category) {
    const marketArea = document.getElementById('market-list');
    const user = usersDB[activeUser];
    marketArea.innerHTML = ""; // Ekranı temizle

    const filteredProps = propertiesData.filter(p => p.type === category);

    filteredProps.forEach(prop => {
        const isOwned = user.inventory.includes(prop.id);
        
        marketArea.innerHTML += `
            <div class="property-card ${isOwned ? 'owned' : ''}" onclick="interactProperty(${prop.id})">
                <div class="prop-icon-box">${prop.icon}</div>
                <div class="prop-details">
                    <h3>${prop.name}</h3>
                    <p>${isOwned ? 'Her Tıklamada: +' + prop.income.toLocaleString() + ' Apex' : 'Konum: ' + user.city}</p>
                    <div class="prop-action-btn ${isOwned ? 'btn-collect' : 'btn-buy'}">
                        ${isOwned ? 'GELİRİ TOPLA' : prop.price.toLocaleString() + ' Apex'}
                    </div>
                </div>
            </div>
        `;
    });
}

function interactProperty(id) {
    const property = propertiesData.find(p => p.id === id);
    const user = usersDB[activeUser];
    const isOwned = user.inventory.includes(id);

    if (isOwned) {
        // Gelir Toplama (Dokun ve Kazan)
        user.apex += property.income;
        
        // XP Kazanımı
        user.xp += (property.income * 0.1); // Gelirin %10'u kadar XP
        const xpGereksinimi = user.level * 1500;
        
        if (user.xp >= xpGereksinimi) {
            user.level++;
            user.xp = 0;
            user.crystal += 5; // Seviye atlayınca elmas ödülü
            alert("Tebrikler! Seviye Atladın: " + user.level + "\nÖdül: 5 Elmas");
        }
        
        updateGameUI();
        saveDB();

    } else {
        // Satın Alma İşlemi
        if (user.apex >= property.price) {
            user.apex -= property.price;
            user.inventory.push(id);
            saveDB();
            updateGameUI();
            loadMarket(property.type); // Kartın rengini güncellemek için listeyi yenile
        } else {
            alert("Bu mülkü almak için yeterli Apex'in yok! Daha fazla gelir topla.");
        }
    }
}

// ==========================================
// 4. PROFİL MODALI VE ÇIKIŞ İŞLEMLERİ
// ==========================================
function openProfile() {
    const user = usersDB[activeUser];
    document.getElementById('modal-user').innerText = activeUser;
    document.getElementById('modal-city').innerText = user.city;
    document.getElementById('modal-level').innerText = user.level;
    document.getElementById('modal-prop-count').innerText = user.inventory.length;
    document.getElementById('profile-modal').style.display = 'flex';
}

function closeProfile() {
    document.getElementById('profile-modal').style.display = 'none';
}

function logout() {
    saveDB(); // Çıkarken kesin kaydet
    location.reload(); // Sayfayı yenileyerek başa döndür
            }
            
