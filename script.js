const startBtn = document.getElementById('startBtn');
const backBtn = document.getElementById('backBtn');
const hero = document.getElementById('hero');
const stage = document.getElementById('stage');
const envelope = document.getElementById('envelope');
const seal = document.getElementById('seal');
const typed = document.getElementById('typed');
const musicBtn = document.getElementById('musicBtn');
const bgMusic = document.getElementById('bgMusic');

const photos = document.querySelectorAll('.photo');
let currentPhoto = 0;
let photoInterval = null;

const letterText = `Amor mío,

Hoy, pensando en nosotros, me puse a contar los días desde aquel 7 de marzo y no pude evitar sonreír. Tres meses y algunos días en los que tú has cambiado todo: mi rutina, mis prioridades, mis mañanas y mis noches. Antes de ti los días pasaban; ahora cada día tiene un color distinto porque sé que al final estás tú.

Me encanta cómo nos reímos de cosas tontas, cómo tus ojos brillan cuando hablas de lo que te apasiona, y cómo con una sola palabra me haces sentir en casa. Me encanta tu manera de apoyarme, de entender mis silencios y de celebrar mis pequeñas victorias. A tu lado aprendí que lo cotidiano puede ser mágico: una sopa compartida, una llamada inesperada, un mensaje a media tarde que me hace olvidar cualquier problema.

Quiero que sepas que te admiro mucho. Admiro tu paciencia, tu ternura y tu valentía para ser quien eres. Gracias por creer en mí, por regalarme tu tiempo y por dejarme entrar en tus días. Gracias por los abrazos que arreglan todo, por las canciones que ahora me gustan porque te recuerdo, y por cada detalle que sale de tu corazón.

Prometo seguir cuidando este amor con la misma ganas con las que lo siento hoy: escucharte, aprender, sorprenderte y ser tu compañero en lo fácil y en lo difícil. No sé qué nos traerá el futuro, pero sí sé que quiero recorrerlo contigo, construir recuerdos nuevos y seguir sumando razones para sonreír.

Te amo más de lo que las palabras alcanzan, pero hoy te las regalo todas. Si alguna vez dudas de lo que siento, recuerda estos días y mira mi corazón: está todo allí, latiendo por ti.

Con todo mi amor,
Diego`;

let typingTimer = null;
let musicPlaying = false;
const speed = 35;

async function playMusic() {
  try {
    bgMusic.volume = 0.45;
    await bgMusic.play();
    musicBtn.textContent = '⏸ Música';
    musicPlaying = true;
  } catch (e) {
    console.log('Audio bloqueado o no disponible:', e);
  }
}

function toggleMusic() {
  if (!musicPlaying) {
    playMusic();
  } else {
    bgMusic.pause();
    musicBtn.textContent = '▶ Música';
    musicPlaying = false;
  }
}

function unlockMusicOnce() {
  playMusic();
  document.removeEventListener('click', unlockMusicOnce);
  document.removeEventListener('pointerup', unlockMusicOnce);
  document.removeEventListener('touchend', unlockMusicOnce);
}

document.addEventListener('click', unlockMusicOnce, { once: true });
document.addEventListener('pointerup', unlockMusicOnce, { once: true });
document.addEventListener('touchend', unlockMusicOnce, { once: true });

function typeLetter() {
  typed.textContent = '';
  let i = 0;
  clearInterval(typingTimer);

  typingTimer = setInterval(() => {
    typed.textContent += letterText[i];
    i++;

    if (i >= letterText.length) {
      clearInterval(typingTimer);
    }
  }, speed);
}

function startPhotoSwap() {
  if (photoInterval) return;
  photoInterval = setInterval(() => {
    photos[currentPhoto].classList.remove('active');
    currentPhoto = (currentPhoto + 1) % photos.length;
    photos[currentPhoto].classList.add('active');
  }, 3500);
}

function stopPhotoSwap() {
  if (photoInterval) {
    clearInterval(photoInterval);
    photoInterval = null;
  }
}

function openExperience() {
  hero.classList.add('hidden');
  stage.classList.remove('hidden');

  requestAnimationFrame(() => {
    envelope.classList.add('open');
    typeLetter();
    playMusic();
    startPhotoSwap();
  });
}

function resetExperience() {
  envelope.classList.remove('open');
  clearInterval(typingTimer);
  stopPhotoSwap();
  stage.classList.add('hidden');
  hero.classList.remove('hidden');
  typed.textContent = '';
}

startBtn.addEventListener('click', openExperience);
seal.addEventListener('click', openExperience);
backBtn.addEventListener('click', resetExperience);
musicBtn.addEventListener('click', toggleMusic);

const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function Particle() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.r = Math.random() * 2.2 + 0.7;
  this.vx = (Math.random() - 0.5) * 0.35;
  this.vy = Math.random() * 0.6 + 0.25;
  this.a = Math.random() * Math.PI * 2;
  this.va = (Math.random() - 0.5) * 0.03;
  this.c = ['#ff4d7d', '#ff7aa2', '#ffd7e1'][Math.floor(Math.random() * 3)];
}

Particle.prototype.draw = function() {
  ctx.save();
  ctx.translate(this.x, this.y);
  ctx.rotate(this.a);
  ctx.fillStyle = this.c;
  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.arc(0, 0, this.r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
};

Particle.prototype.update = function() {
  this.x += this.vx;
  this.y -= this.vy;
  this.a += this.va;
  if (this.y < -10) {
    this.y = canvas.height + 10;
    this.x = Math.random() * canvas.width;
  }
  if (this.x < -10) this.x = canvas.width + 10;
  if (this.x > canvas.width + 10) this.x = -10;
};

function tick() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (particles.length < 120) particles.push(new Particle());
  particles.forEach(p => { p.update(); p.draw(); });
  requestAnimationFrame(tick);
}
tick();
