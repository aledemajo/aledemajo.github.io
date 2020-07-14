// EpubJS rendition
let rendition;

// HTML element for rendering
let book;

// Optional HTML tag to display statistics. TODO: remove
var $result = $("#result");

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

    // // remove content
    // $result.html("");
    // // be sure to show the results
    // $("#result_block").removeClass("hidden").addClass("show");

    // // Closure to capture the file information.
    // function handleFile(file) {
    //     JSZip.loadAsync(file).then(function(zip) {

    //         zip.forEach(function (relativePath, zipEntry) {

    //             if(relativePath == 'OEBPS/content.opf') {

    //                 console.log(zipEntry)

    //                 zip.file(relativePath).async('string').then(function (data) {
    //                     // here I need to do something with the opf if I want to render it with my own library
    //                 })

    //                 zipEntry.async("string").then(function (content) {
    //                     // you can use the content of the OPF file here
    //                 });

    //             }
    //         });
    //     }, function (e) {
    //         console.log('error reading file: ' + e)
    //     });
    // }

    // for (var i = 0; i < files.length; i++) {
    //     handleFile(files[i]);
    // }
});

// render epub
async function renderEpub(opf) {

    // declare book
    book = ePub(opf);

    // rendition
    rendition = await book.renderTo('area', { flow: "paginated", width: '100%', height: '1800'});


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

function bindKeys() {
    // handle key presses
    $(window).bind('keydown', function(e){
        
        if (e.keyCode == 37) {
            // $('#magazine').turn('previous');
            rendition.prev();
        }
        else if (e.keyCode == 39) {
            // $('#magazine').turn('next');
            rendition.next();
        }
    });
}

function bindSwipe () {

    let touchStart = 0;
    let touchEnd = 0;

    rendition.on('touchstart', event => {
      touchStart = event.changedTouches[0].screenX;
    });


    rendition.on('touchend', event => {

        touchEnd = event.changedTouches[0].screenX;
        if (touchStart < touchEnd) {
            // Swiped Right
            rendition.prev()
            console.log('swiped right')
        }
        if (touchStart > touchEnd) {
            // Swiped Left
            rendition.next()
            console.log('swiped left')
        }
    });
}