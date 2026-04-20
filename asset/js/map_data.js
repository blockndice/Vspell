// ============================================================
// CONFIG DES ARÈNES
// ============================================================
// Chaque arène définit :
//   name   : nom affiché
//   bg     : fichier image dans asset/img/background_fight/
//   enemy  : id du personnage ennemi (doit correspondre à un fichier
//            dans js/characters/<id>.js et à une constante globale)
//   x, y   : position du point cliquable sur la map (coordonnées logiques 800×450)
// ============================================================

const ARENAS_CONFIG = {
    1: {
        name:  "Arène des Ruines",
        bg:    "arene_ruine.png",
        enemy: "skeleton",
        x: 410, y: 215,
    },
    2: {
        name:  "Forêt Maudite",
        bg:    "arene_nuit.png",
        enemy: "skeleton",
        x: 220, y: 120,
    },
    3: {
        name:  "Arène en pierre",
        bg:    "arene_pierre.png",
        enemy: "skeleton",
        x: 240, y: 400,
    },
    4: {
        name:  "Foret verdoyante",
        bg:    "foret1.png",
        enemy: "skeleton",
        x: 200, y: 280,
    },
    5: {
        name:  "Plaine de Sang",
        bg:    "plaine_rouge1.png",
        enemy: "skeleton",
        x: 600, y: 320,
    },
    6: {
        name:  "Temple du Néant",
        bg:    "arene_neant.png",
        enemy: "skeleton",
        x: 630, y: 80,
    },
};
const MISSION_CONFIG = {
    1: {
        name:  "Foret verdoyante",
        bg:    "foret1.png",
        enemies: ["skeleton", "skeleton_archer"],
        x: 200, y: 280,
    },
};

// ============================================================
// REGISTRE DES PERSONNAGES JOUABLES
// ============================================================
// Ajouter ici chaque nouveau personnage jouable.
// La clé doit correspondre à l'id défini dans le fichier du personnage.
// La valeur est la constante globale chargée par la balise <script>.
// ============================================================

const CHARACTERS_REGISTRY = {
    swordsman: () => SWORDSMAN,
    skeleton:  () => SKELETON, // ennemi à mettre en commentaire
    skeleton_archer: () => SKELETON_ARCHER, // ennemi à mettre en commentaire
    // futur_perso: () => FUTUR_PERSO,
};