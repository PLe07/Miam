const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const resultText = document.getElementById('result-text');
const spinBtn = document.getElementById('spin-btn');

const dataPlats = {
    printemps: [
        "Filet de veau poêlé & carottes", "Saumon à l'oseille & riz", "Côtelettes d'agneau grillées", "Linguine au citron & crevettes", "Poulet rôti à l'estragon", "Risotto au parmesan & citron", "Escalope milanaise", "Tartine ricotta & radis", "Pavé de cabillaud vapeur", "Sauté de dinde & oignons", "Omelette aux herbes", "Magret de canard aux cerises", "Salade de PDT nouvelles", "Filet de bar grillé", "Boulettes de bœuf menthe", "Tarte fine oignons & lardons", "Gnocchis beurre de sauge", "Sole meunière & riz pilaf", "Brochettes poulet romarin", "Saltimbocca de veau", "Salade de bœuf thaï", "Pizza blanche ricotta", "Crevettes au gingembre", "Rôti de porc au lait", "Tataki de Thon", "Penne crème parmesan", "Daurade aux agrumes", "Burger de veau", "Carpaccio de bœuf pesto", "Sauté de bœuf oignons", "Œufs cocotte à la truffe", "Travers de porc caramélisés", "Lieu noir sauce hollandaise", "Ravioles du Dauphiné", "Jambon braisé au porto", "Salade poulet & avocat", "Brochettes dinde paprika", "Steak de thon grillé", "Escalope dinde moutarde", "Salade de riz au thon", "Gambas à la plancha", "Rôti de bœuf froid", "Tarte à la tomate", "Aiguillettes canard miel", "Spaghetti carbonara", "Poisson croûte noisettes", "Filet mignon au cidre", "Salade pâtes mozzarella", "Cake salé jambon-fromage", "Blanquette de veau"
    ],
    ete: [
        "Tomates anciennes & burrata", "Bœuf BBQ & maïs", "Carpaccio dorade citron vert", "Burger italien", "Gambas au pastis", "Salade Niçoise", "Spaghetti aux palourdes", "Sardines à la plancha", "Moules marinières & frites", "Gaspacho de tomates", "Melon, jambon & féta", "Saumon grillé & tian", "Pizza Margherita", "Salade pâtes pesto", "Wrap poulet grillé", "Club sandwich classique", "Tomates farcies au bœuf", "Poivrons farcis", "Escalope veau citron", "Fish Tacos", "Salade de riz arc-en-ciel", "Aubergines parmigiana", "Paëlla poulet/crevettes", "Dinde marinée citron", "Tartare de bœuf au couteau", "Filet de bar croustillant", "Salade pastèque & féta", "Calamars frits", "Penne Arrabbiata", "Côte de bœuf & tomates", "Salade poulet César", "Bruschetta tomate ail", "Carpaccio de courgettes", "Tartare saumon mangue", "Omelette poivrons confits", "Ribs sauce BBQ", "Lasagnes bolognaise", "Tomates cœurs de bœuf", "Sandwich Banh Mi", "Crevettes ail & persil", "Risotto poivrons rouges", "Porc à l'ananas", "Salade bœuf tiède", "Pizza chorizo poivrons", "Dorade entière au four", "Poulet basquaise", "Melon & jambon serrano", "Linguine thon & câpres", "Gaspacho de pastèque", "Hot-dog gourmet"
    ],
    automne: [
        "Canard aux figues", "Saucisse Toulouse & purée", "Hachis parmentier canard", "Rôti de porc aux pommes", "Velouté carottes cheddar", "Gnocchis gorgonzola", "Carbonade flamande", "Salade magret & noix", "Filet mignon moutarde", "Tajine d'agneau pruneaux", "Ravioles crème & jambon", "Côte de bœuf poivre", "Pizza trois fromages", "Sandre au beurre rouge", "Bœuf Bourguignon", "Boudin noir aux pommes", "Gratin PDT & jambon", "Escalope normande", "Soupe à l'oignon", "Ragoût bœuf carottes", "Pâtes crème de noix", "Poulet au vinaigre", "Salade betteraves & féta", "Tourte à la viande", "Lieu jaune beurre blanc", "Sauté d'agneau épicé", "Lasagnes ricotta épinards", "Burger d'automne", "Quiche lorraine", "Brochettes poulet miel", "Saumon croûte noisettes", "Côte de porc & frites", "Risotto safran parmesan", "Saucisson & PDT eau", "Salade de gésiers", "Travers porc & carottes", "Penne ragoût bœuf", "Poisson pané & purée", "Croque-monsieur & salade", "Dinde crème paprika", "Omelette chèvre herbes", "Risotto tomate mascarpone", "Échine de porc braisée", "Filet de bar vin rouge", "Spaghetti Meatballs", "Tarte tatin échalote", "Bœuf gingembre oignons", "Poulet au vin jaune", "Soupe tomate & grilled cheese", "Pavé de bœuf maître d'hôtel"
    ],
    hiver: [
        "Saint-Jacques & poireaux", "Tartiflette", "Pot-au-feu", "Raclette", "Fondue savoyarde", "Mont d'Or au four", "Boeuf carotte 12h", "Lasagnes gratinées", "Parmentier de bœuf", "Welsh au cheddar", "Gratin macaronis comté", "Filet bar sauce agrumes", "Saucisse de Morteau", "Daube provençale", "Risotto vin rouge & saucisse", "Aligot & saucisse", "Gratin crozets beaufort", "Poulet au Riesling", "Ravioles gratinées", "Filet mignon patate douce", "Côte de bœuf roquefort", "Spaghetti crème parmesan", "Velouté carottes coco", "Burger montagnard", "Poisson gratiné béchamel", "Sauté bœuf poivre noir", "Croque-madame", "Gnocchis crème jambon", "Épaule d'agneau confite", "Tajine poulet citron", "Truffade auvergnate", "Mac & Cheese", "Lieu noir beurre noisette", "Carbonade pain d'épices", "Tourte canard & PDT", "Poulet frit Kentucky", "Pasta crème de truffe", "Camembert rôti miel", "Rôti de bœuf en croûte", "Linguine saumon fumé", "Jarret porc laqué", "Chili con carne (sans haricots)", "Gratin PDT lard oignons", "Escalope veau parmesan", "Crevettes aigre-douce", "Boeuf Wellington", "Brandade de morue", "Saucisson brioché", "Risotto poulet parmesan", "Endives au jambon"
    ]
};

let currentSeason = 'printemps';
let currentRotation = 0;
let isSpinning = false;

function changeSeason(season) {
    if (isSpinning) return;
    currentSeason = season;
    
    // UI Update
    document.body.className = `season-${season}`;
    document.querySelectorAll('.btn-season').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.season === season);
    });
    
    drawWheel();
    resultText.innerText = `Prêt pour le menu de ${season} ?`;
}

function drawWheel() {
    const segments = dataPlats[currentSeason];
    const numSegments = segments.length;
    const anglePerSegment = (Math.PI * 2) / numSegments;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    segments.forEach((plat, i) => {
        const angle = i * anglePerSegment;
        
        // Couleur alternée
        ctx.beginPath();
        ctx.fillStyle = i % 2 === 0 ? '#ffffff' : getAccentColor();
        ctx.moveTo(300, 300);
        ctx.arc(300, 300, 300, angle, angle + anglePerSegment);
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.stroke();

        // Texte
        ctx.save();
        ctx.translate(300, 300);
        ctx.rotate(angle + anglePerSegment / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = i % 2 === 0 ? "#333" : "#fff";
        ctx.font = "bold 10px Arial";
        // On n'affiche le texte que s'il y a de la place ou on le cache pour la lisibilité
        ctx.fillText(plat.substring(0, 20), 280, 5);
        ctx.restore();
    });
}

function getAccentColor() {
    const colors = { printemps: '#2ecc71', ete: '#f1c40f', automne: '#e67e22', hiver: '#3498db' };
    return colors[currentSeason];
}

spinBtn.addEventListener('click', () => {
    if (isSpinning) return;
    
    isSpinning = true;
    const segments = dataPlats[currentSeason];
    const spinAngle = Math.floor(Math.random() * 3600) + 2000;
    currentRotation += spinAngle;
    
    canvas.style.transition = "transform 4s cubic-bezier(0.15, 0, 0.15, 1)";
    canvas.style.transform = `rotate(${currentRotation}deg)`;
    
    setTimeout(() => {
        isSpinning = false;
        const actualDeg = currentRotation % 360;
        const segmentAngle = 360 / segments.length;
        // Calcul de l'index pointé (le pointeur est en haut à 270 deg par rapport au canvas)
        const index = Math.floor(((360 - actualDeg + 270) % 360) / segmentAngle);
        resultText.innerHTML = `✨ On mange : <strong>${segments[index]}</strong> ! 🍽️`;
    }, 4000);
});

// Initialisation
drawWheel();

// Ajoute ces fonctions à la fin de ton fichier
const modal = document.getElementById("result-modal");
const modalPlateName = document.getElementById("modal-plate-name");

function showResult(plate) {
    modalPlateName.innerText = plate;
    modal.style.display = "block";
}

function closeModal() {
    modal.style.display = "none";
}

// Dans ton bouton spin (setTimeout), remplace la ligne du texte par :
setTimeout(() => {
    isSpinning = false;
    const actualDeg = currentRotation % 360;
    const segmentAngle = 360 / segments.length;
    const index = Math.floor(((360 - actualDeg + 270) % 360) / segmentAngle);
    
    // On affiche le résultat dans le pop-up !
    showResult(segments[index]); 
}, 4000);
