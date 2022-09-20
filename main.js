const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);


const player = $('.player')
const playlist = $('.playlist');
const cd = $('.cd');
const heading = $('header h2');
const CDThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const nextBtn = $('.btn-next');
const prevBtn = $('.btn-prev');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: 'Song1',
            singer: 'Vicetone',
            path: 'assets/music/song1.mp3',
            image: 'assets/img/song1.png'
        },
        {
            name: 'Song2',
            singer: 'Vicetone',
            path: 'assets/music/song2.mp3',
            image: 'assets/img/song2.png'
        },
        {
            name: 'Song3',
            singer: 'Vicetone',
            path: 'assets/music/song3.mp3',
            image: 'assets/img/song3.png'
        },
        {
            name: 'Song4',
            singer: 'Vicetone',
            path: 'assets/music/song4.mp3',
            image: 'assets/img/song4.png'
        },
        {
            name: 'Song5',
            singer: 'Vicetone',
            path: 'assets/music/song5.mp3',
            image: 'assets/img/song5.png'
        },
        {
            name: 'Song6',
            singer: 'Vicetone',
            path: 'assets/music/song6.mp3',
            image: 'assets/img/song6.png'
        },
        {
            name: 'Song7',
            singer: 'Vicetone',
            path: 'assets/music/song7.mp3',
            image: 'assets/img/song7.png'
        },
    ],
    render: function(){
        const html = this.songs.map(song => {
            return `
                <div class="song">
                    <div class="thumb" style="background-image: url('${song.image}')">
                    </div>
                    <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                    </div>
                </div>
            `
        })
        playlist.innerHTML = html.join('');
    },
    defineProperties: function(){
        Object.defineProperty(this, 'currentSong', {
            get: function(){
                return this.songs[this.currentIndex];
            }
        })
    },
    handleEvents: function(){
        const _this = this;
        const cdWidth = cd.offsetWidth;

        //xử lý quay CD khi play and dừng khi stop
        const CDThumbAnimate =  CDThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration : 10000,
            iterations: Infinity,
        });
        CDThumbAnimate.pause();

        //xử lý phóng to hoặc thu nhỏ CD 
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newWidth = cdWidth - scrollTop;

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0;
            cd.style.opacity = newWidth/cdWidth;
        }

        //xử lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying == false){
                audio.play();
            }else{
                audio.pause();
            }
            
        }

        //khi bài hát được phát (song is play)
        audio.onplay = function(){
            _this.isPlaying = true;
            player.classList.add('playing');
            CDThumbAnimate.play();
        }
        //khi bài hát được dừng (song is pause)
        audio.onpause = function(){
            _this.isPlaying = false;
            player.classList.remove('playing');
            CDThumbAnimate.pause();
        }

        //khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const progressPercentage = Math.floor((audio.currentTime/audio.duration)*100);
                progress.value = progressPercentage;

            }
        }

        //xử lý khi tua bài hát
        progress.onchange = function(e){
            const seekTime = (e.target.value*audio.duration)/100;
            audio.currentTime = seekTime;
        }

        // xử lý khi nhấn nút next
        nextBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandom();
            }else{
                _this.nextSong();
            }
            audio.play()
        }
        //xử lý khi nhấn nút prev
        prevBtn.onclick = function(){
            if(_this.isRandom){
                _this.playRandom();

            }else{
                _this.prevSong();
            }
            audio.play();
        }

        //xử lý random bài hát bật tắt
        randomBtn.onclick = function(e){
            // if(_this.isRandom === true){
            //     randomBtn.classList.remove('active');
            //     _this.isRandom = false;
            // }else{
            //     randomBtn.classList.add('active');
            //     _this.isRandom = true;
            // }

            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRando);
        }

        //xử lý repeat bật tắt
        repeatBtn.onclick = function(e){
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        //xử lý next/repeat khi phát hết nhạc
        audio.onended = function(){
            // if(_this.isRandom){
            //     _this.playRandom();
            // }else{
            //     _this.nextSong();
            // }
            // audio.play()

            nextBtn.click();
        }

        //xử lý 


    },
    loadCurrentSong: function(){
        
        heading.textContent = this.currentSong.name;
        CDThumb.style.backgroundImage = `url('${this.currentSong.image}')` ;
        audio.src = this.currentSong.path;

    },
    prevSong: function(){
        this.currentIndex--;
        if(this.currentIndex < 0){
            app.currentIndex = this.songs.length - 1;
        }
        this.loadCurrentSong();
    },
    nextSong: function(){
        this.currentIndex++;
        if(this.currentIndex >= this.songs.length){
            app.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    playRandom: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        app.currentIndex = newIndex;
        this.loadCurrentSong()
    },
    playRepeat: function(){
        //khi play hết bài hát sẽ ko play next
    },
    start: function() {
        // định nghĩa các thuộc tính cho object
        this.defineProperties();

        // xử lý các sự kiện trong DOM
        this.handleEvents();

        //render thông tin của current song lên UI
        this.loadCurrentSong();

        //render playlist
        this.render();
    }
}

app.start();

