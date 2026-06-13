// ============================================================
// PERSONNAGE : SWORDSMAN
// ============================================================
// Ce fichier contient TOUTES les données du Swordsman :
// stats, sprites, spells, thumbnails.
// Aucune logique de jeu ici — uniquement de la configuration.
// ============================================================

const SWORDSMAN = {
    id: "swordsman",
    name: "Swordsman",
    thumbnail: "asset/img/Swordsman/SM_thumbnail.png", // affiché sur l'écran de sélection

    // --------------------------------
    // STATS
    // --------------------------------
    maxHp:   1000,
    aaSpeed: 2,       // secondes entre chaque auto-attaque

    // --------------------------------
    // SPRITES
    // --------------------------------
    // Chaque état définit :
    //   path        : chemin avec {i} comme placeholder du numéro de frame
    //   count       : nombre de frames
    //   width/height: taille d'une frame en pixels (avant SPRITE_SCALE)
    //   offsetX/Y   : décalage d'affichage en pixels (avant SPRITE_SCALE)
    //   frameTime   : durée d'une frame en secondes
    //   loop        : true = animation en boucle, false = joue une fois puis idle
    //
    // Pour les états d'attaque :
    //   cancel      : true = peut être annulé par un spell avant le damageFrame
    //   damageFrames: [n, ...] indices de frames où les dégâts sont appliqués
    //   damageHit   : [x, ...] valeurs de dégâts correspondantes
    //
    // Pour les spells :
    //   cooldown    : durée en secondes (null = pas de cooldown)
    //   lock        : true = spell désactivé / non encore débloqué
    sprites: {
        idle: {
            path: "asset/img/Swordsman/Idle/Idle_Swordsman{i}.png",
            count: 6,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.12, loop: true,
        },
        walk: {
            path: "asset/img/Swordsman/Walk/Walk_Swordsman{i}.png",
            count: 8,
            width: 48, height: 32, offsetX: 0, offsetY: 0,
            frameTime: 0.1, loop: true,
        },
        AA: {
            path: "asset/img/Swordsman/AA/AA_Swordsman{i}.png",
            count: 7,
            width: 48, height: 28, offsetX: 7, offsetY: -1,
            frameTime: 0.08, loop: false,
            cancel: true,
            damageFrames: [4], damageHit: [50],
        },
        Spell1: {
            path: "asset/img/Swordsman/Spell1/Spell1_Swordsman{i}.png",
            count: 10,
            width: 96, height: 35, offsetX: 6, offsetY: 0,
            frameTime: 0.08, loop: false,
            cooldown: 5, lock: false,
            damageFrames: [4, 7], damageHit: [50, 25],
        },
        Spell2: {
            path: "asset/img/Swordsman/Spell2/Spell2_Swordsman{i}.png",
            count: 5,
            width: 96, height: 35, offsetX: 0, offsetY: 0,
            frameTime: 0.08, loop: false,
            cooldown: 2, lock: false,
            damageFrames: [3], damageHit: [10],
        },
        Spell3: {
            path: null, // pas encore de sprites
            count: 0,
            width: 96, height: 35, offsetX: 0, offsetY: 0,
            frameTime: 0.08, loop: false,
            cooldown: 2, lock: true,  // verrouillé
            damageFrames: [3], damageHit: [10],
        },
        Spell4: {
            path: "asset/img/Swordsman/Spell4/Spell4_Swordsman{i}.png",
            count: 12,
            width: 96, height: 35, offsetX: 2, offsetY: 3,
            frameTime: 0.08, loop: false,
            cooldown: 20, lock: false,
            damageFrames: [6, 8, 10, 11, 12], damageHit: [20, 20, 20, 20, 20],
        },
    },

    // --------------------------------
    // ICÔNES DES SPELLS (HUD)
    // --------------------------------
    spellThumbnails: {
        Spell1: "asset/img/Swordsman/Spell1/Spell1_Thumbnail.png",
        Spell2: "asset/img/Swordsman/Spell2/Spell2_Thumbnail.png",
        Spell3: "asset/img/Swordsman/Spell3/Spell3_Thumbnail.png",
        Spell4: "asset/img/Swordsman/Spell4/Spell4_Thumbnail.png",
    },
};