const playBtn = document.getElementById("playBtn");
const music = document.getElementById("music");

const themeToggle = document.getElementById("themeToggle");

const playlistContainer = document.getElementById("playlist");

const vinyl = document.querySelector(".record");
const albumArt = document.querySelector(".album-art");

const songTitle = document.querySelector(".song-info h1");
const songArtist = document.querySelector(".song-info p");

const progressBar = document.getElementById("progressBar");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const rainToggle = document.getElementById("rainToggle");
const rainAudio = document.getElementById("rainAudio");
const canvas = document.getElementById("rainCanvas");
const ctx = canvas.getContext("2d");

let currentSong = 0;
let isPlaying = false;

const songs = [
  {
    title: "Maple Street After Rain",
    artist: "Velvet Jazz Quartet",
    src: "assets/jazz1.mp3"
  },
  {
    title: "Autumn Cigarettes & Soft Sax",
    artist: "Blue Note Society",
    src: "assets/jazz2.mp3"
  },
  {
    title: "The Last Warm Window",
    artist: "Noir Avenue",
    src: "assets/jazz3.mp3"
  },
  {
    title: "Moonlight Over Soft Rain",
    artist: "Jazz Street Cafe",
    src: "assets/jazz4.mp3"
  }
];

let audioUnlocked = false;

function unlockAudio() {
  if (audioUnlocked) return;

  // iOS unlock trick (music only)
  music.play().then(() => music.pause()).catch(() => {});

  audioUnlocked = true;
}

document.addEventListener("touchstart", unlockAudio, { once: true });


// LOAD SONG
function loadSong(index) {
  return new Promise((resolve) => {
    const song = songs[index];

    music.pause();
    music.src = song.src;
    music.load();

    songTitle.textContent = song.title;
    songArtist.textContent = song.artist;

    progressBar.value = 0;
    currentTimeEl.textContent = "0:00";
    durationEl.textContent = "0:00";

    updatePlaylistUI();

    music.onloadedmetadata = () => resolve();
  });
}

// PLAY SONG
async function playSong() {
  try {
    await music.play();

    isPlaying = true;
    playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
    vinyl.classList.add("spinning");

  } catch (err) {
    console.log("Playback blocked:", err);
  }
}

function pauseSong() {
  music.pause();

  isPlaying = false;
  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  vinyl.classList.remove("spinning");
}

// PLAY BUTTON
playBtn.addEventListener("click", async () => {
  unlockAudio();

  if (!isPlaying) {
    try {
      await loadSong(currentSong);
      await music.play();

      isPlaying = true;
      playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
      vinyl.classList.add("spinning");

    } catch (e) {
      console.log("Play blocked:", e);
    }
  } else {
    pauseSong();
  }
});

// PLAYLIST
songs.forEach((song, index) => {
  const track = document.createElement("div");
  track.classList.add("track");

  track.innerHTML = `
    <span>${song.title}</span>
    <small>${song.artist}</small>
  `;

  track.addEventListener("click", async () => {
    currentSong = index;
    await loadSong(currentSong);
    await playSong();
  });

  playlistContainer.appendChild(track);
});

// ACTIVE TRACK UI
function updatePlaylistUI() {
  const tracks = document.querySelectorAll(".track");

  tracks.forEach(t => t.classList.remove("active"));

  if (tracks[currentSong]) {
    tracks[currentSong].classList.add("active");
  }
}

// NEXT SONG AUTO
music.addEventListener("ended", async () => {
  currentSong = (currentSong + 1) % songs.length;

  await loadSong(currentSong);

  if (isPlaying) {
    try {
      await music.play();
    } catch (e) {
      console.log("Auto-next blocked:", e);
    }
  }
});

// PROGRESS BAR
music.addEventListener("timeupdate", () => {
  if (!music.duration) return;

  progressBar.value = (music.currentTime / music.duration) * 100;

  currentTimeEl.textContent = formatTime(music.currentTime);
  durationEl.textContent = formatTime(music.duration);
});

progressBar.addEventListener("input", () => {
  if (!music.duration) return;

  music.currentTime =
    (progressBar.value / 100) * music.duration;
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// CONTROLS
const prevBtn = document.querySelector(".fa-backward").parentElement;
const nextBtn = document.querySelector(".fa-forward").parentElement;

prevBtn.addEventListener("click", async () => {
  currentSong = (currentSong - 1 + songs.length) % songs.length;

  await loadSong(currentSong);
  await playSong();
});

nextBtn.addEventListener("click", async () => {
  currentSong = (currentSong + 1) % songs.length;

  await loadSong(currentSong);
  await playSong();
});


// RAIN TOGGLE
rainAudio.src = "assets/rain.mp3";
rainAudio.loop = true;
rainAudio.preload = "auto";

rainToggle.addEventListener("change", async () => {
  unlockAudio();

  if (rainToggle.checked) {
    try {
      await rainAudio.play();
    } catch (e) {
      console.log("Rain play blocked:", e);
    }
  } else {
    rainAudio.pause();
    rainAudio.currentTime = 0;
  }
});

// RAIN CANVAS
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drops = [];

for (let i = 0; i < 120; i++) {
  drops.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    length: Math.random() * 20 + 10,
    speed: Math.random() * 4 + 4
  });
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(180, 200, 255, 0.25)";
  ctx.lineWidth = 1;

  for (let d of drops) {
    ctx.beginPath();
    ctx.moveTo(d.x, d.y);
    ctx.lineTo(d.x, d.y + d.length);
    ctx.stroke();

    d.y += d.speed;

    if (d.y > canvas.height) {
      d.y = -20;
      d.x = Math.random() * canvas.width;
    }
  }

  requestAnimationFrame(drawRain);
}

drawRain();

// THEME TOGGLE
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("light");
});

// INITIAL LOAD
loadSong(currentSong);