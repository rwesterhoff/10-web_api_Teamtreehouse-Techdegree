/* --------------------------------------------------------------------------- *\
GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */

var input = $('#query'),
    searchQuery,
    imageGallery = $('#image-gallery'),
    albums,
    sortBy = $('input[type="radio"]:checked')[0].id;

/* --------------------------------------------------------------------------- *\
SEARCH
\* --------------------------------------------------------------------------- */

function showResults() {
    var resultHTML;

    //First check what sort button is selected
    checkSortButtons();

    // Check if there are any albums
    if (albums.length === 0) {
        imageGallery.html('<p>We have no search results for ' + '<strong>' + searchQuery + '</strong>' + '</p>');
    } else {
        $.each(albums, function(i, album) {
            var albumId = album.id,
                albumName = album.name,
                albumThumbUrl = album.thumb,
                albumReleased = album.release_date;

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

// First set the selected button 
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

TODO
// Refactor showDetails
// Add arrow functionality
// Find 'undefined' item in the <ul>
// Show name and date on wider screens