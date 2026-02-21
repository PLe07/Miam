const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const resultText = document.getElementById('result-text');
const spinBtn = document.getElementById('spin-btn');
const recipeLink = document.getElementById('recipe-link');
const whatsappLink = document.getElementById('whatsapp-link');

canvas.width = 600;
canvas.height = 600;

const dataPlats = {
    printemps: [
        "Filet de veau poêlé & carottes", "Saumon à l'oseille & riz", "Côtelettes d'agneau grillées", "Linguine au citron & crevettes", "Poulet rôti à l'estragon", "Risotto au parmesan & citron", "Escalope milanaise", "Tartine ricotta & radis", "Pavé de cabillaud vapeur", "Sauté de dinde & oignons", "Omelette aux herbes", "Magret de canard aux cerises", "Salade de PDT nouvelles", "Filet de bar grillé", "Boulettes de bœuf menthe", "Tarte fine oignons & lardons", "Gnocchis beurre de sauge", "Sole meunière & riz pilaf", "Brochettes poulet romarin", "Saltimbocca de veau", "Salade de bœuf thaï", "Pizza blanche ricotta", "Crevettes au gingembre", "Rôti de porc au lait", "Tataki de Thon", "Penne crème parmesan", "Daurade aux agrumes", "Burger de veau", "Carpaccio de bœuf pesto", "Sauté de bœuf oignons", "Œufs cocotte à la truffe", "Travers de porc caramélisés", "Lieu noir sauce hollandaise", "Ravioles du Dauphiné", "Jambon braisé au porto", "Salade poulet & avocat", "Brochettes dinde paprika", "Steak de thon grillé", "Escalope dinde moutarde", "Salade de riz au thon", "Gambas à la plancha", "Rôti de bœuf froid", "Tarte à la tomate", "Aiguillettes canard miel", "Spaghetti carbonara", "Poisson croûte noisettes", "Filet mignon au cidre", "Salade pâtes mozzarella", "Cake salé jambon-fromage", "Blanquette de veau",
        "Poulet estragon et riz", "Filet de lieu et purée carottes", "Sauté dinde légumes printaniers", "Risotto courgettes parmesan", "Pâtes jambon crème poireaux", "Boulettes bœuf et purée maison", "Gratin pommes de terre lard", "Poisson vapeur sauce hollandaise", "Sauté de porc tomate et riz", "Omelette fines herbes et PDT", "Spaghetti crevettes et ail", "Sauté de veau carottes fondantes", "Lasagnes bolognaise maison", "Pâtes saumon crème citron", "Brandade morue et PDT", "Poulet crème et poireaux", "Sauté de dinde coco et riz", "Boulettes poisson purée carotte", "Gratin courgettes fromage", "Pâtes gorgonzola et jambon", "Sauté de bœuf aux carottes", "Risotto parmesan jambon cru", "Poisson vapeur julienne légumes", "Boulettes dinde citron et riz", "Sauté porc olives et polenta", "Pâtes crème de courgette", "Cabillaud et fondue poireaux", "Gratin gnocchis à la tomate", "Poulet basilic et pâtes", "Sauté dinde italienne et riz", "Boulettes bœuf sauce tomate", "Poisson et purée parmentière", "Sauté porc ananas et riz", "Gratin de pâtes au thon", "Poulet marengo et riz", "Sauté dinde crème moutarde", "Pâtes pesto et pignons", "Poisson provençale et riz", "Boulettes dinde fromage frais", "Sauté bœuf petits oignons", "Gratin ravioles et crème", "Poulet rôti pommes grenailles", "Risotto tomate et basilic", "Poisson vapeur écrasé carotte", "Boulettes poisson sauce blanche", "Pâtes au thon et olives", "Sauté porc aux herbes et riz", "Poulet à la tomate poivrons", "Gratin courgettes et riz", "Spaghetti carbonara Thermomix"
    ],
    ete: [
        "Tomates anciennes & burrata", "Bœuf BBQ & maïs", "Carpaccio dorade citron vert", "Burger italien", "Gambas au pastis", "Salade Niçoise", "Spaghetti aux palourdes", "Sardines à la plancha", "Moules marinières & frites", "Gaspacho de tomates", "Melon, jambon & féta", "Saumon grillé & tian", "Pizza Margherita", "Salade pâtes pesto", "Wrap poulet grillé", "Club sandwich classique", "Tomates farcies au bœuf", "Poivrons farcis", "Escalope veau citron", "Fish Tacos", "Salade de riz arc-en-ciel", "Aubergines parmigiana", "Paëlla poulet/crevettes", "Dinde marinée citron", "Tartare de bœuf au couteau", "Filet de bar croustillant", "Salade pastèque & féta", "Calamars frits", "Penne Arrabbiata", "Côte de bœuf & tomates", "Salade poulet César", "Bruschetta tomate ail", "Carpaccio de courgettes", "Tartare saumon mangue", "Omelette poivrons confits", "Ribs sauce BBQ", "Lasagnes bolognaise", "Tomates cœurs de bœuf", "Sandwich Banh Mi", "Crevettes ail & persil", "Risotto poivrons rouges", "Porc à l'ananas", "Salade bœuf tiède", "Pizza chorizo poivrons", "Dorade entière au four", "Poulet basquaise", "Melon & jambon serrano", "Linguine thon & câpres", "Gaspacho de pastèque", "Hot-dog gourmet",
        "Salade pâtes pesto et poulet", "Risotto tomate mozzarella", "Poisson vapeur sauce vierge", "Salade riz jambon fromage", "Pâtes crevettes et piment", "Poulet citron thym et riz", "Sauté porc pêches et riz", "Poisson grillé et tian légumes", "Risotto aux poivrons grillés", "Salade boeuf herbes et pâtes", "Sauté poulet ananas et riz", "Pâtes crème poivron rouge", "Salade PDT et lardons", "Poisson sauce agrume et riz", "Boulettes dinde tomates cerise", "Riz au thon et olives", "Sauté boeuf soja miel riz", "Gratin courgettes fêta", "Poulet moutarde et PDT", "Salade lentilles et crudités", "Poisson vapeur et ratatouille", "Pâtes thon frais et citron", "Salade dinde fumée et melon", "Boulettes boeuf menthe et riz", "Riz poivrons et chorizo", "Sauté porc aux herbes et riz", "Poisson plancha salade tomate", "Pâtes pesto rouge et poulet", "Risotto crevettes citron vert", "Salade riz (sans haricots)", "Poulet sauce BBQ et riz", "Sauté boeuf aux oignons frais", "Gratin ravioles tomates cerise", "Boulettes dinde provençale", "Pâtes crème courgette pancetta", "Poisson vapeur purée tomates", "Sauté dinde poivrons et riz", "Salade pâtes jambon maïs", "Risotto pancetta et basilic", "Boulettes poisson citron vert", "Pâtes aux légumes du soleil", "Sauté porc aigre-douce riz", "Salade boeuf mariné crudités", "Riz sauté tomate basilic", "Boulettes dinde au sésame", "Spaghetti ail huile piment", "Poisson blanc salade poivrons", "Sauté poulet courgettes riz", "Gratin courgettes riz parmesan", "Salade lentilles et fêta"
    ],
    automne: [
        "Canard aux figues", "Saucisse Toulouse & purée", "Hachis parmentier canard", "Rôti de porc aux pommes", "Velouté carottes cumin", "Gnocchis gorgonzola", "Carbonade flamande", "Salade magret & noix", "Filet mignon moutarde", "Tajine d'agneau pruneaux", "Ravioles crème & jambon", "Côte de bœuf poivre", "Pizza trois fromages", "Sandre au beurre rouge", "Bœuf Bourguignon", "Boudin noir aux pommes", "Gratin PDT & jambon", "Escalope normande", "Soupe à l'oignon", "Ragoût bœuf carottes", "Pâtes crème de noix", "Poulet au vinaigre", "Salade betteraves & féta", "Tourte à la viande", "Lieu jaune beurre blanc", "Sauté d'agneau épicé", "Lasagnes ricotta épinards", "Burger d'automne", "Quiche lorraine", "Brochettes poulet miel", "Saumon croûte noisettes", "Côte de porc & frites", "Risotto safran parmesan", "Saucisson & PDT eau", "Salade de gésiers", "Travers porc & carottes", "Penne ragoût bœuf", "Poisson pané & purée", "Croque-monsieur & salade", "Dinde crème paprika", "Omelette chèvre herbes", "Risotto tomate mascarpone", "Échine de porc braisée", "Filet de bar vin rouge", "Spaghetti Meatballs", "Tarte tatin échalote", "Bœuf gingembre oignons", "Poulet au vin jaune", "Soupe tomate & grilled cheese", "Pavé de bœuf maître d'hôtel",
        "Hachis parmentier de canard", "Saucisse au couteau et purée", "Rôti porc pommes et PDT", "Risotto châtaignes parmesan", "Sauté bœuf oignons rouges", "Lasagnes crème de potiron", "Poulet cidre pommes et riz", "Salade gésiers noix et PDT", "Boulettes dinde tomate riz", "Gratin pâtes comté lardons", "Sauté porc moutarde et riz", "Poisson sauce vin blanc riz", "Risotto au safran parmesan", "Boulettes bœuf italien riz", "Pâtes trois fromages jambon", "Sauté dinde carottes et riz", "Salade magret fumé pommes", "Poisson vapeur purée potiron", "Riz jambalaya (sans haricots)", "Sauté bœuf (sans champignons)", "Gratin potimarron au comté", "Poulet rôti pommes grenailles", "Salade pâtes jambon noisettes", "Poisson croûte noisettes riz", "Risotto crème de noix", "Boulettes dinde épices riz", "Pâtes gorgonzola jambon", "Sauté porc pruneaux et riz", "Poisson vapeur fondue poireaux", "Gratin ravioles à la crème", "Poulet sauce tomate herbes", "Sauté bœuf aux épices riz", "Riz pilaf lardons châtaignes", "Boulettes poisson sauce blanche", "Pâtes sauce crème carotte", "Salade lentilles et saucisse", "Poisson au four panais riz", "Sauté dinde (sans champignons)", "Gratin macaronis vieux comté", "Boulettes bœuf paprika riz", "Pâtes sauce tomate chorizo", "Risotto poulet et parmesan", "Sauté porc au caramel riz", "Poisson vapeur purée patate douce", "Boulettes dinde crème fromage", "Riz sauté carottes lardons", "Salade boeuf tiède noisettes", "Spaghetti bolognaise maison", "Velouté carottes cheddar", "Gratin potimarron et riz"
    ],
    hiver: [
        "Saint-Jacques & poireaux", "Tartiflette", "Pot-au-feu", "Raclette", "Fondue savoyarde", "Mont d'Or au four", "Boeuf carotte 12h", "Lasagnes gratinées", "Parmentier de bœuf", "Welsh au cheddar", "Gratin macaronis comté", "Filet bar sauce agrumes", "Saucisse de Morteau", "Daube provençale", "Risotto vin rouge & saucisse", "Aligot & saucisse", "Gratin crozets beaufort", "Poulet au Riesling", "Ravioles gratinées", "Filet mignon patate douce", "Côte de bœuf roquefort", "Spaghetti crème parmesan", "Velouté carottes coco", "Burger montagnard", "Poisson gratiné béchamel", "Sauté bœuf poivre noir", "Croque-madame", "Gnocchis crème jambon", "Épaule d'agneau confite", "Tajine poulet citron", "Truffade auvergnate", "Mac & Cheese", "Lieu noir beurre noisette", "Carbonade pain d'épices", "Tourte canard & PDT", "Poulet frit Kentucky", "Pasta crème de truffe", "Camembert rôti miel", "Rôti de bœuf en croûte", "Linguine saumon fumé", "Jarret porc laqué", "Chili con carne (sans haricots)", "Gratin PDT lard oignons", "Escalope veau parmesan", "Crevettes aigre-douce", "Boeuf Wellington", "Brandade de morue", "Saucisson brioché", "Risotto poulet parmesan", "Endives au jambon",
        "Tartiflette au Reblochon", "Pot-au-feu carotte et PDT", "Raclette et pommes de terre", "Fondue savoyarde et pain", "Saucisse Morteau PDT vapeur", "Risotto vin blanc lardons", "Lasagnes bolognaise gratin", "Poulet à la crème et riz", "Gratin dauphinois traditionnel", "Boulettes bœuf poivre riz", "Hachis parmentier maison", "Sauté porc tomate chorizo", "Poisson blanc gratiné fromage", "Risotto au comté et jambon", "Boulettes dinde sauce suprême", "Pâtes crème parmesan noix", "Sauté dinde carottes miel", "Salade PDT alsacienne", "Poisson beurre citron riz", "Riz façon risotto safran", "Sauté boeuf vin rouge riz", "Gratin crozets jambon cru", "Poulet rôti moutarde riz", "Salade pâtes fromage jambon", "Poisson papillote purée panais", "Risotto fromages montagne", "Boulettes boeuf tomate ail", "Pâtes carbonara Thermomix", "Sauté porc pommes cidre", "Poisson crème poireau riz", "Gratin de pâtes au cheddar", "Boulettes dinde fromage riz", "Pâtes crème de noix jambon", "Risotto à la tomate séchée", "Sauté dinde épices d'hiver", "Salade boeuf oignons confits", "Poisson vapeur carottes riz", "Boulettes boeuf façon kefta", "Pâtes crème fromage bleu", "Sauté porc crème moutarde", "Gratin PDT lardons fumés", "Boulettes dinde italienne", "Pâtes sauce tomate basilic", "Risotto jambon et emmental", "Sauté boeuf carottes riz", "Poisson four crème échalote", "Boulettes poisson sauce blanche", "Riz pilaf oignons et herbes", "Salade pâtes jambon Paris", "Spaghetti crème de parmesan"
    ]
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
    
    recipeLink.style.display = "none";
    whatsappLink.style.display = "none";
}

function getAccentColor() {
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
    
    resultText.innerHTML = "Suspense... ";
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
    const segments = dataPlats[currentSeason];
    const index = Math.floor(((360 - actualDeg + 270) % 360) / (360 / segments.length));
    const platGagnant = segments[index];

    // Affichage du plat
    resultText.innerHTML = `<strong>${platGagnant}</strong>`;

    // 1. Mise à jour du lien Cookidoo
    const cookidooUrl = `https://cookidoo.fr/search/fr-FR?query=${encodeURIComponent(platGagnant)}`;
    recipeLink.href = cookidooUrl;
    recipeLink.style.display = "inline-block";

    // 2. Mise à jour du bouton Liste de Courses (WhatsApp)
    // On crée un message formaté avec des cases à cocher vides pour que tu puisses les remplir
    const messageShopping = `🛒 *LISTE DE COURSES : ${platGagnant.toUpperCase()}*\n\n` +
                            `- [ ] \n` +
                            `- [ ] \n` +
                            `- [ ] \n\n` +
                            `🔗 Recette Cookidoo : ${cookidooUrl}`;
    
    whatsappLink.href = `https://wa.me/?text=${encodeURIComponent(messageShopping)}`;
    whatsappLink.innerHTML = `🛒 Liste de courses`; // Changement du texte du bouton
    whatsappLink.style.display = "inline-block";

    // Effets visuels
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 }, colors: [getAccentColor(), '#ffffff'] });
    if (window.navigator.vibrate) window.navigator.vibrate(100);

}, 4000);
});

drawWheel();
