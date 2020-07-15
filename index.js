/*
    CONSTANTS   
*/

let themes = {

    default: { 
        "html": {
            "scroll-behavior": "smooth",
        },
        "body": { 
            "font-size": "20px",
            "color": "#000000",
            // "background-color": "#ffffff",
            // "background-image": "url('https://www.transparenttextures.com/patterns/bedge-grunge.png')",
            "font-family": "Baskerville,Baskerville Old Face,Hoefler Text,Garamond,Times New Roman,serif",
        },
        "p": {

        },
        "img": {
            "transition": "transform 1s ease-in-out",
        },
        "img:hover": {
             "transform": "scale(1.8)",
        },
    },

    default_mobile: { 
        "body": { 
            "font-size": "35px",
            "color": "#000000",
            "background-color": "#ffffff",
            "background-image": "url('https://www.transparenttextures.com/patterns/bedge-grunge.png')",
            "font-family": "Baskerville,Baskerville Old Face,Hoefler Text,Garamond,Times New Roman,serif",
        }
    },

    dark: { 
        "body": { 
            "background": "#002b36", 
            "color": "#fbfbf8"
        }
    },
}

let mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

// EpubJS rendition object
let rendition;

// HTML element for rendering book
let book;

// jszip file reader
var reader = new FileReader();

// File uploaded by end user
var $file = $("#file")

// handle uploading the book
$file.on('change', async function(evt) {

	console.log('reading files...')

    let files = evt.target.files;

    await renderEpub(files[0]) //rendering epub file

    // bindSwipe()
    bindKeys()
});

// render epub
async function renderEpub(opf) {

    // declare book
    book = ePub(opf);

    // rendition

    // apply mobile theme if needed
if (mobile) {
    // some code..
    rendition = await book.renderTo('area', { flow: "scrolled", manager: "continuous", snap: true, width: '100%', height: '70vh'});
    // rendition.themes.select('default_mobile')
} else {
    rendition = await book.renderTo('area', { flow: "paginated", width: '100%', height: '70vh'});
}

    // rendition = await book.renderTo('area', { flow: "scrolled", manager: "continuous", snap: true, width: '100%', height: '70vh'});

    console.log('epub rendered...')
    console.log(rendition)

    rendition.themes.register('default', themes.default);
    rendition.themes.register('dark', themes.dark);
    rendition.themes.register('default_mobile', themes.default_mobile)

    rendition.hooks.render.register(function (contents, view) {
        console.log('rendition hook fired: rendition.hooks.render')
    });

    rendition.hooks.content.register(function (contents, view) {
        console.log('rendition hook fired: rendition.hooks.content')
    });

    book.spine.hooks.content.register(function (contents, view) {
        console.log('book hook fired: book.spine.hooks.content')
    });

    // get display
    let displayed = await rendition.display();


    rendition.themes.select('default')
}

// handle key presses
function bindKeys() {
    $(window).bind('keydown', function(e){
        
        if (e.keyCode == 37) {
            rendition.themes.select('default')
            rendition.prev();
        }
        else if (e.keyCode == 39) {
            // rendition.themes.select('dark')
            rendition.next();
        }
    });
}

// handle swipe actions
function bindSwipe () {

    let touchStart = 0;
    let touchEnd = 0;

    rendition.on('touchstart', event => {
      touchStart = event.changedTouches[0].screenX;
    });


    rendition.on('touchend', event => {

        touchEnd = event.changedTouches[0].screenX;

        if (touchStart < touchEnd) { // Swipe right
            rendition.prev()
        }

        if (touchStart > touchEnd) { // Swipe left
            rendition.next()
        }
    });
}

setupVideo()

async function setupVideo() {
    // 2. This code loads the IFrame Player API code asynchronously.
      var tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}

var player;

var done = false;

// 5. The API calls this function when the player's state changes.
//    The function indicates that when playing a video (state=1),
//    the player should play for six seconds and then stop.
function onPlayerStateChange(event) {

    console.log('player state change: ')
    console.log(event)

    if (event.data == YT.PlayerState.PLAYING) {
        console.log('playing!')
        console.log('unmuting...')
        // player.unMute()
        console.log('unmuted!')
      // setTimeout(stopVideo, 6000);
      // done = true;
    }
}

function stopVideo() {
    player.stopVideo();
}

function onYouTubeIframeAPIReady() {
    console.log('iframe api ready')

    player = new YT.Player('player', {
      height: '1000px',
      width: '100%',
      videoId: 'IvJQTWGP5Fg',
      events: {
        'onReady': onPlayerReady,
        'onStateChange': onPlayerStateChange
      }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    console.log('player ready, playing video...')
    event.target.setVolume(0);
    event.target.playVideo();
    event.target.setVolume(50);
}

document.body.addEventListener('click', go, true);

function go() {
    console.log('forcing video play...');
    player.playVideo();
} 