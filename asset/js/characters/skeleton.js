// ============================================================
// PERSONNAGE : SKELETON
// ============================================================
// Ce fichier contient TOUTES les données du Skeleton :
// stats, sprites, spells ET configuration de l'IA.
// Aucune logique de jeu ici — uniquement de la configuration.
// ============================================================

const SKELETON = {
    id: "skeleton",
    name: "Skeleton",
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
            path: "asset/img/Skeleton/Idle/Idle_Skeleton{i}.png",
            count: 6,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.12, loop: true,
        },
        walk: {
            path: "asset/img/Skeleton/Walk/Walk_Skeleton{i}.png",
            count: 8,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.1, loop: true,
        },
        AA: {
            path: "asset/img/Skeleton/AA/AA_Skeleton{i}.png",
            count: 6,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.08, loop: false,
            damageFrames: [4], damageHit: [20],
        },
        Spell1: {
            path: "asset/img/Skeleton/Spell1/Spell1_Skeleton{i}.png",
            count: 7,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.08, loop: false,
            damageFrames: [4], damageHit: [80],
        },
        Spell2: {
            path: "asset/img/Skeleton/Spell2/Spell2_Skeleton{i}.png",
            count: 4,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.08, loop: false,
            damageFrames: [2], damageHit: [10],
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
            Spell1: [3, 6, 9],
            Spell2: [5],
        },
    },

    // Pas de spellThumbnails : l'ennemi n'a pas de HUD de spells
};