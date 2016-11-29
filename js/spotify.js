/* --------------------------------------------------------------------------- *\
GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */

var input = $('#query'),
    searchQuery,
    imageGallery = $('#image-gallery'),
    albums,
    sortBy = $('input[type="radio"]:checked')[0].id;


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
                success: function(response) {
                    var retrievedAlbumLink = response.results[0].collectionViewUrl;
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
    var requestedAlbumId = id;
    // Get data 
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + requestedAlbumId,
        success: function(response) {

            console.log('response: ');
            console.log(response);

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
                hideOverlay = function() {
                    var removeOverlay = function() {
                        $(overlay).remove();
                    }
                    // Nice transition
                    $(overlay).fadeOut(400);
                    // Removing from DOM
                    setTimeout(removeOverlay, 400);
                    $(document).off('keydown');
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
                };
            showOverlay();
            prepareCloseEvent();
        }
    });
}

/* --------------------------------------------------------------------------- *\
SEARCH
\* --------------------------------------------------------------------------- */

function activateThumbnails() {
    //On click of thumbnail
    $("a").click(function(event) {
        var requestedAlbumId = $(this).find('img').attr('id');
        event.preventDefault();
        // Get the additional data for the overlay by parsing the id
        showDetails(requestedAlbumId);
    });
}

function printResults(html, container) {
    // Check if there are any albums
    if (albums.length === 0) {
        container.html('<p>We have no search results for ' + '<strong>' + searchQuery + '</strong>' + '</p>');
    } else {
        $.each(albums, function(i, album) {
            var albumId = album.id,
                albumName = album.name,
                albumThumbUrl = album.thumb,
                albumReleased = album.release_date;

            // Add each album HTML to the result list
            html += '<li class="gallery-item">';
            html += '<a href="">';
            html += '<img id="' + albumId + '" src="' + albumThumbUrl + '" alt="' + albumName + '">';
            html += '</a>';
            html += '<h2>' + albumName + '</h2>';
            html += '<p class="meta">';
            html += '<time datetime="' + albumReleased + '">' + albumReleased + '</time>';
            html += '</p>';
            html += '</li>';
        });
        // Inject the HTML into DOM (the result list)
        container.html(html);
    }
}

function showResults() {
    var resultHTML;

    //First check what sort button is selected
    checkSortButtons();
    printResults(resultHTML, imageGallery);
    activateThumbnails();

    console.log('albums: ');
    console.log(albums);
}

function stripResults(response) {
    var results = response.albums.items;

    $.each(results, function(i, result) {
        var strippedResult = {};
        // Add properties
        strippedResult.id = result.id;
        strippedResult.name = result.name;
        strippedResult.thumb = result.images[1].url;

        //Get the release date 
        $.ajax({
            url: 'https://api.spotify.com/v1/albums/' + result.id,
            success: function(response) {
                console.log('response: ');
                console.log(response);
                strippedResult.release_date = response.release_date;
            },
            complete: showResults
        });

        // Push result into global albums variable
        albums.push(strippedResult);
    });
}

// Search albums based on keyword
function searchAlbums() {
    searchQuery = input.val();
    albums = [];
    // Get data from Spotify
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: searchQuery,
            type: 'album'
        },
        success: stripResults
    });
}

// Search while typing anything
$(input).keyup(searchAlbums);


/* --------------------------------------------------------------------------- *\
    SORT RESULTS
\* --------------------------------------------------------------------------- */

//Prepare the setter function
function setButtons(button) {
    forAttr = button;

    $('label').attr('data-state', 'deselected');
    $('label[for="' + forAttr + '"]').attr('data-state', 'selected');
}

// First set the default selected button 
(function checkDefaultSort() {
    var forAttr = sortBy;

    setButtons(forAttr);
})();

function checkSortButtons() {
    if (sortBy === 'name') {
        sortResults(albums, sortByName);
    } else {
        sortResults(albums, sortByDate);
    }
}

//Prepare the change function
function changeSortButtons() {
    var forAttr = this.id;
    sortBy = forAttr;

    setButtons(forAttr);
    checkSortButtons();
    showResults();
}

// Change the appearance of the buttons
$('input[type="radio"').change(changeSortButtons);

// Sort the array with albums by date
function sortByDate(obj) {
    obj.sort(function(a, b) {
        var dateA = a.release_date;
        var dateB = b.release_date;
        if (dateA < dateB) {
            return -1;
        }
        if (dateA > dateB) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });
}

// Sort the array with albums by name
function sortByName(obj) {
    obj.sort(function(a, b) {
        var nameA = a.name;
        var nameB = b.name;
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });
}

function sortResults(array, callback) {
    callback(array);
}
/*// Sort the array generic function
function sortResults(array, value) {
    array.sort(function(a, b) {
        var A = a.value;
        var B = b.value;
        if (A < B) {
            return -1;
        }
        if (A > B) {
            return 1;
        }
        // a must be equal to b
        return 0;
    });
}*/
// TODO
// Refactor showDetails
// Add arrow functionality
// Find 'undefined' item in the <ul>
// Show name and date on wider screens
