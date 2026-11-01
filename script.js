
const $ = (id) => document.getElementById(id);

let currentScreen = 1;
let candlesBlown = false;
let letterOpened = false;
let musicOn = false;
let connectedStars = [];
let doorOpened = false;
let floatyTimer = null;
let currentMemory = 0;

/* BIRTHDAY MUSIC */
const birthdaySong = new Audio("music/birthday.mp3.mp3");
birthdaySong.loop = true;
birthdaySong.volume = 0.5;

birthdaySong.addEventListener("ended", () => {
  musicOn = false;
  const button = $("musicBtn");
  if (button) button.textContent = "♫ Play music";
});

/* MEMORY PHOTOS */
const memories = [
  {
    image: "memories/memory1.jpg",
    caption: "The beginning of beautiful memories ♡"
  },
  {
    image: "memories/memory2.jpg",
    caption: "A moment worth remembering ✨"
  },
  {
    image: "memories/memory3.jpg",
    caption: "Happiness looks like this 🌷"
  },
  {
    image: "memories/memory4.jpg",
    caption: "Forever captured in my heart 💗"
  }
];

/* NAVIGATION */
function go(number) {
  const target = $("s" + number);

  if (!target) {
    console.error("Screen not found: s" + number);
    return;
  }

  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  target.classList.add("active");
  currentScreen = number;

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

/* FLOATING DECORATIONS */
function createFloaty() {
  const container = $("floaties");
  if (!container) return;

  const symbols = ["♡", "✦", "✨", "🌸", "💗", "⋆"];
  const item = document.createElement("span");

  item.className = "floaty";
  item.textContent = symbols[Math.floor(Math.random() * symbols.length)];
  item.style.left = Math.random() * 100 + "%";
  item.style.fontSize = (12 + Math.random() * 22) + "px";
  item.style.animationDuration = (8 + Math.random() * 9) + "s";

  container.appendChild(item);
  setTimeout(() => item.remove(), 18000);
}

function startFloaties() {
  if (floatyTimer) clearInterval(floatyTimer);
  floatyTimer = setInterval(createFloaty, 650);
}

/* HEART ANIMATION */
function hearts() {
  const container = $("floaties");
  if (!container) return;

  for (let i = 0; i < 14; i++) {
    const heart = document.createElement("span");

    heart.className = "floaty";
    heart.textContent = ["💗", "💕", "♡", "💖"][Math.floor(Math.random() * 4)];
    heart.style.left = (20 + Math.random() * 60) + "%";
    heart.style.fontSize = (18 + Math.random() * 20) + "px";
    heart.style.animationDuration = (3 + Math.random() * 3) + "s";

    container.appendChild(heart);
    setTimeout(() => heart.remove(), 7000);
  }
}

/* CONFETTI */
const canvas = $("confetti");
const ctx = canvas ? canvas.getContext("2d") : null;

let confettiPieces = [];
let confettiAnimation = null;

function resizeConfetti() {
  if (!canvas || !ctx) return;

  const ratio = window.devicePixelRatio || 1;

  canvas.width = window.innerWidth * ratio;
  canvas.height = window.innerHeight * ratio;
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";

  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
}

window.addEventListener("resize", resizeConfetti);
resizeConfetti();

function confettiBurst(amount = 100) {
  if (!canvas || !ctx) return;

  const colors = [
    "#f4a2c0", "#d96e9b", "#b7a5f6",
    "#ffe6a7", "#ffffff", "#e6b5ff"
  ];

  for (let i = 0; i < amount; i++) {
    confettiPieces.push({
      x: Math.random() * window.innerWidth,
      y: -20 - Math.random() * window.innerHeight * 0.3,
      vx: (Math.random() - 0.5) * 5,
      vy: 2 + Math.random() * 5,
      size: 3 + Math.random() * 6,
      rotation: Math.random() * 360,
      spin: (Math.random() - 0.5) * 10,
      color: colors[Math.floor(Math.random() * colors.length)],
      life: 150 + Math.random() * 80
    });
  }

  if (!confettiAnimation) animateConfetti();
}

function animateConfetti() {
  if (!ctx || !canvas) return;

  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  confettiPieces = confettiPieces.filter(piece => piece.life > 0);

  confettiPieces.forEach(piece => {
    piece.x += piece.vx;
    piece.y += piece.vy;
    piece.vy += 0.025;
    piece.rotation += piece.spin;
    piece.life--;

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate(piece.rotation * Math.PI / 180);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 1.5);
    ctx.restore();
  });

  if (confettiPieces.length > 0) {
    confettiAnimation = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    confettiAnimation = null;
  }
}

function celebrate() {
  confettiBurst(180);
  hearts();
  playBirthdayChime();
}

/* CAKE AND CANDLES */
function blowCandles() {
  if (candlesBlown) {
    go(3);
    return;
  }

  candlesBlown = true;

  const cake = document.querySelector("#s2 .cake");
  const instruction = $("wishInstruction") || $("wishPrompt");
  const hint = $("candleHint");
  const button = $("blowBtn");
  const birthdayReveal = $("birthdayReveal");

  if (cake) cake.classList.add("cake-blown");
  if (instruction) instruction.classList.add("hidden");

  if (hint) {
    hint.textContent = "Wish made! May all your dreams come true. ✨🦋🌙";
  }

  if (birthdayReveal) birthdayReveal.classList.remove("hidden");
  if (button) button.textContent = "Continue to the surprise 🎉";

  confettiBurst(130);
  hearts();
  playBirthdayChime();
}

/* SECRET LETTER */
const letterMessage =
  "Happy Birthday! 💗\n\n" +
  "Aaj ke din bas itna yaad rakhna ki aap bahut special ho. " +
  "aapki life pyaar, sukoon, achhe logon aur beautiful memories se bhari rahe.\n\n" +
  "Har naya din aapke liye ek nayi opportunity laaye. " +
  "aapke dreams poore hon aur aapki smile hamesha bani rahe.\n\n" +
  "Hamesha khush raho, apna khayal rakho aur apni special sparkle kabhi mat khona. 🌷\n\n" +
  "With lots of love and birthday wishes! 🎂✨";

function openLetter() {
  if (letterOpened) return;

  const envelope = $("envelope");
  const content = $("letterContent");
  const textElement = $("letterText");

  if (!envelope || !content || !textElement) return;

  letterOpened = true;
  envelope.classList.add("open");
  content.classList.remove("hidden");
  textElement.textContent = "";

  let index = 0;

  function typeLetter() {
    if (index < letterMessage.length) {
      textElement.textContent += letterMessage.charAt(index++);
      setTimeout(typeLetter, 24);
    }
  }

  typeLetter();
  hearts();
}

async function copyLetter() {
  try {
    await navigator.clipboard.writeText(letterMessage);
    alert("Birthday letter copied! 💌");
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = letterMessage;
    document.body.appendChild(textarea);
    textarea.select();

    try {
      document.execCommand("copy");
      alert("Birthday letter copied! 💌");
    } catch (copyError) {
      alert("Please select and copy the message manually. 💗");
    }

    textarea.remove();
  }
}

/* MYSTERY GIFTS */
const gifts = {
  1: {
    title: "A pocket full of happiness! 🌸",
    message: "May every day give you a reason to smile, laugh and feel loved. You deserve all the beautiful things in life. 💗"
  },
  2: {
    title: "A little bundle of luck! 🍀",
    message: "May new opportunities find you, your hard work pay off and your dreams turn into beautiful realities. ✨"
  },
  3: {
    title: "Unlimited hugs & love! 🧸",
    message: "Sending you the biggest virtual hug, lots of warmth and a lifetime of wonderful birthday memories. Happy Birthday! 💕"
  }
};

function openGift(number) {
  const gift = gifts[number];
  const result = $("giftResult");

  if (!gift || !result) return;

  result.innerHTML = "";

  const heading = document.createElement("h2");
  heading.textContent = gift.title;

  const paragraph = document.createElement("p");
  paragraph.className = "message";
  paragraph.textContent = gift.message;

  result.append(heading, paragraph);
  confettiBurst(35);
  hearts();
}

/* NIGHT MODE */
function toggleNight() {
  document.body.classList.toggle("night");

  const isNight = document.body.classList.contains("night");
  const nightButton = document.querySelector('button[onclick="toggleNight()"]');

  if (nightButton) {
    nightButton.textContent = isNight ? "☀️ Day mode" : "🌙 Night mode";
  }
}

/* MUSIC CONTROLS */
async function toggleMusic() {
  const button = $("musicBtn");

  if (musicOn) {
    birthdaySong.pause();
    musicOn = false;
    if (button) button.textContent = "♫ Play music";
    return;
  }

  try {
    await birthdaySong.play();
    musicOn = true;
    if (button) button.textContent = "♫ Stop music";
  } catch (error) {
    alert("Music play nahi ho paaya. Please check birthday.mp3 file.");
  }
}

function stopMusic() {
  birthdaySong.pause();
  birthdaySong.currentTime = 0;
  musicOn = false;

  const button = $("musicBtn");
  if (button) button.textContent = "♫ Play music";
}

function playBirthdayChime() {
  // No extra generated sound; birthday music is controlled by the music button.
}

/* HIDDEN ORB */
function revealOrb() {
  const message = $("orbMessage");
  if (!message) return;

  message.classList.add("show");
  confettiBurst(90);
  hearts();
  playBirthdayChime();
}

/* MEMORY PHOTO BOOTH */
function showMemory() {
  const photo = $("boothPhoto");
  const caption = $("photoCaption");
  const counter = $("photoCounter");

  if (!photo || !caption || !counter) return;

  const memory = memories[currentMemory];

  photo.onerror = function () {
    photo.onerror = null;
    photo.removeAttribute("src");
    photo.alt = "Add your photo inside the memories folder";
    photo.style.objectFit = "contain";
    photo.style.background = "#fff0f6";
  };

  photo.style.opacity = "0";

  setTimeout(() => {
    photo.src = memory.image;
    photo.alt = "Birthday memory " + (currentMemory + 1);
    caption.textContent = memory.caption;
    counter.textContent = (currentMemory + 1) + " / " + memories.length;
    photo.style.opacity = "1";
  }, 150);
}

function nextMemory() {
  currentMemory = (currentMemory + 1) % memories.length;
  showMemory();
}

function previousMemory() {
  currentMemory = (currentMemory - 1 + memories.length) % memories.length;
  showMemory();
}

/* STARS - MAKE LETTER A */
const starPositions = [
  [12, 80],
  [50, 10],
  [88, 80],
  [69, 48],
  [31, 48]
];

function connectStar(index) {
  if (connectedStars.includes(index)) return;

  if (index !== connectedStars.length) {
    if ($("starHint")) {
      $("starHint").textContent = "Stars ko 1, 2, 3, 4, 5 ke order mein tap karo! ⭐";
    }
    return;
  }

  connectedStars.push(index);

  const star = document.querySelector(`#starField [data-star="${index}"]`);
  if (star) star.classList.add("connected");

  const points = connectedStars
    .map(i => `${starPositions[i][0]},${starPositions[i][1]}`)
    .join(" ");

  if ($("constellationLine")) {
    $("constellationLine").setAttribute("points", points);
  }

  if ($("starHint")) {
    $("starHint").textContent = `${connectedStars.length} / 5 stars connected ⭐`;
  }

  if (connectedStars.length === 5) {
    if ($("starHint")) $("starHint").textContent = "You made the letter A! ✨";
    if ($("wishMessage")) $("wishMessage").classList.add("show");

    confettiBurst(100);
    hearts();
    playBirthdayChime();
  }
}

function resetStars() {
  connectedStars = [];

  if ($("constellationLine")) {
    $("constellationLine").setAttribute("points", "");
  }

  document.querySelectorAll("#starField .star-point").forEach(star => {
    star.classList.remove("connected");
  });

  if ($("wishMessage")) $("wishMessage").classList.remove("show");
  if ($("starHint")) $("starHint").textContent = "0 / 5 stars connected ⭐";
}

/* MYSTERY DOOR */
function openMysteryDoor() {
  if (doorOpened) return;

  doorOpened = true;

  if ($("mysteryDoor")) $("mysteryDoor").classList.add("open");
  if ($("doorLight")) $("doorLight").classList.add("show");
  if ($("doorHint")) $("doorHint").textContent = "A little magic is coming your way... ✨";

  setTimeout(() => {
    if ($("doorMessage")) $("doorMessage").classList.add("show");

    confettiBurst(150);
    hearts();
    playBirthdayChime();
  }, 850);
}

/* SECRET SURPRISE */
function revealSurprise() {
  const message = $("surpriseMessage");
  const button = $("surpriseButton");

  if (!message || !button) return;

  message.classList.remove("hidden");
  button.style.display = "none";

  confettiBurst(80);
  hearts();
  playBirthdayChime();
}

/* LANTERN WISH */
function releaseWish() {
  const wish = $("lanternWish");
  if (wish) wish.classList.add("show");

  const button = document.querySelector("#s6 .lantern-btn");

  if (button) {
    button.textContent = "Wish Released 💗";
    button.disabled = true;
  }

  document.querySelectorAll("#s6 .lantern").forEach((lantern, index) => {
    lantern.style.animationDuration = (4 + index) + "s";
    lantern.style.transform = "translateY(-80px)";
  });
}

hearts();
function revealChildhood() {
  const memory = $("childhoodMemory");
  const button = document.querySelector('#s12 button[onclick="revealChildhood()"]');

  if (!memory || !memory.classList.contains("hidden")) return;

  memory.classList.remove("hidden");

  if (button) {
    button.textContent = "Surprise Unlocked! 💖✨";
    button.disabled = true;
  }

  confettiBurst(120);
  hearts();
}
/* GRAND FINALE */
function grandFinale() {
  confettiBurst(240);
  hearts();
  playBirthdayChime();

  const button = document.querySelector('#s7 button[onclick="grandFinale()"]');

  if (button) {
    button.textContent = "You're loved! Happy Birthday 💗";
  }
}

/* RESTART WEBSITE */
function restart() {
  candlesBlown = false;
  letterOpened = false;
  doorOpened = false;
  currentMemory = 0;

  const cake = document.querySelector("#s2 .cake");
  if (cake) cake.classList.remove("cake-blown");

  const instruction = $("wishInstruction") || $("wishPrompt");
  if (instruction) instruction.classList.remove("hidden");

  if ($("candleHint")) {
    $("candleHint").textContent = "🕯️ Candles jal rahi hain... wish maango!";
  }

  if ($("blowBtn")) $("blowBtn").textContent = "Blow the candles 🌬️";
  if ($("birthdayReveal")) $("birthdayReveal").classList.add("hidden");

  if ($("envelope")) $("envelope").classList.remove("open");
  if ($("letterContent")) $("letterContent").classList.add("hidden");
  if ($("letterText")) $("letterText").textContent = "";

  if ($("giftResult")) {
    $("giftResult").textContent = "Ek gift select karo... andar kya hai? ✨";
  }

  if ($("orbMessage")) $("orbMessage").classList.remove("show");
  if ($("surpriseMessage")) $("surpriseMessage").classList.add("hidden");
  if ($("surpriseButton")) $("surpriseButton").style.display = "";

  if ($("mysteryDoor")) $("mysteryDoor").classList.remove("open");
  if ($("doorLight")) $("doorLight").classList.remove("show");
  if ($("doorMessage")) $("doorMessage").classList.remove("show");

  if ($("doorHint")) {
    $("doorHint").textContent = "Knock knock... who's there? 💗";
  }

  const finaleButton = document.querySelector('#s7 button[onclick="grandFinale()"]');
  if (finaleButton) finaleButton.textContent = "Make this moment magical ✨";

  /* RESET CHILDHOOD SURPRISE */
  if ($("childhoodMemory")) {
    $("childhoodMemory").classList.add("hidden");
  }

  stopMusic();
  resetStars();
  showMemory();

  confettiPieces = [];

  if (confettiAnimation) {
    cancelAnimationFrame(confettiAnimation);
    confettiAnimation = null;
  }

  if (ctx && canvas) {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }

  document.body.classList.remove("night");

  const nightButton = document.querySelector('button[onclick="toggleNight()"]');
  if (nightButton) nightButton.textContent = "🌙 Night mode";

  const lanternWish = $("lanternWish");
  if (lanternWish) lanternWish.classList.remove("show");

  const lanternButton = document.querySelector("#s6 .lantern-btn");
  if (lanternButton) {
    lanternButton.textContent = "Release Your Wish ✨";
    lanternButton.disabled = false;
  }

  go(1);
}

/* START WEBSITE */
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".screen").forEach(screen => {
    screen.classList.remove("active");
  });

  const firstScreen = $("s1");
  if (firstScreen) firstScreen.classList.add("active");

  currentScreen = 1;
  startFloaties();

  memories.forEach(memory => {
    const image = new Image();
    image.src = memory.image;
  });
});

/* MAKE FUNCTIONS AVAILABLE TO HTML */
window.go = go;
window.hearts = hearts;
window.blowCandles = blowCandles;
window.celebrate = celebrate;
window.openLetter = openLetter;
window.copyLetter = copyLetter;
window.openGift = openGift;
window.toggleNight = toggleNight;
window.toggleMusic = toggleMusic;
window.stopMusic = stopMusic;
window.revealOrb = revealOrb;
window.nextMemory = nextMemory;
window.previousMemory = previousMemory;
window.connectStar = connectStar;
window.resetStars = resetStars;
window.openMysteryDoor = openMysteryDoor;
window.revealSurprise = revealSurprise;
window.grandFinale = grandFinale;
window.restart = restart;
window.releaseWish = releaseWish;
window.revealChildhood = revealChildhood;
/* TEDDY HUG INTERACTION 🧸 */
function teddyHug() {
    const teddy = document.querySelector(".teddy-picture img");
    const message = document.getElementById("teddyMessage");

    if (!teddy || !message) return;

    teddy.classList.remove("teddy-hug");
    void teddy.offsetWidth;
    teddy.classList.add("teddy-hug");

    message.classList.remove("hidden");

    confettiBurst(40);
    hearts();

    setTimeout(() => {
        teddy.classList.remove("teddy-hug");
    }, 900);
}