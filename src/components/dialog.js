export const dialog ={
    small(imgurl, { movie }, event) {
        return `<div class="dialog-wrap">
            <div class="dialog">
                <div class="dialog-player-container">
                    <div class="video"></div>
                    <div class="video-img"><img src="${imgurl}" alt="${movie.title} 이미지" /></div>
                    <div class="player-action-wrap">
                        <a>
                            <button><div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Caret Forward</title><path d='M190.06 414l163.12-139.78a24 24 0 000-36.44L190.06 98c-15.57-13.34-39.62-2.28-39.62 18.22v279.6c0 20.5 24.05 31.56 39.62 18.18z'/></svg><div></button>
                        </a>
                        <div>
                            <button><div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Add</title><path fill='none' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32' d='M256 112v288M400 256H112'/></svg></div></button>
                        </div>
                        <div>
                            <button><div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Thumbs Up</title><path d='M320 458.16S304 464 256 464s-74-16-96-32H96a64 64 0 01-64-64v-48a64 64 0 0164-64h30a32.34 32.34 0 0027.37-15.4S162 221.81 188 176.78 264 64 272 48c29 0 43 22 34 47.71-10.28 29.39-23.71 54.38-27.46 87.09-.54 4.78 3.14 12 7.95 12L416 205' fill='none' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/><path d='M416 271l-80-2c-20-1.84-32-12.4-32-30h0c0-17.6 14-28.84 32-30l80-4c17.6 0 32 16.4 32 34v.17A32 32 0 01416 271zM448 336l-112-2c-18-.84-32-12.41-32-30h0c0-17.61 14-28.86 32-30l112-2a32.1 32.1 0 0132 32h0a32.1 32.1 0 01-32 32zM400 464l-64-3c-21-1.84-32-11.4-32-29h0c0-17.6 14.4-30 32-30l64-2a32.09 32.09 0 0132 32h0a32.09 32.09 0 01-32 32zM432 400l-96-2c-19-.84-32-12.4-32-30h0c0-17.6 13-28.84 32-30l96-2a32.09 32.09 0 0132 32h0a32.09 32.09 0 01-32 32z' fill='none' stroke='#FFF' stroke-miterlimit='10' stroke-width='32'/></svg></div></button>
                        </div>
                        <div>
                            <button><div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Thumbs Down</title><path d='M192 53.84S208 48 256 48s74 16 96 32h64a64 64 0 0164 64v48a64 64 0 01-64 64h-30a32.34 32.34 0 00-27.37 15.4S350 290.19 324 335.22 248 448 240 464c-29 0-43-22-34-47.71 10.28-29.39 23.71-54.38 27.46-87.09.54-4.78-3.14-12-8-12L96 307' fill='none' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/><path d='M96 241l80 2c20 1.84 32 12.4 32 30h0c0 17.6-14 28.84-32 30l-80 4c-17.6 0-32-16.4-32-34v-.17A32 32 0 0196 241zM64 176l112 2c18 .84 32 12.41 32 30h0c0 17.61-14 28.86-32 30l-112 2a32.1 32.1 0 01-32-32h0a32.1 32.1 0 0132-32zM112 48l64 3c21 1.84 32 11.4 32 29h0c0 17.6-14.4 30-32 30l-64 2a32.09 32.09 0 01-32-32h0a32.09 32.09 0 0132-32zM80 112l96 2c19 .84 32 12.4 32 30h0c0 17.6-13 28.84-32 30l-96 2a32.09 32.09 0 01-32-32h0a32.09 32.09 0 0132-32z' fill='none' stroke='#FFF' stroke-miterlimit='10' stroke-width='32'/></svg></div></button>
                        </div>
                    </div>
                </div>
                        
                <div class="dialog-info">
                    <p>${movie.title}</p>
                    <div class="dialog-info-detail">
                        <div>${movie.release_date}</div>
                        <div>${movie.popularity}</div>
                    </div>
                </div>
            </div>
        </div>`
    },

    large(imgurl, { movie }, event) {
        return `<div class="dialog-wrap full">
            <div class="dialog">
                <div class="dialog-player-container">
                    <div class="video"></div>
                    <div class="video-img"><img src="${imgurl}" alt="${movie.title} 이미지" /></div>
                    <div class="player-action-wrap">
                        <a>
                            <button class="play-btn"><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Caret Forward</title><path d='M190.06 414l163.12-139.78a24 24 0 000-36.44L190.06 98c-15.57-13.34-39.62-2.28-39.62 18.22v279.6c0 20.5 24.05 31.56 39.62 18.18z' fill='#000' stroke='#000'/></svg><p>재생</p></button>
                        </a>
                        <div>
                            <button><div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Add</title><path fill='none' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32' d='M256 112v288M400 256H112'/></svg></div></button>
                        </div>
                        <div>
                            <button><div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Thumbs Up</title><path d='M320 458.16S304 464 256 464s-74-16-96-32H96a64 64 0 01-64-64v-48a64 64 0 0164-64h30a32.34 32.34 0 0027.37-15.4S162 221.81 188 176.78 264 64 272 48c29 0 43 22 34 47.71-10.28 29.39-23.71 54.38-27.46 87.09-.54 4.78 3.14 12 7.95 12L416 205' fill='none' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/><path d='M416 271l-80-2c-20-1.84-32-12.4-32-30h0c0-17.6 14-28.84 32-30l80-4c17.6 0 32 16.4 32 34v.17A32 32 0 01416 271zM448 336l-112-2c-18-.84-32-12.41-32-30h0c0-17.61 14-28.86 32-30l112-2a32.1 32.1 0 0132 32h0a32.1 32.1 0 01-32 32zM400 464l-64-3c-21-1.84-32-11.4-32-29h0c0-17.6 14.4-30 32-30l64-2a32.09 32.09 0 0132 32h0a32.09 32.09 0 01-32 32zM432 400l-96-2c-19-.84-32-12.4-32-30h0c0-17.6 13-28.84 32-30l96-2a32.09 32.09 0 0132 32h0a32.09 32.09 0 01-32 32z' fill='none' stroke='#FFF' stroke-miterlimit='10' stroke-width='32'/></svg></div></button>
                        </div>
                        <div>
                            <button><div><svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Thumbs Down</title><path d='M192 53.84S208 48 256 48s74 16 96 32h64a64 64 0 0164 64v48a64 64 0 01-64 64h-30a32.34 32.34 0 00-27.37 15.4S350 290.19 324 335.22 248 448 240 464c-29 0-43-22-34-47.71 10.28-29.39 23.71-54.38 27.46-87.09.54-4.78-3.14-12-8-12L96 307' fill='none' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32'/><path d='M96 241l80 2c20 1.84 32 12.4 32 30h0c0 17.6-14 28.84-32 30l-80 4c-17.6 0-32-16.4-32-34v-.17A32 32 0 0196 241zM64 176l112 2c18 .84 32 12.41 32 30h0c0 17.61-14 28.86-32 30l-112 2a32.1 32.1 0 01-32-32h0a32.1 32.1 0 0132-32zM112 48l64 3c21 1.84 32 11.4 32 29h0c0 17.6-14.4 30-32 30l-64 2a32.09 32.09 0 01-32-32h0a32.09 32.09 0 0132-32zM80 112l96 2c19 .84 32 12.4 32 30h0c0 17.6-13 28.84-32 30l-96 2a32.09 32.09 0 01-32-32h0a32.09 32.09 0 0132-32z' fill='none' stroke='#FFF' stroke-miterlimit='10' stroke-width='32'/></svg></div></button>
                        </div>
                    </div>
                </div>
                        
                <div class="close-btn">
                    <svg xmlns='http://www.w3.org/2000/svg' class='ionicon' viewBox='0 0 512 512'><title>Close</title><path fill='#FFF' stroke='#FFF' stroke-linecap='round' stroke-linejoin='round' stroke-width='32' d='M368 368L144 144M368 144L144 368'/></svg>
                </div>
                        
                <div class="dialog-info">
                    <p>${movie.title}</p>
                    <div class="dialog-info-detail">
                        <div>${movie.release_date}</div>
                        <div>${movie.popularity}</div>
                    </div>
                </div>
            </div>
        </div>`
    }
}