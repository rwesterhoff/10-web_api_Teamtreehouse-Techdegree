/* --------------------------------------------------------------------------- *\
GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */

var input = $('#query'),
    imageGallery = $('#image-gallery'),
    searchQuery,
    albums = [];


/* --------------------------------------------------------------------------- *\
SEARCH
\* --------------------------------------------------------------------------- */

function showResults() {
    var resultHTML;

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
        console.log('albums:');
        console.log(albums);
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
            }
        });
        // Push result into global albums variable
        albums.push(strippedResult);
    });
}

// Search albums based on keyword
function searchAlbums() {
    searchQuery = input.val();
    // Get data in Spotify
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: searchQuery,
            type: 'album'
        },
        success: stripResults,
        complete: showResults
    });
}

// Search while typing anything
$(input).keyup(searchAlbums);
