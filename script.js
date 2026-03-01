// Önceki script.js içeriğine ek olarak şunları güncelle:

function guncelleArayuz() {
    document.getElementById('balance').innerText = users[currentUser].balance.toLocaleString(); // Rakamları 1.000 şeklinde ayırır
    document.getElementById('crystal').innerText = users[currentUser].crystal || 0;
}

function apexKazan() {
    users[currentUser].balance += users[currentUser].clickPower;
    
    // Tıklama efekti için küçük bir sarsıntı
    const btn = document.getElementById('main-clicker');
    btn.style.transform = "scale(0.95)";
    setTimeout(() => btn.style.transform = "scale(1)", 50);

    guncelleArayuz();
    saveData();
}
function saveData() {
    localStorage.setItem('apex_users', JSON.stringify(users)); // Tüm ilerleme kaydedilir
}

function guncelleArayuz() {
    // Sayıları 1.000, 10.000 şeklinde formatlar (Profesyonel görünüm)
    document.getElementById('balance').innerText = users[currentUser].balance.toLocaleString();
    document.getElementById('crystal').innerText = (users[currentUser].crystal || 0).toLocaleString();
}

function tabDegistir(tabName) {
    document.getElementById('buildings').style.display = tabName === 'buildings' ? 'block' : 'none';
    // Diğer sekmeler buraya eklenebilir
}
