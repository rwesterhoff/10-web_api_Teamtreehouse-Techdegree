<<<<<<< HEAD
function getItunesLink(e){$.ajax({url:"https://itunes.apple.com/search/?term="+e,dataType:"jsonp",success:function(e){var t=e.results[0].collectionViewUrl,a="";a+='<a id="itunes-button" href="'+t+'" class="cta-button">',a+='<img src="assets/itunes-badge.svg" alt="Get it oniTunes">',a+="</a>",console.log("retrievedAlbumLink: "),console.log(t),$("#play-list").append(a)}})}function setItunesData(e,t){var a=(e+"+"+t).replace(/ /g,"+").toLowerCase();console.log(a),getItunesLink(a)}function checkIndex(e,t,a){for(var s=0,r=e.length;s<r;s++)if(e[s][a]===t)return s}function activateArrows(){var e="#previous-result",t="#next-result";$(e).click(function(){0===albumIndex?albumIndex=albums.length-1:albumIndex-=1,getDetails(albumIndex)}),$(t).click(function(){albumIndex===albums.length-1?albumIndex=0:albumIndex+=1,getDetails(albumIndex)})}function hideOverlay(){var e=function(){$(overlay).remove()};$(overlay).fadeOut(400),setTimeout(e,400),$(document).off("keydown")}function prepareCloseEvent(){$(closeButton).click(function(){hideOverlay()}),$(document).keyup(function(e){27===e.keyCode&&hideOverlay()}),window.onclick=function(e){var t=e.target.id;"js-image-overlay"===t&&hideOverlay()}}function injectDetails(e,t,a){var s=e.artists[0].name,r=e.name,n=e.images[0].url,l=e.release_date,o=e.tracks.items;a+='<button id="js-close-overlay" class="close-overlay">Close overlay</button>',a+='<img src="'+n+'" alt="" class="album-artwork">',a+='<section id="js-data-wrapper">',a+="<h1>"+r+"</h1>",a+="<p>By "+s+"</p>",a+='<p class="meta">Released on ',a+='<time datetime="'+l+'">'+l+"</time>",a+="</p>",a+='<ul id="play-list">',$.each(o,function(e,t){var s=t.name;a+='<li class="album-track">'+s+"</li>"}),a+="</ul>",a+="</section>",$(t).html(a),prepareCloseEvent(),setItunesData(s,r)}function getDetails(e){var t=albums[e].id;$.ajax({url:"https://api.spotify.com/v1/albums/"+t,success:function(e){var t=e;injectDetails(t,overlayWrapper,albumHTML)}})}function printOverlay(e,t){t+='<div id="js-image-overlay">',t+='<div id="js-overlay-wrapper">',t+="</div>",t+='<button id="previous-result" class="carousel-control left-control">Previous result</button>',t+='<button id="next-result" class="carousel-control right-control">Next result</button>',t+="</div>",$("body").prepend(t),$(e).hide(),$(e).fadeIn(400),activateArrows()}function showLoader(e,t){t+='<svg id="loader-circular" class="circular" viewBox="25 25 50 50">',t+='<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />',t+="</svg>",$(e).prepend(t),$(e).hide(),$(e).fadeIn(400)}function hideLoader(){var e=$("#loader-circular"),t=function(){$(e).remove()};$(e).fadeOut(400),setTimeout(t,400)}function setButtons(e){var t=e;$("label").attr("data-state","deselected"),$('label[for="'+t+'"]').attr("data-state","selected")}function sortByDate(e){e.sort(function(e,t){var a=e.release_date,s=t.release_date;return a<s?-1:a>s?1:0})}function sortByName(e){e.sort(function(e,t){var a=e.name,s=t.name;return a<s?-1:a>s?1:0})}function sortResults(e,t){t(e)}function checkSortButtons(){"name"===sortBy?sortResults(albums,sortByName):sortResults(albums,sortByDate)}function changeSortButtons(){var e=this.id;sortBy=e,setButtons(e),checkSortButtons(),showResults()}function activateThumbnails(){$("a").click(function(e){var t=$(this).find("img").attr("id");albumIndex=checkIndex(albums,t,"id"),e.preventDefault(),printOverlay(overlay,overlayHTML),getDetails(albumIndex)})}function printResults(e,t){0===albums.length?t.html("<p>We have no search results for <strong>"+searchQuery+"</strong></p>"):($.each(albums,function(t,a){var s=a.id,r=a.name,n=a.thumb,l=a.release_date;e+='<li class="gallery-item">',e+='<a href="">',e+='<img id="'+s+'" src="'+n+'" alt="'+r+'">',e+="</a>",e+="<h2>"+r+"</h2>",e+='<p class="meta">',e+='<time datetime="'+l+'">'+l+"</time>",e+="</p>",e+="</li>"}),t.html(e))}function showResults(){var e="";checkSortButtons(),printResults(e,imageGallery),activateThumbnails()}function stripResults(e){var t=e.albums.items;$.each(t,function(e,t){var a={};a.id=t.id,a.name=t.name,a.thumb=t.images[1].url,$.ajax({url:"https://api.spotify.com/v1/albums/"+t.id,success:function(e){a.release_date=e.release_date}}),albums.push(a)}),showResults()}function searchAlbums(){var e=$("#search-loader"),t="";searchQuery=input.val(),albums=[],""!==searchQuery&&($.ajax({url:"https://api.spotify.com/v1/search",data:{q:searchQuery,type:"album"},success:stripResults,error:hideLoader,complete:hideLoader}),e.children().length<1&&showLoader(e,t))}var input=$("#query"),searchQuery="",imageGallery=$("#image-gallery"),sortBy=$('input[type="radio"]:checked')[0].id,albums=[],overlayHTML="",albumHTML="",albumIndex,overlay="#js-image-overlay",overlayWrapper="#js-overlay-wrapper",closeButton="#js-close-overlay";!function e(){setButtons(sortBy)}(),$('input[type="radio"').change(changeSortButtons),$(input).keyup(searchAlbums);
=======
function getItunesLink(e,t){$.ajax({url:"https://itunes.apple.com/search/?term="+e,type:"GET",dataType:"jsonp",success:function(e){var a=e.results[0].collectionViewUrl;console.log("retrievedAlbumLink: "),console.log(a),$(t).attr("href",a),$(t).show()},error:function(){alert("error"),$(t).hide()}})}function setItunesData(e,t){var a=(e+"+"+t).replace(/ /g,"+").toLowerCase(),s="#itunes-button";getItunesLink(a,s)}function checkIndex(e,t,a){for(var s=0,r=e.length;s<r;s++)if(e[s][a]===t)return s}function activateArrows(){var e="#previous-result",t="#next-result";$(e).click(function(){0===albumIndex?albumIndex=albums.length-1:albumIndex-=1,getDetails(albumIndex)}),$(t).click(function(){albumIndex===albums.length-1?albumIndex=0:albumIndex+=1,getDetails(albumIndex)})}function hideOverlay(){var e=function(){$(overlay).remove()};$(overlay).fadeOut(400),setTimeout(e,400),$(document).off("keydown")}function prepareCloseEvent(){$(closeButton).click(function(){hideOverlay()}),$(document).keyup(function(e){27===e.keyCode&&hideOverlay()}),window.onclick=function(e){var t=e.target.id;"js-image-overlay"===t&&hideOverlay()}}function injectDetails(e,t,a){var s=e.artists[0].name,r=e.name,n=e.images[0].url,l=e.release_date,o=e.tracks.items;a+='<button id="js-close-overlay" class="close-overlay">Close overlay</button>',a+='<img src="'+n+'" alt="" class="album-artwork">',a+='<section id="js-data-wrapper">',a+="<h1>"+r+"</h1>",a+="<p>By "+s+"</p>",a+='<p class="meta">Released on ',a+='<time datetime="'+l+'">'+l+"</time>",a+="</p>",a+='<ul class="play-list">',$.each(o,function(e,t){var s=t.name;a+='<li class="album-track">'+s+"</li>"}),a+='<a id="itunes-button" href="" class="cta-button">',a+='<img src="assets/itunes-badge.svg" alt="Get it oniTunes">',a+="</a>",a+="</ul>",a+="</section>",$(t).html(a),activateArrows(),prepareCloseEvent(),setItunesData(s,r)}function getDetails(e){var t=albums[e].id;$.ajax({url:"https://api.spotify.com/v1/albums/"+t,success:function(e){var t=e;injectDetails(t,overlayWrapper,albumHTML)}})}function printOverlay(e,t){t+='<div id="js-image-overlay">',t+='<div id="js-overlay-wrapper">',t+="</div>",t+='<button id="previous-result" class="carousel-control left-control">Previous result</button>',t+='<button id="next-result" class="carousel-control right-control">Next result</button>',t+="</div>",$("body").prepend(t),$(e).hide(),$(e).fadeIn(400)}function showLoader(e,t){t+='<svg id="loader-circular" class="circular" viewBox="25 25 50 50">',t+='<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />',t+="</svg>",$(e).prepend(t),$(e).hide(),$(e).fadeIn(400)}function hideLoader(){var e=$("#loader-circular"),t=function(){$(e).remove()};$(e).fadeOut(400),setTimeout(t,400)}function setButtons(e){var t=e;$("label").attr("data-state","deselected"),$('label[for="'+t+'"]').attr("data-state","selected")}function sortByDate(e){e.sort(function(e,t){var a=e.release_date,s=t.release_date;return a<s?-1:a>s?1:0})}function sortByName(e){e.sort(function(e,t){var a=e.name,s=t.name;return a<s?-1:a>s?1:0})}function sortResults(e,t){t(e)}function checkSortButtons(){"name"===sortBy?sortResults(albums,sortByName):sortResults(albums,sortByDate)}function changeSortButtons(){var e=this.id;sortBy=e,setButtons(e),checkSortButtons(),showResults()}function activateThumbnails(){$("a").click(function(e){var t=$(this).find("img").attr("id");albumIndex=checkIndex(albums,t,"id"),e.preventDefault(),printOverlay(overlay,overlayHTML),getDetails(albumIndex)})}function printResults(e,t){0===albums.length?t.html("<p>We have no search results for <strong>"+searchQuery+"</strong></p>"):($.each(albums,function(t,a){var s=a.id,r=a.name,n=a.thumb,l=a.release_date;e+='<li class="gallery-item">',e+='<a href="">',e+='<img id="'+s+'" src="'+n+'" alt="'+r+'">',e+="</a>",e+="<h2>"+r+"</h2>",e+='<p class="meta">',e+='<time datetime="'+l+'">'+l+"</time>",e+="</p>",e+="</li>"}),t.html(e))}function showResults(){var e="";checkSortButtons(),printResults(e,imageGallery),activateThumbnails()}function stripResults(e){var t=e.albums.items;$.each(t,function(e,t){var a={};a.id=t.id,a.name=t.name,a.thumb=t.images[1].url,$.ajax({url:"https://api.spotify.com/v1/albums/"+t.id,success:function(e){a.release_date=e.release_date},complete:showResults}),albums.push(a)})}function searchAlbums(){var e=$("#search-loader"),t="";searchQuery=input.val(),albums=[],""!==searchQuery&&($.ajax({url:"https://api.spotify.com/v1/search",data:{q:searchQuery,type:"album"},success:stripResults,error:hideLoader,complete:hideLoader}),e.children().length<1&&showLoader(e,t))}var input=$("#query"),searchQuery="",imageGallery=$("#image-gallery"),sortBy=$('input[type="radio"]:checked')[0].id,albums=[],overlayHTML="",albumHTML="",albumIndex,overlay="#js-image-overlay",overlayWrapper="#js-overlay-wrapper",closeButton="#js-close-overlay";!function e(){setButtons(sortBy)}(),$('input[type="radio"').change(changeSortButtons),$("#search").click(function(e){e.preventDefault(),searchAlbums()});
>>>>>>> parent of 9437e2c... Got rid of printResults error.
