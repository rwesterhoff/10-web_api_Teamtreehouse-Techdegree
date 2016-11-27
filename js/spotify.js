/* --------------------------------------------------------------------------- *\
    GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */

var input = $('#query'),
    albums = [];


/* --------------------------------------------------------------------------- *\
    SEARCH
\* --------------------------------------------------------------------------- */
function populateresults(response) {
    var results = response.albums.items;

    $.each(results, function(i, result) {
        var strippedResults = {
                'id': result.id,
                'name': result.name,
                'thumb': result.images[1].url
            };

        $.ajax({
            url: 'https://api.spotify.com/v1/albums/' + result.id,
            success: function(details) {
                strippedResults.release_date = details.release_date;
                return 'string';
            }
        });

        albums.push(strippedResults);
    });

    console.log('albums:');
    console.log(albums);
}

// Search albums based on keyword
function searchAlbums() {
    var searchQuery = input.val();
    // Get data in Spotify
    $.ajax({
        url: 'https://api.spotify.com/v1/search',
        data: {
            q: searchQuery,
            type: 'album'
        },
        success: populateresults
    });
}

// While typing anything in the search field
$(input).keyup(function() {
    // Immediately search for albums by using the keyword
    searchAlbums();
});
