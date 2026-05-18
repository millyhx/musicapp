const playBtn = document.getElementById("playBtn");
const music = document.getElementById("music");

const themeToggle = document.getElementById("themeToggle");

const playlistContainer = document.getElementById("playlist");

const vinyl = document.querySelector(".record");
const albumArt = document.querySelector(".album-art");

const songTitle = document.querySelector(".song-info h1");
const songArtist = document.querySelector(".song-info p");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const rainToggle = document.getElementById("rainToggle");
const rainVolume = document.getElementById("rainVolume");
const rainAudio = document.getElementById("rainAudio");
const canvas = document.getElementById("rainCanvas");
const ctx = canvas.getContext("2d");

// always keep volume synced
setMusicVolume(volumeBar.value);
setRainVolume(rainVolume.value);


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

  setMusicVolume(volumeBar.value);
  setRainVolume(rainVolume.value);

  // iOS "unlock" trick
  music.play().then(() => music.pause()).catch(() => {});
  rainAudio.play().then(() => rainAudio.pause()).catch(() => {});

  audioUnlocked = true;
}

document.addEventListener("touchstart", unlockAudio, { once: true });


// LOAD SONG

function loadSong(index) {
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
}

// PLAY SONG

async function playSong() {
  try {
    await music.play();

    setMusicVolume(volumeBar.value);

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
  unlockAudio(); // ensure iOS unlock

  if (isPlaying) {
    pauseSong();
  } else {
    await playSong();
  }
});

// CREATE PLAYLIST

songs.forEach((song, index) => {
  const track = document.createElement("div");
  track.classList.add("track");

  track.innerHTML = `
    <span>${song.title}</span>
    <small>${song.artist}</small>
  `;

  track.addEventListener("click", () => {
    currentSong = index;
    loadSong(currentSong);
    playSong();
  });

  playlistContainer.appendChild(track);
});

// UPDATE ACTIVE SONG

function updatePlaylistUI() {
  const tracks = document.querySelectorAll(".track");

  tracks.forEach(t => t.classList.remove("active"));

  if (tracks[currentSong]) {
    tracks[currentSong].classList.add("active");
  }
}

// NEXT SONG

music.addEventListener("ended", () => {
  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  loadSong(currentSong);
  playSong();
});

// PROGRESS BAR TRACKING

music.addEventListener("timeupdate", () => {
  if (!music.duration) return;

  const progressPercent =
    (music.currentTime / music.duration) * 100;

  progressBar.value = progressPercent;

  // update time display
  currentTimeEl.textContent = formatTime(music.currentTime);
  durationEl.textContent = formatTime(music.duration);
});

progressBar.addEventListener("input", () => {
  if (!music.duration) return;

  const seekTime =
    (progressBar.value / 100) * music.duration;

  music.currentTime = seekTime;
});

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
}

// FORWARD AND BACK BUTTONS

const prevBtn = document.querySelector(".fa-backward").parentElement;
const nextBtn = document.querySelector(".fa-forward").parentElement;

prevBtn.addEventListener("click", () => {
  currentSong--;

  if (currentSong < 0) {
    currentSong = songs.length - 1;
  }

  loadSong(currentSong);
  playSong();
});

nextBtn.addEventListener("click", () => {
  currentSong++;

  if (currentSong >= songs.length) {
    currentSong = 0;
  }

  loadSong(currentSong);
  playSong();
});


// RAIN TOGGLE

rainToggle.addEventListener("change", () => {

  if (rainToggle.checked) {

    rainAudio.src = "assets/rain.mp3";
    rainAudio.loop = true;

    rainAudio.volume = parseFloat(rainVolume.value);

    rainAudio.play();

  } else {
    rainAudio.pause();
  }

});

rainVolume.addEventListener("input", () => {

  rainAudio.volume = parseFloat(rainVolume.value);

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

// VOLUME CONTROLS

volumeBar.addEventListener("input", () => {
  setMusicVolume(volumeBar.value);
});

function setMusicVolume(v) {
  music.volume = Math.min(1, Math.max(0, parseFloat(v) || 0));
}

function setRainVolume(v) {
  rainAudio.volume = Math.min(1, Math.max(0, parseFloat(v) || 0));
}

// THEME TOGGLE

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light");

});

// INITIAL LOAD

loadSong(currentSong);