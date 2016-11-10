// Search albums based on keyword
function searchAlbums() {
    var searchQuery = $('#query').val();

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

// If keyword is entered in the search field
$('form').submit(function(e) {
    e.preventDefault();
    // Search for keyword
    searchAlbums();
});


// If a thumbnail is clicked
// A lightbox shows up
// the bigger image is loaded
// and extra data
