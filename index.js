/*
    CONSTANTS   
*/

const themes = {
        default: { "body": { "background": "#ffffff", "color": "#000000", "font-family": "Baskerville,Baskerville Old Face,Hoefler Text,Garamond,Times New Roman,serif", "font-size": "37px", "background-image": "url('https://www.transparenttextures.com/patterns/bedge-grunge.png')"}},
        eggshell: { "body": { "background": "#f0ead6", "color": "#000000"}},
        offwhite: { "body": { "background": "#fbfbf8", "color": "#000000"}},
        dark: { "body": { "background": "#002b36", "color": "#fbfbf8"}},
}

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

    bindSwipe()
    bindKeys()
});

// render epub
async function renderEpub(opf) {

    // declare book
    book = ePub(opf);

    // rendition
    rendition = await book.renderTo('area', { flow: "paginated", width: '100%', height: '70vh'});

    console.log('epub rendered...')

    rendition.themes.register('default', themes.default);
    rendition.themes.register('eggshell', themes.eggshell);
    rendition.themes.register('offwhite', themes.offwhite);
    rendition.themes.register('dark', themes.dark);

    rendition.themes.select('default')


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
}

// handle key presses
function bindKeys() {
    $(window).bind('keydown', function(e){
        
        if (e.keyCode == 37) {
            rendition.prev();
        }
        else if (e.keyCode == 39) {
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