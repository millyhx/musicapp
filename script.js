const playBtn = document.getElementById("playBtn");
const music = document.getElementById("music");

const rainToggle = document.getElementById("rainToggle");
const rainAudio = document.getElementById("rainAudio");

const themeToggle = document.getElementById("themeToggle");

const playlistContainer = document.getElementById("playlist");

const vinyl = document.querySelector(".record");

const songTitle = document.querySelector(".song-info h1");
const songArtist = document.querySelector(".song-info p");

let currentSong = 0;
let isPlaying = false;

const songs = [
  {
    title: "Midnight Espresso",
    artist: "Velvet Jazz Quartet",
    src: "assets/jazz1.mp3"
  },
  {
    title: "Vinyl Dreams",
    artist: "Blue Note Society",
    src: "assets/jazz2.mp3"
  },
  {
    title: "After Hours",
    artist: "Noir Avenue",
    src: "assets/jazz3.mp3"
  },
  {
    title: "After",
    artist: "Noir Avenue",
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

// RAIN TOGGLE

rainToggle.addEventListener("change", () => {
  if (rainToggle.checked) {
    rainAudio.src = "assets/rain.mp3";
    rainAudio.volume = 0.35;
    rainAudio.play();
  } else {
    rainAudio.pause();
  }
});

// THEME TOGGLE

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("light");

});

// INITIAL LOAD

loadSong(currentSong);