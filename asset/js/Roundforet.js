// ============================================================
// ROUNDFORET.JS — Exploration avec fond image scrollable
// ============================================================
//
// Paramètres URL :
//   arena=1          identifiant de la mission (MISSION_CONFIG)
//   player=swordsman personnage choisi
//   bg=foret1.png    image de fond (dans asset/img/background_fight/)
//   from=map_mission page d'origine pour le bouton retour
//   mapW=2400        largeur totale de la carte virtuelle en pixels  (défaut: 2400)
//   mapH=1350        hauteur totale de la carte virtuelle en pixels  (défaut: 1350)
//
// Plus mapW/mapH sont grands par rapport à la vue (800×450),
// plus on peut scroller loin = image plus "dézoomée".
// Exemple : mapW=1600,mapH=900 → image×2 de zoom
//           mapW=3200,mapH=1800 → image×4 de zoom (très dézoomée)
// ============================================================

// ================================
// PARAMÈTRES URL
// ================================
const _params   = new URLSearchParams(window.location.search);
const _arenaId  = Number(_params.get("arena"))  || 1;
const _playerId = _params.get("player")         || "swordsman";
const _bgFile   = _params.get("bg")             || "foret1.png";
const _fromMap  = _params.get("from")           || "map_mission";

// Taille de la carte virtuelle (contrôle le scroll / zoom ressenti)
const MAP_WORLD_W = Number(_params.get("mapW")) || 2400;
const MAP_WORLD_H = Number(_params.get("mapH")) || 1350;

// Position restaurée après un combat (si on revient de fight_mission)
const _startX = Number(_params.get("px")) || MAP_WORLD_W / 2;
const _startY = Number(_params.get("py")) || MAP_WORLD_H / 2;

// ================================
// CONFIGURATION
// ================================
const VIEW_W           = 800;
const VIEW_H           = 450;
const CONTAINER_PADDING = 40;
const PLAYER_RADIUS    = 14;
const PLAYER_SPEED     = 180;       // px/s dans les coordonnées monde
const ENCOUNTER_INTERVAL = 5;       // secondes entre chaque rencontre

// ================================
// DOM
// ================================
const missionCfg = MISSION_CONFIG[_arenaId];
document.getElementById("mission-label").textContent =
    missionCfg ? missionCfg.name : "Exploration";
document.getElementById("btn-back").href = `${_fromMap}.html`;

const timerValEl   = document.getElementById("timer-val");
const overlayEl    = document.getElementById("combat-overlay");
const overlayCount = document.getElementById("overlay-count");

// ================================
// CANVAS
// ================================
const canvas = document.getElementById("mapCanvas");
const ctx    = canvas.getContext("2d");
let   scale  = 1;

function resizeCanvas() {
    scale = Math.min(
        (window.innerWidth  - CONTAINER_PADDING) / VIEW_W,
        (window.innerHeight - CONTAINER_PADDING) / VIEW_H
    );
    canvas.width  = Math.floor(VIEW_W  * scale);
    canvas.height = Math.floor(VIEW_H  * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ================================
// FOND IMAGE (scrollable)
// ================================
const mapBg = new Image();
mapBg.src   = `asset/img/background_fight/${_bgFile}`;

// La caméra pointe vers un coin du monde (en coordonnées monde)
// et on extrait la portion visible dans la vue 800×450.
let camX = _startX - VIEW_W / 2;
let camY = _startY - VIEW_H / 2;

function clampCam() {
    camX = Math.max(0, Math.min(MAP_WORLD_W - VIEW_W, camX));
    camY = Math.max(0, Math.min(MAP_WORLD_H - VIEW_H, camY));
}
clampCam();

function drawBackground() {
    if (!mapBg.complete || mapBg.naturalWidth === 0) {
        // Fallback : fond vert sombre si l'image n'est pas encore chargée
        ctx.fillStyle = "#1a2a1a";
        ctx.fillRect(0, 0, VIEW_W, VIEW_H);
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.font = "italic 13px Arial";
        ctx.textAlign = "center";
        ctx.fillText("Chargement…", VIEW_W / 2, VIEW_H / 2);
        return;
    }

    // Calcule le ratio source pour extraire la bonne portion de l'image
    // L'image entière représente MAP_WORLD_W × MAP_WORLD_H
    const srcX = (camX / MAP_WORLD_W) * mapBg.naturalWidth;
    const srcY = (camY / MAP_WORLD_H) * mapBg.naturalHeight;
    const srcW = (VIEW_W / MAP_WORLD_W) * mapBg.naturalWidth;
    const srcH = (VIEW_H / MAP_WORLD_H) * mapBg.naturalHeight;

    ctx.drawImage(mapBg, srcX, srcY, srcW, srcH, 0, 0, VIEW_W, VIEW_H);
}

// ================================
// JOUEUR
// ================================
// Coordonnées en espace monde (pas vue)
const player = {
    x:     _startX,
    y:     _startY,
    destX: null,
    destY: null,
};

// Clic → destination en coordonnées monde
canvas.addEventListener("click", (e) => {
    if (combatActive) return;
    const rect   = canvas.getBoundingClientRect();
    const viewX  = (e.clientX - rect.left)  / scale;
    const viewY  = (e.clientY - rect.top)   / scale;
    player.destX = viewX + camX;
    player.destY = viewY + camY;
});

function updatePlayer(dt) {
    if (player.destX === null) return;

    const dx   = player.destX - player.x;
    const dy   = player.destY - player.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 3) {
        player.x = player.destX;
        player.y = player.destY;
        player.destX = null;
        player.destY = null;
        return;
    }

    const step = Math.min(PLAYER_SPEED * dt, dist);
    player.x += (dx / dist) * step;
    player.y += (dy / dist) * step;

    // Empêche de sortir des bornes
    player.x = Math.max(PLAYER_RADIUS, Math.min(MAP_WORLD_W - PLAYER_RADIUS, player.x));
    player.y = Math.max(PLAYER_RADIUS, Math.min(MAP_WORLD_H - PLAYER_RADIUS, player.y));
}

function updateCamera() {
    // La caméra suit le joueur en douceur
    const targetX = player.x - VIEW_W / 2;
    const targetY = player.y - VIEW_H / 2;
    camX += (targetX - camX) * 0.12; // lerp doux
    camY += (targetY - camY) * 0.12;
    clampCam();
}

function drawPlayer() {
    // Convertit coordonnées monde → vue
    const px = player.x - camX;
    const py = player.y - camY;

    // Halo
    ctx.beginPath();
    ctx.arc(px, py, PLAYER_RADIUS + 6, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(240,192,64,0.18)";
    ctx.fill();

    // Corps
    ctx.beginPath();
    ctx.arc(px, py, PLAYER_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle   = "#f0c040";
    ctx.shadowColor = "#f0c040";
    ctx.shadowBlur  = 18;
    ctx.fill();
    ctx.shadowBlur  = 0;

    ctx.strokeStyle = "#fff";
    ctx.lineWidth   = 2;
    ctx.stroke();

    // Ligne pointillée vers la destination
    if (player.destX !== null) {
        const dx = player.destX - camX;
        const dy = player.destY - camY;

        ctx.beginPath();
        ctx.arc(dx, dy, 5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(240,192,64,0.4)";
        ctx.lineWidth   = 1.5;
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(dx, dy);
        ctx.strokeStyle = "rgba(240,192,64,0.2)";
        ctx.lineWidth   = 1;
        ctx.setLineDash([4, 6]);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// ================================
// TITRE SUR CANVAS
// ================================
function drawTitle() {
    const label = missionCfg ? missionCfg.name : "Exploration";

    ctx.fillStyle = "rgba(0,0,0,0.55)";
    roundRect(ctx, VIEW_W / 2 - 120, 8, 240, 34, 6);
    ctx.fill();

    ctx.fillStyle    = "#f0c040";
    ctx.font         = "bold 16px Arial";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`✦  ${label}  ✦`, VIEW_W / 2, 25);
}

function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
}

// ================================
// SYSTÈME DE RENCONTRE
// ================================
let encounterTimer = ENCOUNTER_INTERVAL;
let combatActive   = false;

function triggerEncounter() {
    combatActive = true;
    overlayEl.classList.add("active");

    // Compte à rebours 1s puis redirection
    let count = 1;
    overlayCount.textContent = count;

    const interval = setInterval(() => {
        count--;
        overlayCount.textContent = Math.max(0, count);
        if (count <= 0) {
            clearInterval(interval);
            goFight();
        }
    }, 1000);
}

function goFight() {
    const enemies = missionCfg?.enemies ?? ["skeleton"];
    const enemy   = enemies[Math.floor(Math.random() * enemies.length)];
    const bg      = _bgFile;
    window.location.href =
        `fight_mission.html?arena=${_arenaId}&player=${_playerId}&bg=${bg}&enemy=${enemy}&from=roundForet&mapW=${MAP_WORLD_W}&mapH=${MAP_WORLD_H}&px=${Math.round(player.x)}&py=${Math.round(player.y)}`;
}

// ================================
// GAME LOOP
// ================================
let lastTime = 0;

function loop(timestamp) {
    const dt = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime  = timestamp;

    if (!combatActive) {
        updatePlayer(dt);
        updateCamera();

        // Décompte rencontre
        encounterTimer -= dt;
        timerValEl.textContent = Math.max(0, Math.ceil(encounterTimer));

        if (encounterTimer <= 0) {
            encounterTimer = ENCOUNTER_INTERVAL;
            triggerEncounter();
        }
    }

    ctx.clearRect(0, 0, VIEW_W, VIEW_H);
    drawBackground();
    drawPlayer();
    drawTitle();

    requestAnimationFrame(loop);
}

requestAnimationFrame(loop);