 var $searchQuery = $('#query').val(),
     /*fetchTracks = function(albumId, callback) {
         $.ajax({
             url: 'https://api.spotify.com/v1/albums/' + albumId,
             success: function(response) {
                 callback(response);
             }
         });
     },*/

/*CHECK THIS
https://developer.spotify.com/web-api/object-model/#artist-object-full
*/


     displayResults = function(data) {
         var resultHTML,
             albums = data.albums;
         $.each(array, function(i, album) {
             resultHTML += '<li class="gallery-item">';
             resultHTML += '<a href="">';
             // resultHTML += '<img src="" alt=">';
             resultHTML += album.name;
             resultHTML += '</a>';
             resultHTML += '</li>';
         });
         $gallery.html(resultHTML);
     },
     searchAlbums = function(query) {
         $.ajax({
             url: 'https://api.spotify.com/v1/search',
             data: {
                 artists: {
                     name: query
                 },
                 album_type: 'album'
             }
         }).done(function(response) {
             alert('Success');
             displayResults();
         }).fail(function() {
             alert('Failed');
         }).always(function() {
             alert('Complete');
         });
     };



 $('form').submit(function(e) {
     e.preventDefault();

     // If keyword is entered in the search field
     searchAlbums($searchQuery);
     // Get data 
     // Display results
     // If a thumbnail is clicked
     // A lightbox shows up
     // the bigger image is loaded
     // and extra data

 });
