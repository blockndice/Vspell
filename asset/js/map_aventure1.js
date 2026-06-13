// ============================================================
// MAP AVENTURE 1 — Grille 20×20 + déplacement du héros
// 0 = vide (noir)  |  1 = couloir (marron, marchable)  |  2 = mur (gris, collision)
// ============================================================

const MAP_GRID = [
//   0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2], // 0
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 1
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 2
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 3
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 4
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 5
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 6
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 7
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 8
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 9
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 10
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 11
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 12
    [2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2], // 13
    [2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2], // 14
    [2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2], // 15
    [2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 2, 2, 1, 2], // 16
    [2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2], // 17
    [2, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2], // 18
    [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2], // 19
];

const TILE_COLORS = {
    0: "#1a1a1a",  // mur
    1: "#c4924a",  // couloir marron clair
    2: "#888888",  // salle gris
};

const TILE_SIZE = 28;
const ROWS = MAP_GRID.length;
const COLS = MAP_GRID[0].length;

// ── Mouvement ────────────────────────────────────────────────
const HERO_SPEED    = 120;  // vitesse max en pixels/seconde
const HERO_ACCEL    = 700;  // accélération (px/s²) — plus élevé = réponse plus rapide
const HERO_FRICTION = 14;   // décélération au relâchement — plus élevé = arrêt plus brusque
const HERO_SCALE    = 1.5;  // taille du sprite : 1 = une case, 2 = deux cases, 0.5 = demi-case
const HERO_ANIM_SLOW = 1.75;  // ralentissement de l'animation idle : 1 = normal, 2 = moitié vitesse, 3 = tiers
const HERO_WALK_SPEED = 1.5;    // vitesse de l'animation marche : 1 = normal, 2 = double vitesse, 0.5 = moitié

// Rayon de collision du héros (en pixels). Réduire pour passer dans des passages plus étroits.
const HERO_RADIUS = TILE_SIZE * 0.32;

(function () {
    const params   = new URLSearchParams(window.location.search);
    const playerId = params.get("player") || "swordsman";

    const canvas = document.getElementById("mapCanvas");
    const ctx    = canvas.getContext("2d");
    const MAP_W  = COLS * TILE_SIZE;
    const MAP_H  = ROWS * TILE_SIZE;
    let scale = 1, vpW = 0, vpH = 0, camX = 0, camY = 0;

    function resizeCanvas() {
        // Math.max : la carte couvre tout l'écran, la caméra scrolle sur l'excédent
        scale = Math.max(window.innerWidth / MAP_W, window.innerHeight / MAP_H);
        canvas.width  = window.innerWidth;
        canvas.height = window.innerHeight;
        vpW = canvas.width  / scale;  // zone logique visible en largeur
        vpH = canvas.height / scale;  // zone logique visible en hauteur
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Position en pixels (centre du héros), spawn dans la première case marchable
    const hero = {
        x: 1.5 * TILE_SIZE,
        y: 1.5 * TILE_SIZE,
        vx: 0, vy: 0,
        facing: 1,      // 1 = droite, -1 = gauche
        isMoving: false,
        target: null,   // destination souris { x, y } ou null
        spriteW: 0, spriteH: 0,
        // animation idle
        frames: [], frameIdx: 0, elapsed: 0, frameTime: 0.12,
        // animation walk
        walkFrames: [], walkFrameIdx: 0, walkElapsed: 0, walkFrameTime: 0.1,
    };

    // ── Chargement des sprites du héros ──────────────────────────
    function loadHeroSprites() {
        if (typeof CHARACTERS_REGISTRY === "undefined") return;
        const charFn = CHARACTERS_REGISTRY[playerId];
        if (!charFn) return;
        const char = charFn();
        const idle = char.sprites?.idle;
        if (!idle?.path || !idle.count) return;

        hero.frameTime = (idle.frameTime ?? 0.12) * HERO_ANIM_SLOW;
        hero.spriteW   = idle.width;
        hero.spriteH   = idle.height;

        for (let i = 0; i < idle.count; i++) {
            const img = new Image(), index = i;
            img.onload = () => { hero.frames[index] = img; };
            img.src    = idle.path.replace("{i}", i + 1);
            hero.frames.push(null);
        }

        const walk = char.sprites?.walk;
        if (walk?.path && walk.count) {
            hero.walkFrameTime = (walk.frameTime ?? 0.1) * HERO_ANIM_SLOW / HERO_WALK_SPEED;
            for (let i = 0; i < walk.count; i++) {
                const img = new Image(), index = i;
                img.onload = () => { hero.walkFrames[index] = img; };
                img.src    = walk.path.replace("{i}", i + 1);
                hero.walkFrames.push(null);
            }
        }
    }

    // ── Collision : seul le tile 1 est marchable ─────────────────
    function tileAt(px, py) {
        const c = Math.floor(px / TILE_SIZE);
        const r = Math.floor(py / TILE_SIZE);
        if (r < 0 || r >= ROWS || c < 0 || c >= COLS) return -1;
        return MAP_GRID[r][c];
    }

    function canOccupy(px, py) {
        const r = HERO_RADIUS;
        return tileAt(px - r, py - r) === 1 &&
               tileAt(px + r, py - r) === 1 &&
               tileAt(px - r, py + r) === 1 &&
               tileAt(px + r, py + r) === 1;
    }

    // ── Mise à jour du mouvement ──────────────────────────────────
    const keys = new Set();

    function updateHero(dt) {
        let ix = 0, iy = 0;
        if (keys.has("ArrowUp")    || keys.has("z")) iy -= 1;
        if (keys.has("ArrowDown")  || keys.has("s")) iy += 1;
        if (keys.has("ArrowLeft")  || keys.has("q")) ix -= 1;
        if (keys.has("ArrowRight") || keys.has("d")) ix += 1;

        if (ix !== 0 || iy !== 0) {
            hero.target = null; // clavier annule la cible souris
            if (ix !== 0) hero.facing = ix > 0 ? 1 : -1;

            // Accélération normalisée (diagonale = même vitesse)
            const len = Math.sqrt(ix * ix + iy * iy);
            hero.vx += (ix / len) * HERO_ACCEL * dt;
            hero.vy += (iy / len) * HERO_ACCEL * dt;

            // Plafond à HERO_SPEED
            const speed = Math.sqrt(hero.vx * hero.vx + hero.vy * hero.vy);
            if (speed > HERO_SPEED) {
                const ratio = HERO_SPEED / speed;
                hero.vx *= ratio;
                hero.vy *= ratio;
            }
        } else if (hero.target) {
            const dx   = hero.target.x - hero.x;
            const dy   = hero.target.y - hero.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < TILE_SIZE * 0.35) {
                hero.target = null;
            } else {
                ix = dx / dist;
                iy = dy / dist;
                if (ix !== 0) hero.facing = ix > 0 ? 1 : -1;
                const len = Math.sqrt(ix * ix + iy * iy);
                hero.vx += (ix / len) * HERO_ACCEL * dt;
                hero.vy += (iy / len) * HERO_ACCEL * dt;
                const speed = Math.sqrt(hero.vx * hero.vx + hero.vy * hero.vy);
                if (speed > HERO_SPEED) {
                    hero.vx *= HERO_SPEED / speed;
                    hero.vy *= HERO_SPEED / speed;
                }
            }
        }

        if (ix === 0 && iy === 0 && !hero.target) {
            // Friction exponentielle indépendante du framerate
            const decay = Math.exp(-HERO_FRICTION * dt);
            hero.vx *= decay;
            hero.vy *= decay;
            if (Math.abs(hero.vx) < 0.5) hero.vx = 0;
            if (Math.abs(hero.vy) < 0.5) hero.vy = 0;
        }

        // Application avec glissement le long des murs
        const mx = hero.vx * dt;
        const my = hero.vy * dt;
        if (canOccupy(hero.x + mx, hero.y)) hero.x += mx; else hero.vx = 0;
        if (canOccupy(hero.x, hero.y + my)) hero.y += my; else hero.vy = 0;

        // Walk si vitesse significative, sinon idle
        const spd = Math.sqrt(hero.vx * hero.vx + hero.vy * hero.vy);
        hero.isMoving = spd > 5;

    }

    // ── Rendu de la grille ────────────────────────────────────────
    function drawGrid() {
        for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
                const tile = MAP_GRID[r][c];
                ctx.fillStyle = TILE_COLORS[tile] ?? "#000";
                ctx.fillRect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE);
                if (tile === 1) {
                    ctx.strokeStyle = "rgba(0,0,0,0.2)";
                    ctx.lineWidth   = 0.5;
                    ctx.strokeRect(c * TILE_SIZE + 0.5, r * TILE_SIZE + 0.5, TILE_SIZE - 1, TILE_SIZE - 1);
                }
            }
        }
    }

    // ── Rendu du héros ───────────────────────────────────────────
    function drawHero(dt) {
        // Halo doré
        ctx.save();
        ctx.shadowColor = "rgba(201,168,76,0.7)";
        ctx.shadowBlur  = 12;
        ctx.fillStyle   = "rgba(201,168,76,0.12)";
        ctx.fillRect(hero.x - TILE_SIZE / 2 + 2, hero.y - TILE_SIZE / 2 + 2, TILE_SIZE - 4, TILE_SIZE - 4);
        ctx.restore();

        // Choisit l'animation selon l'état du héros
        const useWalk   = hero.isMoving && hero.walkFrames.filter(Boolean).length > 0;
        const animFrames = useWalk ? hero.walkFrames.filter(Boolean) : hero.frames.filter(Boolean);
        const frameTime  = useWalk ? hero.walkFrameTime : hero.frameTime;

        if (useWalk) {
            hero.walkElapsed += dt;
            if (hero.walkElapsed >= frameTime) {
                hero.walkElapsed  -= frameTime;
                hero.walkFrameIdx  = (hero.walkFrameIdx + 1) % animFrames.length;
            }
        } else {
            hero.elapsed += dt;
            if (hero.elapsed >= frameTime) {
                hero.elapsed  -= frameTime;
                hero.frameIdx  = (hero.frameIdx + 1) % (animFrames.length || 1);
            }
        }

        if (animFrames.length > 0 && hero.spriteW > 0) {
            const frameIdx = useWalk ? hero.walkFrameIdx : hero.frameIdx;
            const img      = animFrames[Math.min(frameIdx, animFrames.length - 1)];
            const scale    = Math.min(TILE_SIZE / hero.spriteW, TILE_SIZE / hero.spriteH) * HERO_SCALE;
            const dw       = hero.spriteW * scale;
            const dh       = hero.spriteH * scale;

            ctx.save();
            ctx.translate(hero.x, hero.y);
            ctx.scale(hero.facing, 1);
            ctx.drawImage(img, -dw / 2, -dh / 2, dw, dh);
            ctx.restore();
        } else {
            // Fallback : cercle doré
            ctx.fillStyle   = "#e8c84a";
            ctx.beginPath();
            ctx.arc(hero.x, hero.y, TILE_SIZE * 0.32, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = "#a0882a";
            ctx.lineWidth   = 1.5;
            ctx.stroke();
        }
    }

    // ── Boucle de jeu ────────────────────────────────────────────
    let lastTS = null;
    function loop(ts) {
        const dt = lastTS !== null ? Math.min((ts - lastTS) / 1000, 0.05) : 0;
        lastTS   = ts;
        updateHero(dt);

        // Caméra centrée sur le héros, bloquée aux bords de la carte
        camX = Math.max(0, Math.min(hero.x - vpW / 2, MAP_W - vpW));
        camY = Math.max(0, Math.min(hero.y - vpH / 2, MAP_H - vpH));

        // Reset transform pour effacer le canvas physique entier
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Applique zoom + décalage caméra en une seule transformation
        ctx.setTransform(scale, 0, 0, scale, -camX * scale, -camY * scale);
        drawGrid();
        drawTarget();
        drawHero(dt);
        requestAnimationFrame(loop);
    }

    // ── Indicateur de cible souris ───────────────────────────────
    function drawTarget() {
        if (!hero.target) return;
        const x = hero.target.x;
        const y = hero.target.y;
        ctx.save();
        ctx.strokeStyle = "rgba(201,168,76,0.8)";
        ctx.lineWidth   = 1;
        const r = TILE_SIZE * 0.3;
        ctx.beginPath(); ctx.moveTo(x - r, y); ctx.lineTo(x + r, y); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(x, y - r); ctx.lineTo(x, y + r); ctx.stroke();
        ctx.beginPath();
        ctx.arc(x, y, r * 0.5, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(201,168,76,0.5)";
        ctx.stroke();
        ctx.restore();
    }

    // ── Saisie clavier ───────────────────────────────────────────
    const GAME_KEYS = new Set(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight","z","s","q","d"]);
    document.addEventListener("keydown", e => { if (GAME_KEYS.has(e.key)) { e.preventDefault(); keys.add(e.key); } });
    document.addEventListener("keyup",   e => keys.delete(e.key));

    // ── Clic souris → déplacement ────────────────────────────────
    canvas.addEventListener("click", e => {
        const rect = canvas.getBoundingClientRect();
        const wx = (e.clientX - rect.left) / scale + camX;
        const wy = (e.clientY - rect.top)  / scale + camY;
        if (tileAt(wx, wy) === 1) hero.target = { x: wx, y: wy };
    });

    loadHeroSprites();
    requestAnimationFrame(loop);
})();
