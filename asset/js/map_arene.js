// ================================
// CONFIGURATION
// ================================
const MAP_WIDTH  = 800;
const MAP_HEIGHT = 450;
const CONTAINER_PADDING = 40;

// ================================
// CANVAS
// ================================
const canvas = document.getElementById("mapCanvas");
const ctx    = canvas.getContext("2d");

let scale = 1;

function resizeCanvas() {
    scale = Math.min(
        (window.innerWidth  - CONTAINER_PADDING) / MAP_WIDTH,
        (window.innerHeight - CONTAINER_PADDING) / MAP_HEIGHT
    );
    canvas.width  = Math.floor(MAP_WIDTH  * scale);
    canvas.height = Math.floor(MAP_HEIGHT * scale);
    ctx.setTransform(scale, 0, 0, scale, 0, 0);
}
window.addEventListener("resize", resizeCanvas);
resizeCanvas();

// ================================
// ASSETS
// ================================
const mapBackground = new Image();
mapBackground.src = "asset/img/map/map_arene.png";

// ================================
// ARÈNES — lues depuis map_data.js
// ================================
// Les positions x/y et métadonnées viennent de ARENAS_CONFIG (map_data.js).
// On convertit l'objet en tableau pour l'itération.
const arenas = Object.entries(ARENAS_CONFIG).map(([id, cfg]) => ({
    id:   Number(id),
    name: cfg.name,
    x:    cfg.x,
    y:    cfg.y,
}));

const POINT_RADIUS = 14;
const POINT_COLOR  = "#e74c3c";
const POINT_HOVER  = "#ff6b6b";
const POINT_BORDER = "#fff";
const PULSE_MAX    = 22;
const TOOLTIP_PAD  = 8;

// ================================
// ÉTAT
// ================================
let hoveredArena = null;
let pulseTimer   = 0;
let hoveredBack  = false;

// Bouton retour
const BACK_BTN = { x: 14, y: MAP_HEIGHT - 14 - 34, w: 110, h: 34, r: 6 };

// ================================
// MOUSE
// ================================
canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / scale;
    const my = (e.clientY - rect.top)  / scale;

    hoveredArena = null;
    for (const arena of arenas) {
        const dx = mx - arena.x;
        const dy = my - arena.y;
        if (Math.sqrt(dx * dx + dy * dy) <= POINT_RADIUS + 6) {
            hoveredArena = arena;
            break;
        }
    }

    hoveredBack = (
        mx >= BACK_BTN.x && mx <= BACK_BTN.x + BACK_BTN.w &&
        my >= BACK_BTN.y && my <= BACK_BTN.y + BACK_BTN.h
    );

    canvas.style.cursor = (hoveredArena || hoveredBack) ? "pointer" : "default";
});

canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const mx = (e.clientX - rect.left) / scale;
    const my = (e.clientY - rect.top)  / scale;

    // Bouton retour
    if (
        mx >= BACK_BTN.x && mx <= BACK_BTN.x + BACK_BTN.w &&
        my >= BACK_BTN.y && my <= BACK_BTN.y + BACK_BTN.h
    ) {
        window.location.href = "index.html";
        return;
    }

    // Clic sur une arène → sélection du personnage avant le combat
    for (const arena of arenas) {
        const dx = mx - arena.x;
        const dy = my - arena.y;
        if (Math.sqrt(dx * dx + dy * dy) <= POINT_RADIUS + 6) {
            window.location.href = `character_select.html?arena=${arena.id}&from=map_arene`;
            return;
        }
    }
});

// ================================
// DRAW : FOND DE CARTE
// ================================
function drawBackground() {
    if (mapBackground.complete && mapBackground.naturalWidth !== 0) {
        ctx.drawImage(mapBackground, 0, 0, MAP_WIDTH, MAP_HEIGHT);
    } else {
        ctx.fillStyle = "#1a2a1a";
        ctx.fillRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
        ctx.strokeStyle = "rgba(255,255,255,0.05)";
        ctx.lineWidth = 1;
        for (let gx = 0; gx < MAP_WIDTH; gx += 40) {
            ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, MAP_HEIGHT); ctx.stroke();
        }
        for (let gy = 0; gy < MAP_HEIGHT; gy += 40) {
            ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(MAP_WIDTH, gy); ctx.stroke();
        }
        ctx.fillStyle = "rgba(255,255,255,0.2)";
        ctx.font = "italic 14px Arial";
        ctx.textAlign = "center";
        ctx.fillText("asset/img/map/map_arene.png introuvable", MAP_WIDTH / 2, MAP_HEIGHT / 2);
    }
}

// ================================
// DRAW : POINTS D'ARÈNE
// ================================
function drawArenas(deltaTime) {
    pulseTimer = (pulseTimer + deltaTime * 0.9) % 1;

    for (const arena of arenas) {
        const isHovered = hoveredArena === arena;

        // Anneau pulse
        const pulseR     = POINT_RADIUS + pulseTimer * (PULSE_MAX - POINT_RADIUS);
        const pulseAlpha = (1 - pulseTimer) * 0.5;
        ctx.beginPath();
        ctx.arc(arena.x, arena.y, pulseR, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(231, 76, 60, ${pulseAlpha})`;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Ombre
        ctx.shadowColor = isHovered ? "#ff6b6b" : "#e74c3c";
        ctx.shadowBlur  = isHovered ? 20 : 10;

        // Disque
        ctx.beginPath();
        ctx.arc(arena.x, arena.y, POINT_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = isHovered ? POINT_HOVER : POINT_COLOR;
        ctx.fill();

        // Bordure
        ctx.strokeStyle = POINT_BORDER;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Numéro
        ctx.shadowBlur = 0;
        ctx.fillStyle = "#fff";
        ctx.font = "bold 12px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(arena.id, arena.x, arena.y);

        if (isHovered) drawTooltip(arena);
    }
}

// ================================
// DRAW : TOOLTIP
// ================================
function drawTooltip(arena) {
    const label   = arena.name;
    const subtext = "Cliquer pour combattre";

    ctx.font = "bold 13px Arial";
    const labelW = ctx.measureText(label).width;
    ctx.font = "11px Arial";
    const subW = ctx.measureText(subtext).width;

    const boxW = Math.max(labelW, subW) + TOOLTIP_PAD * 2;
    const boxH = 38;

    let tx = arena.x - boxW / 2;
    let ty = arena.y - POINT_RADIUS - boxH - 8;
    tx = Math.max(4, Math.min(MAP_WIDTH - boxW - 4, tx));
    ty = Math.max(4, ty);

    ctx.fillStyle = "rgba(0,0,0,0.78)";
    roundRect(ctx, tx, ty, boxW, boxH, 6);
    ctx.fill();

    ctx.strokeStyle = "#e74c3c";
    ctx.lineWidth = 1.5;
    roundRect(ctx, tx, ty, boxW, boxH, 6);
    ctx.stroke();

    ctx.fillStyle = "#fff";
    ctx.font = "bold 13px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(label, tx + boxW / 2, ty + TOOLTIP_PAD - 1);

    ctx.fillStyle = "#aaa";
    ctx.font = "11px Arial";
    ctx.fillText(subtext, tx + boxW / 2, ty + TOOLTIP_PAD + 14);
}

function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
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
// TITRE
// ================================
function drawTitle() {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    roundRect(ctx, MAP_WIDTH / 2 - 110, 8, 220, 34, 6);
    ctx.fill();

    ctx.fillStyle = "#f0c040";
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("✦  Choisissez votre arène  ✦", MAP_WIDTH / 2, 25);
}

// ================================
// GAME LOOP
// ================================
let lastTime = 0;

function mapLoop(timestamp) {
    const deltaTime = Math.min((timestamp - lastTime) / 1000, 0.1);
    lastTime = timestamp;

    ctx.clearRect(0, 0, MAP_WIDTH, MAP_HEIGHT);
    drawBackground();
    drawArenas(deltaTime);
    drawTitle();

    requestAnimationFrame(mapLoop);
}

requestAnimationFrame(mapLoop);