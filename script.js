const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const btn = document.getElementById('spin-btn');
const resultText = document.getElementById('result');

// Liste d'exemple (à remplir avec les 100 plats)
const plats = ["Lasagnes", "Sushi Maison", "Poulet Curry", "Burger", "Ratatouille", "Tacos", "Risotto", "Quiche Lorraine"];

let currentRotation = 0;

function drawWheel() {
    const sliceAngle = (2 * Math.PI) / plats.length;
    plats.forEach((plat, i) => {
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? '#ffcc00' : '#ff9900';
        ctx.moveTo(250, 250);
        ctx.arc(250, 250, 250, i * sliceAngle, (i + 1) * sliceAngle);
        ctx.fill();
        ctx.stroke();
        
        // Texte sur la roue
        ctx.save();
        ctx.translate(250, 250);
        ctx.rotate(i * sliceAngle + sliceAngle / 2);
        ctx.fillStyle = "#333";
        ctx.font = "bold 14px Arial";
        ctx.fillText(plat.substring(0, 15), 100, 5);
        ctx.restore();
    });
}

btn.addEventListener('click', () => {
    const spin = Math.floor(Math.random() * 3600) + 2000; // Rotation aléatoire
    currentRotation += spin;
    canvas.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    
    // Calcul du plat gagnant après l'animation
    setTimeout(() => {
        const actualDeg = currentRotation % 360;
        const index = Math.floor((360 - actualDeg) / (360 / plats.length)) % plats.length;
        resultText.innerText = `Ce soir, c'est : ${plats[index]} ! 🍽️`;
    }, 4000);
});

drawWheel();
