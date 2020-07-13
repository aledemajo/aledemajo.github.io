let rendition;

var $result = $("#result");

var $file = $("#file")

let book;

// jszip file reader
var reader = new FileReader();

// handle uploading the book
$file.on('change', function(evt) {

    let files = evt.target.files;

    renderEpub(files[0]) //rendering epub file

    // remove content
    $result.html("");
    // be sure to show the results
    $("#result_block").removeClass("hidden").addClass("show");

    // Closure to capture the file information.
    function handleFile(f) {
        var $title = $("<h4>", {
            text : f.name
        });
        var $fileContent = $("<ul>");
        $result.append($title);
        $result.append($fileContent);

        var dateBefore = new Date();
        JSZip.loadAsync(f)                                   // 1) read the Blob
        .then(function(zip) {
            var dateAfter = new Date();
            $title.append($("<span>", {
                "class": "small",
                text:" (loaded in " + (dateAfter - dateBefore) + "ms)"
            }));

            zip.forEach(function (relativePath, zipEntry) {  // 2) print entries

                if(relativePath == 'OEBPS/content.opf') {

                    zip.file(relativePath).async('string').then(function (data) {
                        // here I need to do something with the opf if I want to render it with my own library
                    })

                    zipEntry.async("string").then(function (content) {
                    });

                }

                $fileContent.append($("<li>", {
                    text : zipEntry.name
                }));
            });
        }, function (e) {
            $result.append($("<div>", {
                "class" : "alert alert-danger",
                text : "Error reading " + f.name + ": " + e.message
            }));
        });
    }

    for (var i = 0; i < files.length; i++) {
        handleFile(files[i]);
    }
});

// render the book
// $(window).ready(function() {
//     $('#magazine').turn({
//                         display: 'double',
//                         acceleration: true,
//                         gradients: true,
//                         elevation:50,
//                         when: {
//                             turned: function(e, page) {
//                                 console.log('Current view: ', $(this).turn('view'));
//                             }
//                         }
//                     });
// });

// render epub
async function renderEpub(opf) {

    // declare book
    book = ePub(opf);

    // rendition
    rendition = await book.renderTo('area', {width: '100%', height: 750, flow: "paginated"});

    // rendition.hooks.content.register(function (callback, renderer) {
    // window.setTimeout(function () {
    //     var style = renderer.doc.createElement("style");
    //     style.innerHTML = "*{-webkit-transition: transform {t} ease;-moz-transition: tranform {t} ease;-o-transition: transform {t} ease;-ms-transition: transform {t} ease;transition: transform {t} ease;}";
    //     style.innerHTML = style.innerHTML.split("{t}").join("0.5s");
    //     renderer.doc.body.appendChild(style);
    // }, 100)
    // if (callback) {
    //     callback();
    // }
    //     });

    // get display
    let displayed = await rendition.display();
}

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


$(window).on( "swipeleft", function( event ) {
  rendition.next();
  console.log('swipe')
});

$(window).on( "swiperight", function( event ) {
  rendition.prev();
});