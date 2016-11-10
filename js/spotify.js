/* --------------------------------------------------------------------------- *\
    VARIABLES
\* --------------------------------------------------------------------------- */

var $input = $('#query');


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
                resultHTML = '';

            $.each(albums, function(i, album) {
                var albumName = album.name,
                    albumImgUrl = album.images[0].url,
                    albumThumbUrl = album.images[1].url;
                // Add each album HTML to the result list
                resultHTML += '<li class="gallery-item">';
                resultHTML += '<a href="' + albumImgUrl + '">';
                resultHTML += '<img src="' + albumThumbUrl + '" alt="' + albumName + '">';
                resultHTML += '</a>';
                resultHTML += '</li>';
            });
            // Inject the HTML into the result list
            imageGallery.html(resultHTML);
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

//On click of thumbnail
$("a").click(function(event) {
    event.preventDefault();
});

// If a thumbnail is clicked
// A lightbox shows up
// the bigger image is loaded
// and extra data
