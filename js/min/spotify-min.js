function showResults(){var e;console.log("albums:"),console.log(albums),0===albums.length?imageGallery.html("<p>We have no search results for <strong>"+searchQuery+"</strong></p>"):($.each(albums,function(a,s){var l=s.id,t=s.name,u=s.thumb,r=s.release_date;e+='<li class="gallery-item">',e+='<a href="">',e+='<img id="'+l+'" src="'+u+'" alt="'+t+'">',e+="</a>",e+="<h2>"+t+"</h2>",e+='<p class="meta">',e+='<time datetime="'+r+'">'+r+"</time>",e+="</p>",e+="</li>"}),imageGallery.html(e))}function stripResults(e){var a=e.albums.items;$.each(a,function(e,a){var s={};s.id=a.id,s.name=a.name,s.thumb=a.images[1].url,$.ajax({url:"https://api.spotify.com/v1/albums/"+a.id,success:function(e){s.release_date=e.release_date},complete:showResults}),console.log(s),albums.push(s)})}function searchAlbums(){searchQuery=input.val(),albums=[],$.ajax({url:"https://api.spotify.com/v1/search",data:{q:searchQuery,type:"album"},success:stripResults})}var input=$("#query"),searchQuery,imageGallery=$("#image-gallery"),albums;$(input).keyup(searchAlbums);