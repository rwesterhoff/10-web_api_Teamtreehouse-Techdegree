function searchAlbums(){var e=$("#query").val();$.ajax({url:"https://api.spotify.com/v1/search",data:{q:e,type:"album"},success:function(e){var a=$("#image-gallery"),l=e.albums.items,t="";$.each(l,function(e,a){var l=a.name,r=a.images[0].url,i=a.images[1].url;t+='<li class="gallery-item">',t+='<a href="'+r+'">',t+='<img src="'+i+'" alt="'+l+'">',t+="</a>",t+="</li>"}),a.html(t)}})}function showOverlay(e){}var $galleryItem=".gallery-item",$input=$("#query");$($input).keyup(function(){searchAlbums()}),$($galleryItem).click(function(e){$currentItemIndex=$($(this)).index(),e.preventDefault(),showOverlay($(this)),setIndex()});