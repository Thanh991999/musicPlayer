
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const playList = $('.playlist');
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const player = $('.player')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const preBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const repeatBtn = $('.btn-repeat')



// 1. render song

const app = {
    
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs : [
        {
            name: 'Phố Đã Nên Đèn',
            single:'Huyền Tâm Môn',
            path: './assets/song/song1.mp3',
            img: './assets/img/img1.jpg',
        },
        {
            name: 'Ái Nộ',
            single:'Masew, Khôi Vũ',
            path: './assets/song/song2.mp3',
            img: './assets/img/img2.jpg',
        },
        {
            name: 'Cưới Thôi',
            single:'Masew, B Ray',
            path: './assets/song/song3.mp3',
            img: './assets/img/img3.jpg',
        },
        {
            name: 'Phải chăng em đã yêu',
            single:'Juki San',
            path: './assets/song/song4.mp3',
            img: './assets/img/img4.jpg',
        },
        {
            name: 'Lần Hẹn Hò Đầu Tiên',
            single:'Huyền Tâm Môn',
            path: './assets/song/song5.mp3',
            img: './assets/img/img5.jpg',
        },
        {
            name: 'Bỏ em vào Balo',
            single:'Tân Trần',
            path: './assets/song/song6.mp3',
            img: './assets/img/img6.jpg',
        },
        {
            name: 'Maps',
            single:'Marron 5',
            path: './assets/song/song7.mp3',
            img: './assets/img/img7.jpg',
        },
        {
            name: 'Girls Like You',
            single:'Maroon 5,Cardi B',
            path: './assets/song/song8.mp3',
            img: './assets/img/img8.jpg',
        },
        {
            name: 'Hãy Trao Cho Anh',
            single:'Sơn Tùng MTP',
            path: './assets/song/song9.mp3',
            img: './assets/img/img9.jpg',
        },
        {
            name: 'Chạy Ngay Đi',
            single:'Sơn Tùng MTP',
            path: './assets/song/song10.mp3',
            img: './assets/img/img10.jpg',
        },

    ],

    render : function()
    {
        const htmls = this.songs.map(function(song, index)
        {
            return `
            <div data-index="${index}" class="song ${index === app.currentIndex ? 'active' : '' }">
                <div class="thumb" 
                    style="background-image: url('${song.img}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.single}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
          </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents: function(){
        const _this = this
        const cdWidth = cd.offsetWidth // offsetWidth lấy ra kích thước hiện tại của elements

        // Khi next Song
        nextBtn.onclick = function(){
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else{
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollToActiveSong()
            
        }

        preBtn.onclick = function(){
            if(_this.isRandom) {
                _this.playRandomSong()
            }
            else {
                _this.preSong()
            }
            audio.play()
            _this.render()

        }

        // Xử lý cd quay/ dừng
        const cdThumbAnimate = cdThumb.animate([
            {
                transform: 'rotate(360deg)'
            }
        ],{
            duration: 10000, // 10second
            interations: Infinity
        })
        cdThumbAnimate.pause()

        // Xử lý phóng to thu nhỏ Cd

        document.onscroll = function() 
        {
            const scrollTop = window.scrollY || document.documentElement.scrollTop
            const newCdWidth = cdWidth - scrollTop
            cd.style.width = newCdWidth > 0 ?  newCdWidth + 'px' : 0
            cd.style.opacity = newCdWidth / cdWidth
        }

        // Xử lý khi click play
        playBtn.onclick = function () {
            
            if(_this.isPlaying){
                audio.pause()
            }
            else{
                audio.play()
            }
        }

        // Khi song được player
        audio.onplay = function() {
            _this.isPlaying = true,   
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // khi song bị pause
        audio.onpause = function() {
            _this.isPlaying = false,
            player.classList.remove('playing')
            cdThumbAnimate.pause()

        }

        // Khi tiến độ bài hát thay đổi
        audio.ontimeupdate = function() {
            if(audio.duration)
            {
                const progressPresent = (audio.currentTime / audio.duration) *100
                progress.value = progressPresent
            }
            
        }

        // Xử lý khi tua song
        progress.onchange = function(e) {
            // e.target.value
           const seekTime = e.target.value * audio.duration / 100
           audio.currentTime = seekTime
        }

        // xử lý khi nhấn vào random ngẫu nhiên bài hát
        
        randomBtn.onclick = function() {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)
        }

        // Xử lý lặp lại một Song
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat
            repeatBtn.classList.toggle('active',_this.isRepeat)
        }
        
        // Xử lý khi audio end thì tự động next
        audio.onended = function() {
            if(_this.isRepeat)
            {
                audio.play()
            }
            else {
                nextBtn.click()
            }
        }

        // Xử lý click vào list bài nhát thì phải phát nhạc bài hát đó
        playList.addEventListener("click", function(e) {
            const songNode = e.target.closest('.song:not(.active)')

            if ( songNode || e.target.closest('.option'))
            {
                // Xử lý khi click vào song
                if(songNode)
                {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'));
                    console.log(_this.currentIndex)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
                // Xử lý khi click vào song
                if(e.target.closest('.option'))
                {
                    
                }
            }
        })
        
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.img}')`
        audio.src = this.currentSong.path 
    },

    nextSong: function() {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    preSong: function() {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    
    playRandomSong: function() {
        let newIndex

        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }
        while(newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    scrollToActiveSong: function() {
        setTimeout(() => {  
            $('.song.active').scrollIntoView({
                bahavior: 'smooth',
                block: 'center',
            })
              
        },200)
    },


    start: function()
    {
        // Định nghĩa các thuộc tính cho object
        this.defineProperties()

        // Lắng nghe xử lý các sự kiện DOM 
        this.handleEvents()

        // Tải thông tin bài hát giao diện đầu tiên vào UI khi chạy ứng dụng
        this.loadCurrentSong()

        // render playlist
        this.render()

    }
}


app.start()



