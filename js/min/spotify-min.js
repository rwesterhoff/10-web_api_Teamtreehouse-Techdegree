function showDetails(e){var t=e;$.ajax({url:"https://api.spotify.com/v1/albums/"+t,success:function(e){var t=e.artists[0].name,a=e.name,s=e.images[0].url,i=e.release_date,n=e.tracks.items,l="",o="#js-image-overlay",r="#js-close-overlay",c=function(){l+='<div id="js-image-overlay">',l+='<div id="js-overlay-wrapper">',l+='<button id="js-close-overlay" class="close-overlay">Close overlay</button>',l+='<img src="'+s+'" alt="" class="album-artwork">',l+='<section id="js-data-wrapper">',l+="<h1>"+a+"</h1>",l+='<p><span class="visually-hidden">Artist: </span>'+t+"</p>",l+='<p class="meta">Released on ',l+='<time datetime="'+i+'">'+i+"</time>",l+="</p>",l+='<ul class="play-list">',$.each(n,function(e,t){var a=t.name;l+='<li class="album-track">'+a+"</li>"}),l+='<li id="itunes-store">',l+='<a id="itunes-button" href="" class="cta-button">',l+='<img src="../assets/Get_it_on_iTunes_Badge_US_1114.svg" alt="Get it oniTunes">',l+="</a>",l+="</li>",l+="</ul>",l+="</section>",l+="</div>",l+="</div>",$("body").prepend(l),$(o).hide(),$(o).fadeIn(400),getItunesData(t,a)},u=function(){$(r).click(function(){m()}),$(document).keyup(function(e){27===e.keyCode&&m()}),window.onclick=function(e){var t=e.target.id;"js-image-overlay"===t&&m()}},m=function(){function e(){$(o).remove()}$(o).fadeOut(400),setTimeout(e,400),$(document).off("keydown")};c(),u()}})}function getItunesData(e,t){var a=(e+"+"+t).replace(/ /g,"+").toLowerCase(),s="#itunes-button",i=function(e){$.ajax({url:"https://itunes.apple.com/search/?term="+e,type:"GET",dataType:"jsonp",success:function(e){var t=e.results[0].collectionViewUrl;console.log(e),console.log("retrievedAlbumLink: "+t),console.log("collectionId: "+e.results[0].collectionId),$("#itunes-button").attr("href",t)},error:function(){alert('error on "getAlbumId"')}})};console.log(a),i(a)}function searchAlbums(){var e=$input.val();$.ajax({url:"https://api.spotify.com/v1/search",data:{q:e,type:"album"},success:function(t){var a=t.albums.items,s="",i=function(){0===a.length?imageGallery.html("<p>We have no search results for <strong>"+e+"</strong></p>"):($.each(a,function(e,t){var a=t.id,i=t.name,n=t.images[1].url;s+='<li class="gallery-item">',s+='<a href="">',s+='<img id="'+a+'" src="'+n+'" alt="'+i+'">',s+="</a>",s+="</li>"}),imageGallery.html(s))},n=function(){$("a").click(function(e){var t=$(this).find("img").attr("id");e.preventDefault(),showDetails(t)})};i(),n()}})}var $input=$("#query"),imageGallery=$("#image-gallery");$($input).keyup(function(){searchAlbums()});