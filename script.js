const photoData = [
  {src:"assets/vardhini-photo-1.jpeg", caption:"A little sunshine ✨"},
  {src:"assets/vardhini-photo-2.jpeg", caption:"That lovely smile 💗"},
  {src:"assets/vardhini-photo-3.jpeg", caption:"Main character energy 🌟"},
  {src:"assets/birthday-collage.jpeg", caption:"Made with love 💜"},
  {src:"assets/vardhini-photo-5.jpeg", caption:"Keep shining, birthday girl ✨"},
  {src:"assets/vardhini-photo-6.jpeg", caption:"A memory to keep 🤍"}
];

const ambient = document.getElementById("ambient");
for (let i=0; i<18; i++) {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.textContent = ["✿","✧","♡","·"][i%4];
  petal.style.left = `${Math.random()*100}%`;
  petal.style.animationDuration = `${10+Math.random()*14}s`;
  petal.style.animationDelay = `${Math.random()*12}s`;
  petal.style.fontSize = `${12+Math.random()*17}px`;
  petal.style.setProperty("--drift", `${Math.random()*160-80}px`);
  ambient.appendChild(petal);
}

// A gentle original chime pattern generated in the browser; no music file or external service required.
let audioContext = null, musicTimer = null, musicOn = false, noteIndex = 0;
const notes = [523.25,659.25,783.99,659.25,587.33,698.46,880,698.46,523.25,659.25,783.99,1046.5,783.99,659.25,587.33,523.25];
function playNote(freq, start) {
  if (!audioContext) return;
  const osc = audioContext.createOscillator(), gain = audioContext.createGain();
  osc.type = "sine"; osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.0001,start);
  gain.gain.exponentialRampToValueAtTime(0.045,start+0.04);
  gain.gain.exponentialRampToValueAtTime(0.0001,start+0.62);
  osc.connect(gain); gain.connect(audioContext.destination);
  osc.start(start); osc.stop(start+0.65);
}
function startMusic() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) { document.getElementById("musicLabel").textContent = "Music unavailable"; return; }
  audioContext = audioContext || new AudioCtx();
  audioContext.resume();
  musicOn = true;
  document.getElementById("musicToggle").setAttribute("aria-pressed","true");
  document.getElementById("musicLabel").textContent = "Pause music";
  document.getElementById("musicIcon").textContent = "♫";
  playNote(notes[noteIndex++ % notes.length], audioContext.currentTime);
  musicTimer = setInterval(() => {
    if (musicOn) {
      const now = audioContext.currentTime;
      playNote(notes[noteIndex++ % notes.length], now);
      if (noteIndex % 4 === 0) playNote(notes[(noteIndex+4)%notes.length]/2, now+0.02);
    }
  }, 680);
}
function stopMusic() {
  musicOn = false; clearInterval(musicTimer);
  document.getElementById("musicToggle").setAttribute("aria-pressed","false");
  document.getElementById("musicLabel").textContent = "Play music";
}
document.getElementById("musicToggle").addEventListener("click", () => musicOn ? stopMusic() : startMusic());

const lightbox = document.getElementById("lightbox"), lightboxImage = document.getElementById("lightboxImage"), lightboxCaption = document.getElementById("lightboxCaption");
let currentPhoto = 0;
function showPhoto(index) {
  currentPhoto = (index + photoData.length) % photoData.length;
  lightboxImage.src = photoData[currentPhoto].src;
  lightboxCaption.textContent = photoData[currentPhoto].caption;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}
function closePhoto() { lightbox.hidden = true; document.body.style.overflow = ""; }
document.querySelectorAll("[data-photo]").forEach(button => button.addEventListener("click", () => showPhoto(Number(button.dataset.photo))));
document.getElementById("lightboxClose").addEventListener("click", closePhoto);
document.getElementById("prevPhoto").addEventListener("click", () => showPhoto(currentPhoto-1));
document.getElementById("nextPhoto").addEventListener("click", () => showPhoto(currentPhoto+1));
lightbox.addEventListener("click", e => { if(e.target === lightbox) closePhoto(); });
document.addEventListener("keydown", e => {
  if (lightbox.hidden) return;
  if(e.key === "Escape") closePhoto();
  if(e.key === "ArrowLeft") showPhoto(currentPhoto-1);
  if(e.key === "ArrowRight") showPhoto(currentPhoto+1);
});

let cakeDone = false;
function blowCandles() {
  if(cakeDone) return;
  cakeDone = true;
  document.querySelectorAll(".candle").forEach((c,i) => setTimeout(() => c.classList.add("off"), i*180));
  document.getElementById("wishHint").textContent = "Wish sent straight to the universe 💫";
  document.getElementById("wishMessage").hidden = false;
  for(let i=0;i<30;i++) {
    const bit = document.createElement("span");
    bit.textContent = ["✦","♡","✿","•"][i%4];
    bit.style.cssText = `position:fixed;z-index:25;left:${35+Math.random()*30}%;top:${35+Math.random()*25}%;color:${["#f1d28a","#e7b5e1","#fff","#cba4dd"][i%4]};font-size:${12+Math.random()*20}px;pointer-events:none;transition:transform 1.3s ease,opacity 1.3s ease`;
    document.body.appendChild(bit);
    requestAnimationFrame(()=>{bit.style.transform=`translate(${Math.random()*360-180}px,${Math.random()*-300-50}px) rotate(${Math.random()*300}deg)`;bit.style.opacity="0";});
    setTimeout(()=>bit.remove(),1500);
  }
}
document.getElementById("cakeButton").addEventListener("click", blowCandles);
document.querySelectorAll(".candle").forEach(c => c.addEventListener("click", blowCandles));

document.getElementById("surpriseButton").addEventListener("click", () => {
  const note = document.getElementById("surpriseNote");
  note.hidden = !note.hidden;
  document.getElementById("surpriseButton").innerHTML = note.hidden ? 'Open one last surprise <span>✧</span>' : 'You are so loved! <span>♡</span>';
  if (!note.hidden) note.scrollIntoView({behavior:"smooth",block:"center"});
});
