/* --------------------------------------------------------------------------- *\
GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */

// Prepare for reuse
var input = $('#query'),
    imageGallery = $('#image-gallery'),
    sortBy = $('input[type="radio"]:checked')[0].id,
    albums = [],
    albumIndex,
    overlay = '#js-image-overlay';


/* --------------------------------------------------------------------------- *\
    iTUNES
\* --------------------------------------------------------------------------- */

// Get the iTunes link from the pushed data
function getItunesLink(string) {
    $.ajax({
        url: 'https://itunes.apple.com/search/?term=' + string,
        type: 'GET',
        dataType: 'jsonp',
        success: function(response) {
            // Save the link
            var retrievedAlbumLink = response.results[0].collectionViewUrl,
                // And prepare a container to inject the html
                html = '';
            // Setting the HTML with retrieved link
            html += '<a id="itunes-button" href="' + retrievedAlbumLink + '" class="cta-button">';
            html += '<img src="assets/itunes-badge.svg" alt="Get it oniTunes">';
            html += '</a>';
            // Inject the html into the DOM
            $('#play-list').append(html);
        }
    });
}

// Set data from Spotify to fetch data from iTunes
function setItunesData(artist, album) {
    // Prepare the data to be used for fetching the iTunes link
    var fixedString = (artist + '+' + album).replace(/ /g, '+').toLowerCase();
    // Push the fixed data to get the link
    getItunesLink(fixedString);
}


/* --------------------------------------------------------------------------- *\
    OVERLAY
\* --------------------------------------------------------------------------- */

// Get the index of a clicked thumbnail
function checkIndex(array, term, property) {
    // Check each item in the array
    for (var i = 0, amount = array.length; i < amount; i++) {
        // Check if the term matches one of the objects properties
        if (array[i][property] === term) {
            return i;
        }
    }
}

// Make the overlay being removed
function hideOverlay() {
    // Prepare function for removing overlay (for timeOut)
    var removeOverlay = function() {
        $(overlay).remove();
    };
    // Nice transition 
    $(overlay).fadeOut(400);
    // Removing overlay from DOM
    setTimeout(removeOverlay, 400);
    // Remove listener for closing overlay
    $(document).off('keyup');
}

// Make the overlay easy to close
function prepareCloseEvent() {
    // Prepare closebutton
    var closeButton = '#js-close-overlay';
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
        // Prepare to fetch target clicked
        var elementClicked = event.target.id;
        if (elementClicked === 'js-image-overlay') {
            hideOverlay();
        }
    };
}

// Add the details
function injectDetails(album, container, html) {
    // Prepare generic info
    var artistName = album.artists[0].name,
        albumName = album.name,
        albumImgUrl = album.images[0].url,
        albumReleased = album.release_date,
        tracks = album.tracks.items;
    // Print the generic info
    html += '<button id="js-close-overlay" class="close-overlay">Close overlay</button>';
    html += '<img src="' + albumImgUrl + '" alt="" class="album-artwork">';
    html += '<section id="js-data-wrapper">';
    html += '<h1>' + albumName + '</h1>';
    html += '<p>By ' + artistName + '</p>';
    html += '<p class="meta">Released on ';
    html += '<time datetime="' + albumReleased + '">' + albumReleased + '</time>';
    html += '</p>';
    // Open the track list
    html += '<ul id="play-list">';
    // Populate track list
    $.each(tracks, function(i, track) {
        // Prepare to save each track name
        var trackName = track.name;
        // And add it to the list
        html += '<li class="album-track">' + trackName + '</li>';
    });
    // Close the track list
    html += '</ul>';
    html += '</section>';
    // Inject the HTML into the overlay
    $(container).html(html);
    //Make the closebutton work
    prepareCloseEvent();
    //Add the URL for the iTunes button via ajax request
    setItunesData(artistName, albumName);
}

// Fetch the details in the overlay
function getDetails(index) {
    // Prepare for injection of the html
    var albumHTML = '',
        // Prepare to collect the album data
        requestedAlbumId = albums[index].id,
        // Prepare the container for the collected data
        overlayWrapper = '#js-overlay-wrapper';
    // Get data 
    $.ajax({
        url: 'https://api.spotify.com/v1/albums/' + requestedAlbumId,
        success: function(response) {
            // Keep the data
            var requestedAlbum = response;
            // And inject the data into the container with the correct HTML
            injectDetails(requestedAlbum, overlayWrapper, albumHTML);
        }
    });
}

// Make the arrows in the overlay work
function activateArrows() {
    // Prepare the buttons
    var prevButton = '#previous-result',
        nextButton = '#next-result';
    // Set 'previous' button
    $(prevButton).click(function() {
        // At the first result
        if (albumIndex === 0) {
            // Go to the last result
            albumIndex = albums.length - 1;
        } else {
            // Go to previous result
            albumIndex -= 1;
        }
        // Fetch those details
        getDetails(albumIndex);
    });
    // Set 'next' button
    $(nextButton).click(function() {
        // At the last result
        if (albumIndex === albums.length - 1) {
            // Go to the first result
            albumIndex = 0;
        } else {
            // Go to the next result
            albumIndex += 1;
        }
        // Fetch those details
        getDetails(albumIndex);
    });
}

// Show the foundation of the overlay
function printOverlay(container, html) {
    // Prepare html to inject
    html += '<div id="js-image-overlay">';
    html += '<div id="js-overlay-wrapper">';
    html += '</div>';
    html += '<button id="previous-result" class="carousel-control left-control">Previous result</button>';
    html += '<button id="next-result" class="carousel-control right-control">Next result</button>';
    html += '</div>';
    // Inject the HTML into the DOM (on top)
    $('body').prepend(html);
    // Hide first
    $(container).hide();
    // And fade in nicely
    $(container).fadeIn(400);
    //Activate the arrows
    activateArrows();
}

// Show the loader
function showLoader(container, html) {
    // Prepare html to inject
    html += '<svg id="loader-circular" class="circular" viewBox="25 25 50 50">';
    html += '<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />';
    html += '</svg>';
    // Inject in DOM
    $(container).prepend(html);
    // Hide first
    $(container).hide();
    // And fade in nicely
    $(container).fadeIn(400);
}

// Hide the loader
function hideLoader() {
    // Prepare the loader
    var loader = $('#loader-circular'),
        // Prepare function to remove loader
        removeLoader = function() {
            $(loader).remove();
        };
    // Nice transition
    $(loader).fadeOut(400);
    // And remove from DOM after it's faded out
    setTimeout(removeLoader, 400);
}


/* --------------------------------------------------------------------------- *\
    SORT / SHOW RESULTS
\* --------------------------------------------------------------------------- */

//Prepare the setter function
function setButtons(button) {
    // Push the checked button in the cache
    var forAttr = button;
    // Deselect all buttons visually
    $('label').attr('data-state', 'deselected');
    // Select the correct button visually
    $('label[for="' + forAttr + '"]').attr('data-state', 'selected');
}

// First set the default selected button to 
// be able to sort search results correctly
(function checkDefaultSort() {
    setButtons(sortBy);
})();

// Sort the array with albums by date
function sortByDate(obj) {
    obj.sort(function(a, b) {
        // Prepare data to compare
        var dateA = a.release_date;
        var dateB = b.release_date;
        // Compare and order in array
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
        // Prepare data to compare
        var nameA = a.name;
        var nameB = b.name;
        // Compare and order in array
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

// Dealing with a fancy callback here
function sortResults(array, callback) {
    callback(array);
}

// Check what button is currently active
function checkSortButtons() {
    // Check the set button
    if (sortBy === 'name') {
        // Sort the 
        sortResults(albums, sortByName);
    } else {
        sortResults(albums, sortByDate);
    }
}

// Make thumbs clickable
function activateThumbnails() {
    // Prepare the html for injection
    var overlayHTML = '';
    //On click of thumbnail
    $("a").click(function(event) {
        // Get id of the clicked result
        var clickedAlbumId = $(this).find('img').attr('id');
        // Set global index
        albumIndex = checkIndex(albums, clickedAlbumId, "id");
        // Skip default browser action
        event.preventDefault();
        //Prepare the overlay
        printOverlay(overlay, overlayHTML);
        // Get the additional data for the overlay by parsing the index
        getDetails(albumIndex);
    });
}

function printResults(array, html, container) {
    // Add each album HTML to the result list
    $.each(array, function(i, album) {
        // Get properties from the array
        var albumId = album.id,
            albumName = album.name,
            albumThumbUrl = album.thumb,
            albumReleased = album.release_date;
        // and add to html
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

function showResults() {
    // Prepare to collect the html
    var resultHTML = '';
    //First check what sort button is selected
    checkSortButtons();
    // Push the collected results, html and container to print to page
    printResults(albums, resultHTML, imageGallery);
    // Make the results clickable
    activateThumbnails();
}


//Prepare the change function
function changeSortButtons() {
    // Get the button id
    var buttonClicked = this.id;
    // Set this value to the clicked button
    sortBy = buttonClicked;
    // Set the style of this button
    setButtons(buttonClicked);
    // Check what value to sort results with
    checkSortButtons();
    // And refresh appearance of the results
    showResults();
}

// Change the appearance of the buttons on click
$('input[type="radio"').change(changeSortButtons);


/* --------------------------------------------------------------------------- *\
SEARCH
\* --------------------------------------------------------------------------- */

// Message if nothing is found
function printMessage(container, query) {
    container.html('<p>We have no search results for ' + '<strong>' + query + '</strong>' + '</p>');
}

// Get the release date from a specific request
function getDate(arr, obj, id) {
    //Get the release date 
        $.ajax({
            url: 'https://api.spotify.com/v1/albums/' + id,
            type: 'GET',
            dataType: 'json',
            success: function(response) {
                // And add the 'release_date' as a property
                obj.release_date = response.release_date;
            },
            // When this finally is done, push result into global albums variable
            complete: function() {
                arr.push(obj);
                // And show everything
                showResults();
            }
        });
}

// Get an object with just the neccessary data
function stripResults(response) {
    // Reset collected albums data
    albums = [];
    // Collect albums from response
    var results = response.albums.items;
    // Get each independent result
    $.each(results, function(i, result) {
        // Make a container to collect neccessary data
        var strippedResult = {};
        // Add properties to keep
        strippedResult.id = result.id;
        strippedResult.name = result.name;
        strippedResult.thumb = result.images[1].url;
        // Request the date
        getDate(albums, strippedResult, result.id);
    });
}

// Search albums based on keyword
function searchAlbums() {
    // Set the loader
    var loader = $('#search-loader'),
        // and it's container
        loaderHTML = '',
        // And search input
        searchQuery = input.val();
    // If the search input is not empty
    if (searchQuery !== '') {
        // Show a loader if there's no loader yet
        if (loader.children().length < 1) {
            showLoader(loader, loaderHTML);
        }
        // Fetch Spotify data
        $.ajax({
            url: 'https://api.spotify.com/v1/search',
            data: {
                q: searchQuery,
                type: 'album'
            },
            success: function(response) {
                var amountOfResults = response.albums.items.length;
                // Check if anything is found
                if (amountOfResults === 0) {
                    // If not show message
                    printMessage(imageGallery, searchQuery);
                } else {
                    // Keep neccessary stuff
                    stripResults(response);
                }
            },
            // Hide (and remove) loader when done fetching
            complete: hideLoader
        });
    }
}

// Search while typing anything
$(input).keyup(searchAlbums);
// Disable 'enter'-key for live search results
$(document).keypress(function(event) {
    if(event.which == 13) {
        event.preventDefault();
    }
});
