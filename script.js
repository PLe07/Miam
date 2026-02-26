const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const resultText = document.getElementById('result-text');
const spinBtn = document.getElementById('spin-btn');
const recipeLink = document.getElementById('recipe-link');
const scanBtn = document.getElementById('scan-btn');
const fileInput = document.getElementById('frigo-upload');

canvas.width = 600;
canvas.height = 600;

const dataPlats = {
    printemps: ["Filet de veau poêlé", "Saumon à l'oseille", "Linguine citron crevettes", "Omelette aux herbes", "Salade PDT nouvelles", "Sauté de bœuf oignons"],
    ete: ["Burrata tomates", "Bœuf BBQ", "Salade Niçoise", "Gaspacho", "Pizza Margherita", "Salade pastèque féta"],
    automne: ["Canard aux figues", "Saucisse purée", "Bœuf Bourguignon", "Soupe à l'oignon", "Quiche lorraine", "Gratin potimarron"],
    hiver: ["Tartiflette", "Pot-au-feu", "Raclette", "Fondue savoyarde", "Gratin macaronis", "Blanquette de veau"],
    frigo: [] 
};

let currentSeason = 'printemps';
let currentRotation = 0;
let isSpinning = false;

function changeSeason(season) {
    if (isSpinning) return;
    currentSeason = season;
    document.body.className = `season-${season}`;
    document.querySelectorAll('.btn-season').forEach(btn => btn.classList.toggle('active', btn.dataset.season === season));
    
    const pointer = document.getElementById('pointer');
    const colors = { printemps: '#2ecc71', ete: '#f1c40f', automne: '#e67e22', hiver: '#3498db', frigo: '#27ae60' };
    if (pointer) pointer.style.borderTopColor = colors[season] || '#e74c3c';

    drawWheel();
    const displaySeason = (season === 'ete') ? 'été' : (season === 'frigo' ? 'Spécial Frigo 🤖' : season);
    resultText.innerHTML = `Prêt pour un menu de <strong>${displaySeason}</strong> ?`;
    recipeLink.style.display = "none";
}

function getAccentColor() {
    const colors = { printemps: '#2ecc71', ete: '#f1c40f', automne: '#e67e22', hiver: '#3498db', frigo: '#27ae60' };
    return colors[currentSeason] || '#27ae60';
}

function drawWheel() {
    const segments = dataPlats[currentSeason];
    if (!segments || segments.length === 0) return;
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
        ctx.font = "bold 14px Arial";
        ctx.fillText(plat.substring(0, 22), 280, 5);
        ctx.restore();
    });
}

// --- LOGIQUE DE SCAN IA ---
scanBtn.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    resultText.innerHTML = "⏳ <strong>Compression et analyse...</strong>";
    
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = async () => {
            const tempCanvas = document.createElement('canvas');
            const MAX_WIDTH = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > MAX_WIDTH) { height *= MAX_WIDTH / width; width = MAX_WIDTH; }
            } else {
                if (height > MAX_WIDTH) { width *= MAX_WIDTH / height; height = MAX_WIDTH; }
            }
            tempCanvas.width = width;
            tempCanvas.height = height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = tempCanvas.toDataURL('image/jpeg', 0.7);

            try {
                const response = await fetch('/api/miam', {
                    method: 'POST',
                    body: JSON.stringify({ image: compressedBase64 }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const nouveauxPlats = await response.json();

                // Gestion de l'erreur envoyée par Python
                if (nouveauxPlats[0] && nouveauxPlats[0].startsWith("❌")) {
                    resultText.innerHTML = `<strong>${nouveauxPlats[0]}</strong>`;
                    return;
                }

                dataPlats.frigo = nouveauxPlats;
                changeSeason('frigo');
                resultText.innerHTML = "✅ <strong>Frigo scanné !</strong> Tourne la roue 🤖";
                confetti({ particleCount: 150, spread: 100 });

            } catch (err) {
                resultText.innerHTML = "<strong>❌ Erreur de connexion au serveur.</strong>";
                console.error(err);
            }
        };
    };
});

// LOGIQUE DU SPIN
spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    const segments = dataPlats[currentSeason];
    if (!segments || segments.length === 0) {
        resultText.innerText = "Scanne ton frigo d'abord !";
        return;
    }
    isSpinning = true;
    resultText.innerHTML = "Suspense...";
    recipeLink.style.display = "none";
    const spinAngle = Math.floor(Math.random() * 3600) + 2000;
    currentRotation += spinAngle;
    canvas.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    setTimeout(() => {
        isSpinning = false;
        const actualDeg = currentRotation % 360;
        const index = Math.floor(((360 - actualDeg + 270) % 360) / (360 / segments.length));
        const platGagnant = segments[index % segments.length];
        resultText.innerHTML = `<strong>${platGagnant}</strong>`;
        recipeLink.href = `https://cookidoo.fr/search/fr-FR?query=${encodeURIComponent(platGagnant)}`;
        recipeLink.style.display = "inline-block";
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: [getAccentColor(), '#ffffff'] });
    }, 4000);
});

drawWheel();
