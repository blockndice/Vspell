// Génère des braises flottantes aléatoires
const N = 18;
for (let i = 0; i < N; i++) {
    const e = document.createElement("div");
    e.className = "ember";
    const left  = Math.random() * 100;
    const dur   = 4 + Math.random() * 6;
    const delay = Math.random() * 8;
    const h     = 20 + Math.random() * 60;
    const drift = (Math.random() - 0.5) * 60;
    e.style.cssText = `
        left: ${left}vw;
        height: ${h}px;
        animation-duration: ${dur}s;
        animation-delay: -${delay}s;
        --drift: ${drift}px;
        opacity: ${0.3 + Math.random() * 0.5};
        width: ${1 + Math.random() * 2}px;
    `;
    document.body.appendChild(e);
}