/* --------------------------------------------------------------------------- *\
    GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */

var $input = $('#query');


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
                    overlayHTML += '</ul>';
                    overlayHTML += '</section>';
                    overlayHTML += '</div>';
                    overlayHTML += '</div>';

                    // Inject the HTML into the DOM (on top)
                    $('body').prepend(overlayHTML);
                    $(overlay).hide();
                    $(overlay).fadeIn(400);
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
    SEARCH
\* --------------------------------------------------------------------------- */

// Search albums based on keyword
function searchAlbums() {
    var searchQuery = $input.val();
    // Get data 
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: searchQuery,
            type: 'album'
        },
        success: function(response) {
            var imageGallery = $('#image-gallery'),
                albums = response.albums.items,
                resultHTML = '',
                showResults = function() {
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
