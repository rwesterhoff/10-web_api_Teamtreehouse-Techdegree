function getItunesLink(e){$.ajax({url:"https://itunes.apple.com/search/?term="+e,type:"GET",dataType:"jsonp",success:function(e){var t=e.results[0].collectionViewUrl,a="";a+='<a id="itunes-button" href="'+t+'" class="cta-button">',a+='<img src="assets/itunes-badge.svg" alt="Get it oniTunes">',a+="</a>",$("#play-list").append(a)}})}function setItunesData(e,t){var a=(e+"+"+t).replace(/ /g,"+").toLowerCase();getItunesLink(a)}function checkIndex(e,t,a){for(var s=0,n=e.length;s<n;s++)if(e[s][a]===t)return s}function hideOverlay(){var e=function(){$(overlay).remove()};$(overlay).fadeOut(400),setTimeout(e,400),$(document).off("keyup")}function prepareCloseEvent(){var e="#js-close-overlay";$(e).click(function(){hideOverlay()}),$(document).keyup(function(e){27===e.keyCode&&hideOverlay()}),window.onclick=function(e){var t=e.target.id;"js-image-overlay"===t&&hideOverlay()}}function injectDetails(e,t,a){var s=e.artists[0].name,n=e.name,r=e.images[0].url,i=e.release_date,l=e.tracks.items;a+='<button id="js-close-overlay" class="close-overlay">Close overlay</button>',a+='<img src="'+r+'" alt="" class="album-artwork">',a+='<section id="js-data-wrapper">',a+="<h1>"+n+"</h1>",a+="<p>By "+s+"</p>",a+='<p class="meta">Released on ',a+='<time datetime="'+i+'">'+i+"</time>",a+="</p>",a+='<ul id="play-list">',$.each(l,function(e,t){var s=t.name;a+='<li class="album-track">'+s+"</li>"}),a+="</ul>",a+="</section>",$(t).html(a),prepareCloseEvent(),setItunesData(s,n)}function getDetails(e){var t="",a=albums[e].id,s="#js-overlay-wrapper";$.ajax({url:"https://api.spotify.com/v1/albums/"+a,success:function(e){var a=e;injectDetails(a,s,t)}})}function activateArrows(){var e="#previous-result",t="#next-result";$(e).click(function(){0===albumIndex?albumIndex=albums.length-1:albumIndex-=1,getDetails(albumIndex)}),$(t).click(function(){albumIndex===albums.length-1?albumIndex=0:albumIndex+=1,getDetails(albumIndex)})}function printOverlay(e,t){t+='<div id="js-image-overlay">',t+='<div id="js-overlay-wrapper">',t+="</div>",t+='<button id="previous-result" class="carousel-control left-control">Previous result</button>',t+='<button id="next-result" class="carousel-control right-control">Next result</button>',t+="</div>",$("body").prepend(t),$(e).hide(),$(e).fadeIn(400),activateArrows()}function showLoader(e,t){t+='<svg id="loader-circular" class="circular" viewBox="25 25 50 50">',t+='<circle class="path" cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />',t+="</svg>",$(e).prepend(t),$(e).hide(),$(e).fadeIn(400)}function hideLoader(){var e=$("#loader-circular"),t=function(){$(e).remove()};$(e).fadeOut(400),setTimeout(t,400)}function setButtons(e){var t=e;$("label").attr("data-state","deselected"),$('label[for="'+t+'"]').attr("data-state","selected")}function sortByDate(e){e.sort(function(e,t){var a=e.release_date,s=t.release_date;return a<s?-1:a>s?1:0})}function sortByName(e){e.sort(function(e,t){var a=e.name,s=t.name;return a<s?-1:a>s?1:0})}function sortResults(e,t){t(e)}function checkSortButtons(){"name"===sortBy?sortResults(albums,sortByName):sortResults(albums,sortByDate)}function activateThumbnails(){var e="";$("a").click(function(t){var a=$(this).find("img").attr("id");albumIndex=checkIndex(albums,a,"id"),t.preventDefault(),printOverlay(overlay,e),getDetails(albumIndex)})}function printResults(e,t,a){$.each(e,function(e,a){var s=a.id,n=a.name,r=a.thumb,i=a.release_date;t+='<li class="gallery-item">',t+='<a href="">',t+='<img id="'+s+'" src="'+r+'" alt="'+n+'">',t+="</a>",t+="<h2>"+n+"</h2>",t+='<p class="meta">',t+='<time datetime="'+i+'">'+i+"</time>",t+="</p>",t+="</li>"}),a.html(t)}function showResults(){var e="";checkSortButtons(),printResults(albums,e,imageGallery),activateThumbnails()}function changeSortButtons(){var e=this.id;sortBy=e,setButtons(e),checkSortButtons(),showResults()}function printMessage(e,t){e.html("<p>We have no search results for <strong>"+t+"</strong></p>")}function getDate(e,t,a){$.ajax({url:"https://api.spotify.com/v1/albums/"+a,type:"GET",dataType:"json",success:function(e){t.release_date=e.release_date},complete:function(){e.push(t),showResults()}})}function stripResults(e){albums=[];var t=e.albums.items;$.each(t,function(e,t){var a={};a.id=t.id,a.name=t.name,a.thumb=t.images[1].url,getDate(albums,a,t.id)})}function searchAlbums(){var e=$("#search-loader"),t="",a=input.val();""!==a&&(e.children().length<1&&showLoader(e,t),$.ajax({url:"https://api.spotify.com/v1/search",data:{q:a,type:"album"},success:function(e){var t=e.albums.items.length;0===t?printMessage(imageGallery,a):stripResults(e)},complete:hideLoader}))}var input=$("#query"),imageGallery=$("#image-gallery"),sortBy=$('input[type="radio"]:checked')[0].id,albums=[],albumIndex,overlay="#js-image-overlay";!function e(){setButtons(sortBy)}(),$('input[type="radio"]').change(changeSortButtons),$(input).keyup(searchAlbums),$(document).keypress(function(e){13===e.which&&e.preventDefault()});