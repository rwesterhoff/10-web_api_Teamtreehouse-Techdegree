function showDetails(a){var e=a;$.ajax({url:"https://api.spotify.com/v1/albums/"+e,success:function(a){var e=a.artists[0].name,i=a.name,s=a.images[0].url,t=a.release_date,l=a.tracks.items,n="",c="#js-image-overlay",o="#js-close-overlay",u=function(){n+='<div id="js-image-overlay">',n+='<div id="js-overlay-wrapper">',n+='<button id="js-close-overlay" class="close-overlay">Close overlay</button>',n+='<img src="'+s+'" alt="" class="album-artwork">',n+='<section id="js-data-wrapper">',n+="<h1>"+i+"</h1>",n+='<p><span class="visually-hidden">Artist: </span>'+e+"</p>",n+='<p class="meta">Released on ',n+='<time datetime="'+t+'">'+t+"</time>",n+="</p>",n+='<ul class="play-list">',$.each(l,function(a,e){var i=e.name;n+='<li class="album-track">'+i+"</li>"}),n+="</ul>",n+="</section>",n+="</div>",n+="</div>",$("body").prepend(n),$(c).hide(),$(c).fadeIn(400)},r=function(){$(o).click(function(){m()}),$(document).keyup(function(a){27===a.keyCode&&m()})},m=function(){function a(){$(c).remove()}$(c).fadeOut(400),setTimeout(a,400),$(document).off("keydown")};u(),r()}})}function searchAlbums(){var a=$input.val();$.ajax({url:"https://api.spotify.com/v1/search",data:{q:a,type:"album"},success:function(a){var e=$("#image-gallery"),i=a.albums.items,s="",t=function(){$("a").click(function(a){a.preventDefault();var e=$(this).find("img").attr("id");showDetails(e)})};$.each(i,function(a,e){var i=e.id,t=e.name,l=e.images[1].url;s+='<li class="gallery-item">',s+='<a href="">',s+='<img id="'+i+'" src="'+l+'" alt="'+t+'">',s+="</a>",s+="</li>"}),e.html(s),t()}})}var $input=$("#query");$($input).keyup(function(){searchAlbums()});