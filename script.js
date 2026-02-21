const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const resultText = document.getElementById('result-text');
const spinBtn = document.getElementById('spin-btn');
const recipeLink = document.getElementById('recipe-link');
const whatsappLink = document.getElementById('whatsapp-link');

canvas.width = 600;
canvas.height = 600;

const dataPlats = {
    printemps: [ /* ... tes 100 plats ... */ ],
    ete: [ /* ... tes 100 plats ... */ ],
    automne: [ /* ... tes 100 plats ... */ ],
    hiver: [ /* ... tes 100 plats ... */ ]
};

let currentSeason = 'printemps';
let currentRotation = 0;
let isSpinning = false;

function changeSeason(season) {
    if (isSpinning) return;
    currentSeason = season;
    document.body.className = `season-${season}`;
    document.querySelectorAll('.btn-season').forEach(btn => btn.classList.toggle('active', btn.dataset.season === season));
    drawWheel();
    
    const liaison = (season === 'printemps') ? "de " : "d'";
    const displaySeason = season === 'ete' ? 'été' : season;
    resultText.innerHTML = `Prêt pour un menu ${liaison}<strong>${displaySeason}</strong> ?`;
    
    // On cache les boutons de la rotation précédente
    recipeLink.style.display = "none";
    whatsappLink.style.display = "none";
}

function getAccentColor() {
    // CORRIGÉ : 'ete' sans accent pour correspondre à la clé de dataPlats
    const colors = { printemps: '#2ecc71', ete: '#f1c40f', automne: '#e67e22', hiver: '#3498db' };
    return colors[currentSeason] || '#27ae60';
}

function drawWheel() {
    const segments = dataPlats[currentSeason];
    const numSegments = segments.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    segments.forEach((plat, i) => {
        const angle = i * anglePerSegment;
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : getAccentColor();
        ctx.moveTo(300, 300);
        ctx.arc(300, 300, 300, angle, angle + anglePerSegment);
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.stroke();
        ctx.save();
        ctx.translate(300, 300);
        ctx.rotate(angle + anglePerSegment / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = i % 2 === 0 ? "#333" : "#fff";
        ctx.font = "bold 9px Arial";
        ctx.fillText(plat.substring(0, 25), 290, 4);
        ctx.restore();
    });
}

spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    isSpinning = true;
    
    resultText.innerHTML = "Suspense... 🎲";
    recipeLink.style.display = "none";
    whatsappLink.style.display = "none";
    
    const segments = dataPlats[currentSeason];
    const spinAngle = Math.floor(Math.random() * 3600) + 2000;
    currentRotation += spinAngle;
    
    canvas.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
        isSpinning = false;
        const actualDeg = currentRotation % 360;
        const index = Math.floor(((360 - actualDeg + 270) % 360) / (360 / segments.length));
        const platGagnant = segments[index];

        resultText.innerHTML = `✨ <strong>${platGagnant}</strong> 🍽️`;

        // 1. Lien Cookidoo
        const cookidooUrl = `https://cookidoo.fr/search/fr-FR?query=${encodeURIComponent(platGagnant)}`;
        recipeLink.href = cookidooUrl;
        recipeLink.style.display = "inline-block";

        // 2. Lien WhatsApp
        const message = `Ce soir on mange : ${platGagnant} ! 🍽️\nTrouve la recette ici : ${cookidooUrl}`;
        whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(message)}`;
        whatsappLink.style.display = "inline-block";

        // 3. Effets
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: [getAccentColor(), '#ffffff'] });
        if (window.navigator.vibrate) window.navigator.vibrate(100);

    }, 4000);
}); // <-- C'ÉTAIT CETTE FERMETURE QUI MANQUAIT !

drawWheel();
