// =======================
// 🐱 猫
// =======================
const cat = document.getElementById("cat");
const enemy = document.getElementById("enemy");

// =======================
// フレーム定義
// =======================
// 第一形態
const walkFrames = [
  "./img/cat/cat-walk-1.webp",
  "./img/cat/cat-walk-2.webp",
  "./img/cat/cat-walk-3.webp",
  "./img/cat/cat-walk-4.webp",
];

// 第二形態
const flyFrames = [
  "./img/cat/cat-fry-1.webp",
  "./img/cat/cat-fry-2.webp",
  "./img/cat/cat-fry-3.webp",
];

// 第三形態
const flyFrames2 = [
  "./img/cat/nue-fly-1.webp",
  "./img/cat/nue-fly-2.webp",
  "./img/cat/nue-fly-3.webp",
  "./img/cat/nue-fly-4.webp",
];

// 待機
const idleFrames = [
  "./img/cat/cat-idle-1.webp",
  "./img/cat/cat-idle-2.webp",
];

const sleepFrames = [
  "./img/cat/sleep.webp",
];

// 攻撃
const punchFrames = [
  "./img/cat/cat-punch-1.webp",
  "./img/cat/cat-punch-2.webp",
  "./img/cat/cat-punch-2.webp",
];

const scratchFrames = [
  "./img/cat/cat-attack-1.webp",
  "./img/cat/cat-attack-1.webp",
  "./img/cat/cat-attack-1.webp",
  "./img/cat/cat-attack-2.webp",
  "./img/cat/cat-attack-2.webp",
  "./img/cat/cat-attack-2.webp",
  "./img/cat/cat-attack-2.webp",
];

const biteFrames = [
  "./img/cat/cat-bite-1.webp",
  "./img/cat/cat-bite-1.webp",
  "./img/cat/cat-bite-1.webp",
  "./img/cat/cat-bite-2.webp",
  "./img/cat/cat-bite-2.webp",
  "./img/cat/cat-bite-2.webp",
  "./img/cat/cat-bite-2.webp",
];

// 第三形態攻撃
const firePunchFrames = [
  "./img/cat/fire-punch-1.webp",
  "./img/cat/fire-punch-1.webp",
  "./img/cat/fire-punch-1.webp",
  "./img/cat/fire-punch-1.webp",
  "./img/cat/fire-punch-2.webp",
  "./img/cat/fire-punch-2.webp",
  "./img/cat/fire-punch-2.webp",
  "./img/cat/fire-punch-2.webp",
];

const fireBreathFrames = [
  "./img/cat/breath-1.webp",
  "./img/cat/breath-1.webp",
  "./img/cat/breath-2.webp",
  "./img/cat/breath-2.webp",
  "./img/cat/breath-2.webp",
  "./img/cat/breath-3.webp",
  "./img/cat/breath-3.webp",
  "./img/cat/breath-3.webp",
];

// =======================
// 状態
// =======================
let mouseX = innerWidth / 2;
let mouseY = innerHeight / 2;
let catX = mouseX;
let catY = mouseY;

let state = "idle"; // idle / move / attack / evolving
let attackType = "punch";
let frameIndex = 0;
let frameTimer = 0;
let attackTimer = 0;

const ATTACK_DURATION = 40;

let hasWings = false;
let isThirdForm = false;
let pendingEvolution = null;

// sleep 管理
let idleStartTime = null;
let isSleeping = false;

// =======================
// 👾 敵
// =======================
const butterflyFrames = [
  "./img/enemy/butterfly-1.webp",
  "./img/enemy/butterfly-2.webp",
];

const snakeFrames = [
  "./img/enemy/snake-1.webp",
  "./img/enemy/snake-2.webp",
];

let enemyType = "butterfly"; // butterfly / transitioning / snake / none
let enemyFrames = butterflyFrames;

let eX = Math.random() * innerWidth;
let eY = Math.random() * innerHeight;
let eTX = eX;
let eTY = eY;
let eFrameIndex = 0;
let eFrameTimer = 0;

// =======================
// 🖱 入力
// =======================
document.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

document.addEventListener("click", e => {
  if (state === "evolving") return;

  // 起きる
  idleStartTime = null;
  isSleeping = false;

  state = "attack";
  attackTimer = 0;
  frameIndex = 0;

  if (!hasWings) {
    attackType = "punch";
  } else if (!isThirdForm) {
    attackType = e.ctrlKey ? "bite" : "scratch";
  } else {
    attackType = e.ctrlKey ? "breath" : "firePunch";
  }
});

// =======================
// 共通
// =======================
function hitEnemy() {
  return Math.hypot(catX - eX, catY - eY) < 40;
}

setInterval(() => {
  eTX = Math.random() * (innerWidth - 50);
  eTY = Math.random() * (innerHeight - 50);
}, 2500);

// =======================
// 🧬 進化演出
// =======================
function startEvolution(cb) {
  state = "evolving";
  cat.classList.add("evolve-glow");

  setTimeout(() => {
    cat.classList.remove("evolve-glow");
    cb();
    state = "idle";
    idleStartTime = null;
  }, 1200);
}

// =======================
// 🎮 メインループ
// =======================
function animate() {
  frameTimer++;

  const speed =
    isThirdForm ? 0.15 :
    hasWings ? 0.12 : 0.08;

  const dx = mouseX - catX;
  const dy = mouseY - catY;
  const dist = Math.hypot(dx, dy);

  // ===== 攻撃 =====
  if (state === "attack") {
    attackTimer++;

    let frames = punchFrames;
    if (isThirdForm) {
      frames = attackType === "breath"
        ? fireBreathFrames
        : firePunchFrames;
    } else if (hasWings) {
      frames = attackType === "bite"
        ? biteFrames
        : scratchFrames;
    }

    if (frameTimer % 6 === 0) {
      frameIndex = (frameIndex + 1) % frames.length;
      cat.src = frames[frameIndex];
    }

    if (enemyType !== "none" && enemyType !== "transitioning" && hitEnemy()) {
      if (enemyType === "butterfly") {
        pendingEvolution = "toSecond";
        enemyType = "transitioning";
        enemy.style.display = "none";
      } else if (enemyType === "snake") {
        pendingEvolution = "toThird";
        enemyType = "none";
        enemy.style.display = "none";
      }
    }

    if (attackTimer > ATTACK_DURATION) {
      state = "idle";
      frameIndex = 0;

      if (pendingEvolution === "toSecond") {
        pendingEvolution = null;
        startEvolution(() => {
          hasWings = true;
          enemyType = "snake";
          enemyFrames = snakeFrames;
          enemy.style.display = "block";
        });
      } else if (pendingEvolution === "toThird") {
        pendingEvolution = null;
        startEvolution(() => {
          isThirdForm = true;
        });
      }
    }

  // ===== 移動 =====
  } else if (state !== "evolving" && dist > 10) {
    state = "move";
    idleStartTime = null;
    isSleeping = false;

    catX += dx * speed;
    catY += dy * speed;

    let moveFrames = walkFrames;
    if (isThirdForm) moveFrames = flyFrames2;
    else if (hasWings) moveFrames = flyFrames;

    if (frameTimer % 6 === 0) {
      frameIndex = (frameIndex + 1) % moveFrames.length;
      cat.src = moveFrames[frameIndex];
    }

  // ===== 待機 =====
  } else if (state !== "evolving") {
    if (state !== "idle") {
      state = "idle";
      idleStartTime = performance.now();
      frameIndex = 0;
    }

    const now = performance.now();
    if (idleStartTime && now - idleStartTime > 2000) {
      isSleeping = true;
    }

    const frames = isSleeping ? sleepFrames : idleFrames;

    if (frameTimer % 20 === 0) {
      frameIndex = (frameIndex + 1) % frames.length;
      cat.src = frames[frameIndex];
    }
  }

  cat.style.transform =
    dx < 0
      ? `translate(${catX}px, ${catY}px) scaleX(1)`
      : `translate(${catX}px, ${catY}px) scaleX(-1)`;

  requestAnimationFrame(animate);
}
animate();

// =======================
// 👾 敵ループ
// =======================
function animateEnemy() {
  if (enemyType === "none") return;

  eX += (eTX - eX) * 0.02;
  eY += (eTY - eY) * 0.02;

  eFrameTimer++;
  if (eFrameTimer % 10 === 0) {
    eFrameIndex = (eFrameIndex + 1) % enemyFrames.length;
    enemy.src = enemyFrames[eFrameIndex];
  }

  const dir = eTX - eX < 0 ? -1 : 1;
  enemy.style.transform =
    `translate(${eX}px, ${eY}px) scaleX(${dir})`;

  requestAnimationFrame(animateEnemy);
}
animateEnemy();
