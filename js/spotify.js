/* --------------------------------------------------------------------------- *\
    GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */

var $input = $('#query'),
    imageGallery = $('#image-gallery'),
    albums = [];


/* --------------------------------------------------------------------------- *\
    iTUNES
\* --------------------------------------------------------------------------- */

function getItunesData(artist, album) {
    var fixedString = (artist + '+' + album).replace(/ /g, '+').toLowerCase(),
        itunesButton = '#itunes-button',
        getItunesLink = function(string) {
            $.ajax({
                url: 'https://itunes.apple.com/search/?term=' + string,
                type: 'GET',
                dataType: 'jsonp',
                success: function(data) {
                    var retrievedAlbumLink = data.results[0].collectionViewUrl;
                    $(itunesButton).attr('href', retrievedAlbumLink);
                },
                error: function() {
                    alert('error on "getAlbumId"');
                }
            });
        };
    getItunesLink(fixedString);
}


/* --------------------------------------------------------------------------- *\
    OVERLAY
\* --------------------------------------------------------------------------- */

// Show the details in an overlay
function showDetails(id) {
    var albumId = id;
    // Get data 
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function(details) {
            var artistName = details.artists[0].name,
                albumName = details.name,
                albumImgUrl = details.images[0].url,
                albumReleased = details.release_date,
                tracks = details.tracks.items,
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
                    overlayHTML += '<p>By ' + artistName + '</p>';
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
                    overlayHTML += '<a id="itunes-button" href="" class="cta-button">';
                    overlayHTML += '<img src="assets/itunes-badge.svg" alt="Get it oniTunes">';
                    overlayHTML += '</a>';
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

function getReleaseDate(id) {
    // console.log('checking release_date');
    var albumId = id;
    // Get data 
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + albumId,
        success: function(details) {
            var albumReleased = details.release_date;
            console.log(albumReleased);
        }
    });
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
            var result = response.albums.items,
                resultHTML = '',
                showResults = function() {
                    // Check if there are results
                    if (result.length === 0) {
                        imageGallery.html('<p>We have no search results for ' + '<strong>' + searchQuery + '</strong>' + '</p>');
                    } else {
                        $.each(result, function(i, album) {
                            var albumId = album.id,
                                albumName = album.name,
                                albumReleased = getReleaseDate(albumId),
                                albumThumbUrl = album.images[1].url,
                                result = {
                                    'id' : albumId,
                                    'name' : albumName,
                                    'release_date' : albumReleased,
                                    'thumb' : albumThumbUrl
                                };
                                albums.push(result);

                            // Add each album HTML to the result list
                            resultHTML += '<li class="gallery-item">';
                            resultHTML += '<a href="">';
                            resultHTML += '<img id="' + albumId + '" src="' + albumThumbUrl + '" alt="' + albumName + '">';
                            resultHTML += '</a>';
                            resultHTML += '<h2>' + albumName + '</h2>';
                            resultHTML += '<p class="meta">';
                            resultHTML += '<time datetime="' + albumReleased + '">' + albumReleased + '</time>';
                            resultHTML += '</p>';
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
            console.log(albums);
        }
    });
}

// While typing anything in the search field
$($input).keyup(function() {
    // Immediately search for albums by using the keyword
    searchAlbums();
});


/* --------------------------------------------------------------------------- *\
    SORT RESULTS
\* --------------------------------------------------------------------------- */
// Change the appearance of the buttons
$('input[type="radio"').change(function() {
    var forAttr = this.id;
    $('label').attr('data-state', 'deselected');
    $('label[for="' + forAttr + '"]').attr('data-state', 'selected');
});


var test = [
    { name: 'John', date: 3 },
    { name: 'Zoe', date: 1 },
    { name: 'Miranda', date: 2 }
];

// Sort the array with albums by date
function sortByDate(obj) {
    obj.sort(function(a, b) {
        var dateA = a.date;
        var dateB = b.date;
        if (dateA < dateB) {
            console.log('Compared ' + dateA + ' + ' + dateB + ', ' + dateA + ' = smaller');
            return -1;
        }
        if (dateA > dateB) {
            console.log('Compared ' + dateA + ' + ' + dateB + ', ' + dateB + ' = smaller');
            return 1;
        }
        // a must be equal to b
        console.log('dates equal');
        return 0;
    });
    console.log('Sorted by date:');
    console.log(obj);
}

// Sort the array with albums by name
function sortByName(obj) {
    obj.sort(function(a, b) {
        var nameA = a.name;
        var nameB = b.name;
        if (nameA < nameB) {
            // console.log('Compared ' + nameA + ' + ' + nameB + ', ' + nameA + ' = smaller');
            return -1;
        }
        if (nameA > nameB) {
            // console.log('Compared ' + nameA + ' + ' + nameB + ', ' + nameB + ' = smaller');
            return 1;
        }
        // a must be equal to b
        // console.log('dates equal');
        return 0;
    });
    console.log('Sorted by name:');
    console.log(obj);
}

sortByName(test);

console.log(albums);