 function searchAlbums() {
     var $searchQuery = $('#query').val();

     // Get data 
     $.ajax({
         url: 'https://api.spotify.com/v1/search',
         data: {
             q: $searchQuery,
             type: 'album'
         }
     }).done(function(response) {
         alert('Success');
         console.log(response);
     }).fail(function() {
         alert('Failed');
     }).always(function() {
         console.log(query);
         alert('Complete');
     });
 };

 // If keyword is entered in the search field
 $('form').submit(function(e) {
     e.preventDefault();
     // Search for keyword
     searchAlbums();
     // Display results
     // If a thumbnail is clicked
     // A lightbox shows up
     // the bigger image is loaded
     // and extra data

 });
