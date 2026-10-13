const songsData = [
  {
    title: "Domingo de Manhã",
    artist: "Marcos & Belutti",
    src: "audios/domingodemanha.mp3",
    cover: "images/domingodemanha.png",
    durationSec: 251,
    durationText: "4:11",
    lyrics: `Mas eu, eu, eu
Prefiro estar aqui te perturbando
Domingo de manhã
É que eu prefiro ouvir sua voz de sono`
  },
  {
    title: "Querida",
    artist: "Chapéu de Palha (Duo)",
    src: "audios/querida.mp3",
    cover: "images/querida.png",
    durationSec: 217,
    durationText: "3:37",
    lyrics: `Querida, eu não consigo em palavras dizer o que eu sinto por você
Mas é mais do que eu posso, menos do que eu queria
Querida, eu não consigo em palavras dizer o que eu sinto por você
Mas é mais do que eu posso, menos do que eu queria`
  },
  {
    title: "O Que É Que Tem?",
    artist: "Jorge & Mateus",
    src: "audios/oqueequetem.mp3",
    cover: "images/oqueequetem.png",
    durationSec: 211,
    durationText: "3:31",
    lyrics: `Deixa o povo falar
O que é que tem?
Eu quero ser lembrado com você
Isso não é problema de ninguém`
  }
];

let currentSongIndex = 0;
let isPlaying = false;

const audioPlayer = document.getElementById('audioPlayer');
const playPauseBtn = document.getElementById('playPauseBtn');
const playIcon = document.getElementById('playIcon');
const pauseIcon = document.getElementById('pauseIcon');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const playerThumb = document.getElementById('playerThumb');
const playerTitle = document.getElementById('playerTitle');
const playerArtist = document.getElementById('playerArtist');
const progressArea = document.getElementById('progressArea');
const progressFill = document.getElementById('progressFill');
const progressHandle = document.getElementById('progressHandle');
const currentTimeEl = document.getElementById('currentTime');
const totalDurationEl = document.getElementById('totalDuration');

const startDate = new Date('2024-06-16T00:00:00');

function updateCounter() {
  const now = new Date();
  const diffTime = Math.max(0, now - startDate);

  const days = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffTime / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffTime / (1000 * 60)) % 60);
  const seconds = Math.floor((diffTime / 1000) % 60);

  document.getElementById('days').textContent = days;
  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('seconds').textContent = seconds;
}

setInterval(updateCounter, 1000);
updateCounter();

const photoTrack = document.getElementById('photoTrack');
const photoPrevBtn = document.getElementById('photoPrevBtn');
const photoNextBtn = document.getElementById('photoNextBtn');
const photoDots = document.querySelectorAll('#photoDots .dot');
let currentPhotoIndex = 0;
const totalPhotos = 3;

function updatePhotoCarousel() {
  photoTrack.style.transform = `translateX(-${currentPhotoIndex * 100}%)`;
  photoDots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentPhotoIndex);
  });
}

photoPrevBtn.addEventListener('click', () => {
  currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
  updatePhotoCarousel();
});

photoNextBtn.addEventListener('click', () => {
  currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
  updatePhotoCarousel();
});

photoDots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    currentPhotoIndex = parseInt(e.target.getAttribute('data-index'));
    updatePhotoCarousel();
  });
});

let startXPhoto = 0;
const photoViewport = document.getElementById('photoViewport');

photoViewport.addEventListener('touchstart', (e) => {
  startXPhoto = e.touches[0].clientX;
});

photoViewport.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = startXPhoto - endX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) {
      currentPhotoIndex = (currentPhotoIndex + 1) % totalPhotos;
    } else {
      currentPhotoIndex = (currentPhotoIndex - 1 + totalPhotos) % totalPhotos;
    }
    updatePhotoCarousel();
  }
});

const musicTrack = document.getElementById('musicTrack');
const musicPrevBtn = document.getElementById('musicPrevBtn');
const musicNextBtn = document.getElementById('musicNextBtn');
const musicDots = document.querySelectorAll('#musicDots .dot');
let currentMusicSlide = 0;
const totalMusicSlides = 3;

function updateMusicCarousel() {
  musicTrack.style.transform = `translateX(-${currentMusicSlide * 100}%)`;
  musicDots.forEach((dot, idx) => {
    dot.classList.toggle('active', idx === currentMusicSlide);
  });
}

musicPrevBtn.addEventListener('click', () => {
  currentMusicSlide = (currentMusicSlide - 1 + totalMusicSlides) % totalMusicSlides;
  updateMusicCarousel();
});

musicNextBtn.addEventListener('click', () => {
  currentMusicSlide = (currentMusicSlide + 1) % totalMusicSlides;
  updateMusicCarousel();
});

musicDots.forEach(dot => {
  dot.addEventListener('click', (e) => {
    currentMusicSlide = parseInt(e.target.getAttribute('data-index'));
    updateMusicCarousel();
  });
});

let startXMusic = 0;
const musicViewport = document.getElementById('musicViewport');

musicViewport.addEventListener('touchstart', (e) => {
  startXMusic = e.touches[0].clientX;
});

musicViewport.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  const diff = startXMusic - endX;
  if (Math.abs(diff) > 40) {
    if (diff > 0) {
      currentMusicSlide = (currentMusicSlide + 1) % totalMusicSlides;
    } else {
      currentMusicSlide = (currentMusicSlide - 1 + totalMusicSlides) % totalMusicSlides;
    }
    updateMusicCarousel();
  }
});

function loadSong(index) {
  currentSongIndex = index;
  const song = songsData[index];
  audioPlayer.src = song.src;
  playerThumb.src = song.cover;
  playerTitle.textContent = song.title;
  playerArtist.textContent = song.artist;
  totalDurationEl.textContent = song.durationText;
  progressFill.style.width = '0%';
  progressHandle.style.left = '0%';
  currentTimeEl.textContent = '0:00';
}

function playSongIndex(index) {
  if (currentSongIndex !== index || !audioPlayer.src) {
    loadSong(index);
  }
  audioPlayer.play().then(() => {
    isPlaying = true;
    updatePlayPauseIcon();
  }).catch(err => {
    console.log("Erro ao reproduzir áudio:", err);
  });

  currentMusicSlide = index;
  updateMusicCarousel();
}

function togglePlayPause() {
  if (!audioPlayer.src) {
    loadSong(0);
  }
  if (isPlaying) {
    audioPlayer.pause();
    isPlaying = false;
  } else {
    audioPlayer.play().then(() => {
      isPlaying = true;
    }).catch(err => {
      console.log("Erro ao reproduzir áudio:", err);
    });
  }
  updatePlayPauseIcon();
}

function updatePlayPauseIcon() {
  if (isPlaying) {
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
  } else {
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
  }
}

playPauseBtn.addEventListener('click', togglePlayPause);

prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songsData.length) % songsData.length;
  playSongIndex(currentSongIndex);
});

nextBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex + 1) % songsData.length;
  playSongIndex(currentSongIndex);
});

audioPlayer.addEventListener('timeupdate', () => {
  if (audioPlayer.duration) {
    const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progressFill.style.width = `${pct}%`;
    progressHandle.style.left = `${pct}%`;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  }
});

audioPlayer.addEventListener('ended', () => {
  nextBtn.click();
});

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

let isScrubbing = false;

function scrubProgress(e) {
  const rect = progressArea.getBoundingClientRect();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  let offsetX = clientX - rect.left;
  offsetX = Math.max(0, Math.min(offsetX, rect.width));
  const pct = (offsetX / rect.width);
  
  progressFill.style.width = `${pct * 100}%`;
  progressHandle.style.left = `${pct * 100}%`;

  if (audioPlayer.duration) {
    audioPlayer.currentTime = pct * audioPlayer.duration;
    currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
  }
}

progressArea.addEventListener('mousedown', (e) => {
  isScrubbing = true;
  scrubProgress(e);
});

window.addEventListener('mousemove', (e) => {
  if (isScrubbing) scrubProgress(e);
});

window.addEventListener('mouseup', () => {
  isScrubbing = false;
});

progressArea.addEventListener('touchstart', (e) => {
  isScrubbing = true;
  scrubProgress(e);
});

window.addEventListener('touchmove', (e) => {
  if (isScrubbing) scrubProgress(e);
});

window.addEventListener('touchend', () => {
  isScrubbing = false;
});

const lyricsModal = document.getElementById('lyricsModal');
const modalSongTitle = document.getElementById('modalSongTitle');
const modalSongArtist = document.getElementById('modalSongArtist');
const modalLyricsContent = document.getElementById('modalLyricsContent');

function openLyricsModal(index) {
  const song = songsData[index];
  modalSongTitle.textContent = song.title;
  modalSongArtist.textContent = song.artist;
  modalLyricsContent.textContent = song.lyrics;
  lyricsModal.classList.add('active');
  lyricsModal.setAttribute('aria-hidden', 'false');
}

function closeLyricsModal() {
  lyricsModal.classList.remove('active');
  lyricsModal.setAttribute('aria-hidden', 'true');
}

lyricsModal.addEventListener('click', (e) => {
  if (e.target === lyricsModal) {
    closeLyricsModal();
  }
});

const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.bottom-nav .nav-item');

window.addEventListener('scroll', () => {
  let currentSec = '';
  sections.forEach(section => {
    const top = section.offsetTop - 120;
    if (window.scrollY >= top) {
      currentSec = section.getAttribute('id');
    }
  });

  navItems.forEach(item => {
    item.classList.remove('active');
    if (item.getAttribute('href') === `#${currentSec}`) {
      item.classList.add('active');
    }
  });
});

loadSong(0);