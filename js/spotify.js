/* --------------------------------------------------------------------------- *\
    GLOBAL VARIABLES
\* --------------------------------------------------------------------------- */


//Gallery
// var $selectedItem = '.selected';
// var $classSelected = 'selected';
var $galleryItem = '.gallery-item';
// var $gallery = '#image-gallery';
// var $totalItems = $('li').size();
// var $currentItemIndex;
// var $prevItemIndex;
// var $nextItemIndex;
// var $firstItemIndex = 0;
// var $lastItemIndex = $totalItems - 1;
// var $hoverTile;

//Links
// var $activeLink;
// var $activeCaption;

//Overlay
// var $overlay = '#js-image-overlay';
// var $carousel = '#js-carousel';
// var $slidesWrapper = "#js-carousel-slides";
// var $currentSlide = '.current-slide';

//Injected HTML (for building a fresh overlay each time an item is clicked)
// var $overlayHtml = '<div id="js-image-overlay"></div>';
// var $closeHtml = '<button id="js-close-overlay" class="close-overlay">Close overlay</button>';
// var $carouselHtml = '<div id="js-carousel" class="carousel"></div>';
// var $slidesWrapperHtml = '<div id="js-carousel-slides" class="carousel-slides">';
// var $slideHtml = '<div class="carousel-slide current-slide"></div>';
// var $imageHtml = '<img>';
// var $iframeHtml = '<div class="videoWrapper"><iframe frameborder="0"></iframe></div>';
// var $captionHtml = '<figcaption></figcaption>';
// var $prevButtonHtml = '<button id="previous-slide" class="carousel-control left-control">Previous</button>';
// var $nextButtonHtml = '<button id="next-slide" class="carousel-control right-control">Next</button>';

//Controls
// var $prevButton = '#previous-slide';
// var $nextButton = '#next-slide';
// var $closeButton = '#js-close-overlay';

//Transitions
// var $singleDuration = 200;
// var $doubleDuration = 400;


/* --------------------------------------------------------------------------- *\
    SEARCH
\* --------------------------------------------------------------------------- */

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
var $input = $('#query');

// While typing anything in the search field
$($input).keyup(function() {
    // Immediately search for albums by using the keyword
    searchAlbums();
});


/* --------------------------------------------------------------------------- *\
    OVERLAY
\* --------------------------------------------------------------------------- */

//Get and set all data for the carousel 
//based on the click event
function showOverlay(selectItem) {

    // function injectOverlay() {
    //     $('body').prepend($overlayHtml);
    //     $($overlay).hide();
    //     $($overlay).append($closeHtml + $carouselHtml);
    //     $($carousel).append($slidesWrapperHtml);
    //     $($slidesWrapper).append($slideHtml + $prevButtonHtml + $nextButtonHtml);
    // }

    // //Get data from selected item (getting stuff)
    // function getSlideData(selectItem) {
    //     $activeLink = selectItem.find('a').attr('href');
    //     $activeCaption = selectItem.find('img').attr('title');
    // }

    // //Control the entire thing
    // function carouselControl() {


    //     //Get new data en load slide
    //     function getNewSlide(selectItem) {

    //         function animateSlide() {
    //             $($currentSlide).fadeOut($singleDuration).fadeIn($singleDuration);
    //         }

    //         highlightSelected(selectItem);
    //         getSlideData(selectItem);
    //         animateSlide();
    //         setTimeout(loadCarouselSlide, $singleDuration);
    //         setIndex();
    //     }

    //     function setPrevSlide() {
    //         if ($currentItemIndex > $firstItemIndex) {
    //             showArrows();
    //             $currentItemIndex -= 1;
    //             getNewSlide($($selectedItem).prev());
    //         }
    //         if ($currentItemIndex === $firstItemIndex) {
    //             hidePrevArrow();
    //         }
    //     }

    //     function setNextSlide() {
    //         if ($currentItemIndex < $lastItemIndex) {
    //             showArrows();
    //             $currentItemIndex += 1;
    //             getNewSlide($($selectedItem).next());
    //         }
    //         if ($currentItemIndex === $lastItemIndex) {
    //             hideNextArrow();
    //         }
    //     }

    //     //Hiding the overlay
    //     function hideOverlay() {
    //         $($overlay).fadeOut($doubleDuration);

    //         function removeOverlay() {
    //             $($overlay).remove();
    //         }

    //         setTimeout(removeOverlay, $doubleDuration);
    //         $(document).off('keydown');

    //     }

    //     //On click left + right arrows
    //     $($prevButton).click(function() {
    //         setPrevSlide();
    //     });
    //     $($nextButton).click(function() {
    //         setNextSlide();
    //     });
    //     $($closeButton).click(function() {
    //         hideOverlay();
    //     });

    //     //On keypress
    //     $(document).on('keydown', function(event) {
    //         switch (event.which) {
    //             case 37: // Left arrow
    //                 setPrevSlide();
    //                 break;

    //             case 39: // Right arrow
    //                 setNextSlide();
    //                 break;

    //             case 27: // 'Esc'
    //                 hideOverlay();
    //                 break;

    //             default:
    //                 return; // exit this handler for other keys
    //         }
    //     });
    // }

    // injectOverlay();
    // highlightSelected(selectItem);
    // getSlideData(selectItem);
    // loadCarouselSlide();
    // $($overlay).fadeIn($doubleDuration);
    // carouselControl();
}


/* --------------------------------------------------------------------------- *\
    GALLERY
\* --------------------------------------------------------------------------- */

//On click of thumbnail
$($galleryItem).click(function(event) {

    //Define index of clicked item
    $currentItemIndex = $($(this)).index();
    event.preventDefault();

    showOverlay($(this));
    setIndex();
});


// If a thumbnail is clicked
// A lightbox shows up
// the bigger image is loaded
// and extra data
