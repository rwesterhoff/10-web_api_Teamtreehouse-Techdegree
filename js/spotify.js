/* --------------------------------------------------------------------------- *\
    GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */

var $input = $('#query'),
    imageGallery = $('#image-gallery');


/* --------------------------------------------------------------------------- *\
    OVERLAY
\* --------------------------------------------------------------------------- */

// Show the details in an overlay
function showDetails(id) {
    var albumId = id;
    // Get data 
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function(response) {
            var artistName = response.artists[0].name,
                albumName = response.name,
                albumImgUrl = response.images[0].url,
                albumReleased = response.release_date,
                tracks = response.tracks.items,
                overlayHTML = '',
                overlay = '#js-image-overlay',
                closeButton = '#js-close-overlay',
                showOverlay = function() {
                    // Opening HTML and fill with artist and album data
                    overlayHTML += '<div id="js-image-overlay">';
                    overlayHTML += '<div id="js-overlay-wrapper">';
                    overlayHTML += '<button id="js-close-overlay" class="close-overlay">Close overlay</button>';
                    overlayHTML += '<img src="' + albumImgUrl + '" alt="" class="album-artwork">';
                    overlayHTML += '<section id="js-data-wrapper">';
                    overlayHTML += '<h1>' + albumName + '</h1>';
                    overlayHTML += '<p><span class="visually-hidden">Artist: </span>' + artistName + '</p>';
                    overlayHTML += '<p class="meta">Released on ';
                    overlayHTML += '<time datetime="' + albumReleased + '">' + albumReleased + '</time>';
                    overlayHTML += '</p>';
                    overlayHTML += '<ul class="play-list">';
                    // Populate track list
                    $.each(tracks, function(i, track) {
                        var trackName = track.name;
                        overlayHTML += '<li class="album-track">' + trackName + '</li>';
                    });
                    // Closing the HTML
                    overlayHTML += '<li id="itunes-store">';
                    overlayHTML += '<a id="itunes-button" href="" class="cta-button">';
                    overlayHTML += '<img src="../assets/Get_it_on_iTunes_Badge_US_1114.svg" alt="Get it oniTunes">';
                    overlayHTML += '</a>';
                    overlayHTML += '</li>';
                    overlayHTML += '</ul>';
                    overlayHTML += '</section>';
                    overlayHTML += '</div>';
                    overlayHTML += '</div>';

                    // Inject the HTML into the DOM (on top)
                    $('body').prepend(overlayHTML);
                    $(overlay).hide();
                    $(overlay).fadeIn(400);
                    getItunesData(artistName, albumName);
                },
                prepareCloseEvent = function() {
                    // On click of close button
                    $(closeButton).click(function() {
                        hideOverlay();
                    });
                    // On keyboard event 'esc'
                    $(document).keyup(function(event) {
                        if (event.keyCode === 27) {
                            hideOverlay();
                        }
                    });
                    // On click outside modal
                    window.onclick = function(event) {
                        var elementClicked = event.target.id;
                        if (elementClicked === 'js-image-overlay') {
                            hideOverlay();
                        }
                    };
                },
                hideOverlay = function() {
                    function removeOverlay() {
                        $(overlay).remove();
                    }
                    // Nice transition
                    $(overlay).fadeOut(400);
                    // Removing from DOM
                    setTimeout(removeOverlay, 400);
                    $(document).off('keydown');
                };
            showOverlay();
            prepareCloseEvent();
        }
    });
}


/* --------------------------------------------------------------------------- *\
    iTUNES
\* --------------------------------------------------------------------------- */

function getItunesData(artist, album) {
    var fixedString = (artist + '+' + album).replace(/ /g, '+').toLowerCase(),
        itunesButton = '#itunes-button',
        getItunesLink = function(fixedString) {
            $.ajax({
                url: 'https://itunes.apple.com/search/?term=' + fixedString,
                /*type: 'GET',*/
                dataType: 'jsonp',
                success: function(response) {
                    var retrievedAlbumLink = response.results[0].collectionViewUrl;
                    console.log(response);
                    console.log('retrievedAlbumLink: ' + retrievedAlbumLink);
                    console.log('collectionId: ' + response.results[0].collectionId);
                    $('#itunes-button').attr('href', retrievedAlbumLink);
                },
                error: function() {
                    alert('error on "getAlbumId"');
                }
            });
        };

    console.log(fixedString);
    getItunesLink();
}


/* --------------------------------------------------------------------------- *\
    SEARCH
\* --------------------------------------------------------------------------- */

// Search albums based on keyword
function searchAlbums() {
    var searchQuery = $input.val();
    // Get data in Spotify
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: searchQuery,
            type: 'album'
        },
        success: function(response) {
            var albums = response.albums.items,
                resultHTML = '',
                showResults = function() {
                    // Check if there are results
                    if (albums.length === 0) {
                        imageGallery.html('<p>We have no search results for ' + '<strong>' + searchQuery + '</strong>' + '</p>');
                    } else {
                        $.each(albums, function(i, album) {
                            var albumId = album.id,
                                albumName = album.name,
                                albumThumbUrl = album.images[1].url;
                            // Add each album HTML to the result list
                            resultHTML += '<li class="gallery-item">';
                            resultHTML += '<a href="">';
                            resultHTML += '<img id="' + albumId + '" src="' + albumThumbUrl + '" alt="' + albumName + '">';
                            resultHTML += '</a>';
                            resultHTML += '</li>';
                        });
                        // Inject the HTML into DOM (the result list)
                        imageGallery.html(resultHTML);
                    }
                },
                activateThumbnails = function() {
                    //On click of thumbnail
                    $("a").click(function(event) {
                        var requestedAlbumId = $(this).find('img').attr('id');
                        event.preventDefault();
                        showDetails(requestedAlbumId);
                    });
                };
            showResults();
            activateThumbnails();
        }
    });
}

// While typing anything in the search field
$($input).keyup(function() {
    // Immediately search for albums by using the keyword
    searchAlbums();
});
