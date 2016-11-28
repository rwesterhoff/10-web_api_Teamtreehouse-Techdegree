/* --------------------------------------------------------------------------- *\
GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */

var input = $('#query'),
    searchQuery,
    imageGallery = $('#image-gallery'),
    sortBy = 'name',
    albums;


/* --------------------------------------------------------------------------- *\
SEARCH
\* --------------------------------------------------------------------------- */

function showResults() {
    var resultHTML;

    checkSortButtons(sortBy);

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

        //Get the releasedate 
        $.ajax({
            url: 'https://api.spotify.com/v1/albums/' + result.id,
            success: function(response) {
                strippedResult.release_date = response.release_date;
            },
            complete: showResults
        });

        // console.log(strippedResult);
        // Push result into global albums variable
        albums.push(strippedResult);
    });
}

// Search albums based on keyword
function searchAlbums() {
    searchQuery = input.val();
    albums = [];
    // Get data in Spotify
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

// Change the appearance of the buttons
$('input[type="radio"').change(function() {
    var forAttr = this.id;
    $('label').attr('data-state', 'deselected');
    $('label[for="' + forAttr + '"]').attr('data-state', 'selected');
    checkSortButtons(forAttr);
});

function checkSortButtons(filter) {
    sortBy = filter;

    if (sortBy === 'name') {
        sortResults(albums, sortByName);
    } else {
        sortResults(albums, sortByDate);
    }
}

// Sort the array with albums by date
function sortByDate(obj) {
    obj.sort(function(a, b) {
        var dateA = a.release_date;
        var dateB = b.release_date;
        if (dateA < dateB) {
            // console.log('Compared ' + dateA + ' + ' + dateB + ', ' + dateA + ' = smaller');
            return -1;
        }
        if (dateA > dateB) {
            // console.log('Compared ' + dateA + ' + ' + dateB + ', ' + dateB + ' = smaller');
            return 1;
        }
        // a must be equal to b
        // console.log('dates equal');
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


function sortResults(array, callback) {
    callback(array);
}

// TODO
// Get selected sort buttons
// If sort button is selected get name/id
// If = name > sortByName
// else sortByDate
