const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PLAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const playlist = $(".playlist");
const cd = $(".cd");
const heading = $("header h2");
const CDThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playList = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Song1",
      singer: "Vicetone",
      path: "assets/music/song1.mp3",
      image: "assets/img/song1.png",
    },
    {
      name: "Song2",
      singer: "Vicetone",
      path: "assets/music/song2.mp3",
      image: "assets/img/song2.png",
    },
    {
      name: "Song3",
      singer: "Vicetone",
      path: "assets/music/song3.mp3",
      image: "assets/img/song3.png",
    },
    {
      name: "Song4",
      singer: "Vicetone",
      path: "assets/music/song4.mp3",
      image: "assets/img/song4.png",
    },
    {
      name: "Song5",
      singer: "Vicetone",
      path: "assets/music/song5.mp3",
      image: "assets/img/song5.png",
    },
    {
      name: "Song6",
      singer: "Vicetone",
      path: "assets/music/song6.mp3",
      image: "assets/img/song6.png",
    },
    {
      name: "Song7",
      singer: "Vicetone",
      path: "assets/music/song7.mp3",
      image: "assets/img/song7.png",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  //render songs into GUI
  render: function () {
    const html = this.songs.map((song, index) => {
      return `
                <div class="song ${
                  index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                    <div class="thumb" style="background-image: url('${
                      song.image
                    }')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                </div>
            `;
    });
    playlist.innerHTML = html.join("");
  },
  //define function getter cho Object app -> ch??? c???n this.currentSong -> tr??? v??? song info like name,singer...
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },
  //x??? l?? c??c event trong GUI
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    //x??? l?? quay CD khi play and d???ng khi stop
    const CDThumbAnimate = CDThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000,
      iterations: Infinity,
    });
    CDThumbAnimate.pause();

    //x??? l?? ph??ng to ho???c thu nh??? CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newWidth = cdWidth - scrollTop;

      cd.style.width = newWidth > 0 ? newWidth + "px" : 0;
      cd.style.opacity = newWidth / cdWidth;
    };

    //x??? l?? khi click play
    playBtn.onclick = function () {
      if (_this.isPlaying == false) {
        audio.play();
      } else {
        audio.pause();
      }
    };

    //khi b??i h??t ???????c ph??t (song is play)
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      CDThumbAnimate.play();
    };
    //khi b??i h??t ???????c d???ng (song is pause)
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      CDThumbAnimate.pause();
    };

    //khi ti???n ????? b??i h??t thay ?????i
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercentage = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercentage;
      }
    };

    //x??? l?? khi tua b??i h??t
    progress.onchange = function (e) {
      const seekTime = (e.target.value * audio.duration) / 100;
      audio.currentTime = seekTime;
    };

    // x??? l?? khi nh???n n??t next
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandom();
      } else {
        _this.nextSong();
      }
      _this.render();
      audio.play();
      _this.scrollIntoActiveSong();
    };
    //x??? l?? khi nh???n n??t prev
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandom();
      } else {
        _this.prevSong();
      }
      _this.render();
      audio.play();
      _this.scrollIntoActiveSong();
    };

    //x??? l?? random b??i h??t b???t t???t
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    //x??? l?? repeat b???t t???t
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    //x??? l?? next/repeat khi ph??t h???t nh???c
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    //x??? l?? click to play song in song list
    playList.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
      }
    };

    //x??? l?? click to option
  },
  //scroll the screen to the active song.
  scrollIntoActiveSong: function () {
    $(".song.active").scrollIntoView({
      block: "end",
      behavior: "smooth",
    });
  },
  //load info c???a current song to GUI ex: name, Image
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    CDThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  //load config
  loadConfig: function () {
    app.isRandom = this.config.isRandom;
    app.isRepeat = this.config.isRepeat;

    //cach thu 2
    // Object.assign(this, this.config);
  },
  //h??m ????? gi???m index c???a song ????? l???y song tr?????c ????
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      app.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  //h??m ????? t??ng index c???a song ????? l???y song ti???p theo
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      app.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  //h??m random index c???a song in song list
  playRandom: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    app.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    //g??n c???u h??nh t??? local to ???ng d???ng
    this.loadConfig();

    // ?????nh ngh??a c??c thu???c t??nh cho object
    this.defineProperties();

    // x??? l?? c??c s??? ki???n trong DOM
    this.handleEvents();

    //render th??ng tin c???a current song l??n UI
    this.loadCurrentSong();

    //render playlist
    this.render();

    //load  tr???ng th??i ban ?????u c???a repeat and random
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};

app.start();
