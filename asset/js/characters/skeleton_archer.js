// ============================================================
// PERSONNAGE : SKELETON_ARCHER
// ============================================================
// Ce fichier contient TOUTES les données du Skeleton :
// stats, sprites, spells ET configuration de l'IA.
// Aucune logique de jeu ici — uniquement de la configuration.
// ============================================================

const SKELETON_ARCHER = {
    id: "skeleton_archer",
    name: "Skeleton_Archer",
    thumbnail: "asset/img/Skeleton/SLT_thumbnail.png",

    // --------------------------------
    // STATS
    // --------------------------------
    maxHp: 1000,

    // --------------------------------
    // SPRITES
    // --------------------------------
    sprites: {
        idle: {
            path: "asset/img/Skeleton_Archer/Idle/Idle_Skeleton_Archer{i}.png",
            count: 6,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.12, loop: true,
        },
        walk: {
            path: "asset/img/Skeleton_Archer/Walk/Walk_Skeleton_Archer{i}.png",
            count: 8,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.1, loop: true,
        },
        AA: {
            path: "asset/img/Skeleton_Archer/AA/AA_Skeleton_Archer{i}.png",
            count: 9,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.08, loop: false,
            damageFrames: [7], damageHit: [30],
        },
    },

    // --------------------------------
    // IA — comportement en combat
    // --------------------------------
    // aaSpeed    : secondes entre chaque action de l'IA
    // maxCycle   : nombre d'AAs avant remise à zéro du cycle
    // spellCycles: { NomSpell: [cycleN, cycleN, ...] }
    //              → le spell est lancé à ces numéros de cycle
    //              → priorité : premier spell trouvé dans l'objet
    ai: {
        aaSpeed: 2.5,
        maxCycle: 9,
        spellCycles: {
            /*
            Spell1: [3, 6, 9],
            Spell2: [5],
            */
        },
    },

    // Pas de spellThumbnails : l'ennemi n'a pas de HUD de spells
};