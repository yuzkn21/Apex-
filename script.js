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
