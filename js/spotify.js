/* --------------------------------------------------------------------------- *\
    VARIABLES
\* --------------------------------------------------------------------------- */

var $input = $('#query');


/* --------------------------------------------------------------------------- *\
    SEARCH
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
                trackList = [];

            $.each(tracks, function(i, track) {
                var trackName = track.name;
                // Add each track track list
                trackList += trackName;
            });
            console.log( /*albumId, artistName, albumName, albumImgUrl, albumReleased, */ trackList);
        }
    });
}

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
                resultHTML = '';
            console.log(albums);

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
            // Inject the HTML into the result list
            imageGallery.html(resultHTML);
            //On click of thumbnail
            $("a").click(function(event) {
                event.preventDefault();
                var requestedAlbumId = $(this).find('img').attr('id');
                showDetails(requestedAlbumId);
            });
        }
    });
}

// While typing anything in the search field
$($input).keyup(function() {
    // Immediately search for albums by using the keyword
    searchAlbums();
});

/* --------------------------------------------------------------------------- *\
    GALLERY
\* --------------------------------------------------------------------------- */


// If a thumbnail is clicked
// A lightbox shows up
// the bigger image is loaded
// and extra data
