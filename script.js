const playBtn = document.getElementById("playBtn");
const music = document.getElementById("music");

const themeToggle = document.getElementById("themeToggle");

const playlistContainer = document.getElementById("playlist");

const vinyl = document.querySelector(".record");

const songTitle = document.querySelector(".song-info h1");
const songArtist = document.querySelector(".song-info p");

const progressBar = document.getElementById("progressBar");
const volumeBar = document.getElementById("volumeBar");

const currentTimeEl = document.getElementById("currentTime");
const durationEl = document.getElementById("duration");

const rainToggle = document.getElementById("rainToggle");
const rainVolume = document.getElementById("rainVolume");
const rainAudio = document.getElementById("rainAudio");

// always keep volume synced
rainAudio.volume = rainVolume.value;
music.volume = volumeBar.value;


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

// LOAD SONG

function loadSong(index) {
  const song = songs[index];

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

function playSong() {
  music.play();

  isPlaying = true;

  playBtn.innerHTML = `<i class="fa-solid fa-pause"></i>`;
  vinyl.classList.add("spinning");
}

function pauseSong() {
  music.pause();

  isPlaying = false;

  playBtn.innerHTML = `<i class="fa-solid fa-play"></i>`;
  vinyl.classList.remove("spinning");
}

// PLAY BUTTON

playBtn.addEventListener("click", () => {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
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

// VOLUME CONTROLS

volumeBar.addEventListener("input", () => {
  music.volume = volumeBar.value;
});



// THEME TOGGLE

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light");

});

// INITIAL LOAD

loadSong(currentSong);