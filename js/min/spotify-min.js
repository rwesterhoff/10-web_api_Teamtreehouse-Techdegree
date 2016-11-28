function showResults(){var e;checkSortButtons(sortBy),0===albums.length?imageGallery.html("<p>We have no search results for <strong>"+searchQuery+"</strong></p>"):($.each(albums,function(t,a){var s=a.id,r=a.name,l=a.thumb,o=a.release_date;e+='<li class="gallery-item">',e+='<a href="">',e+='<img id="'+s+'" src="'+l+'" alt="'+r+'">',e+="</a>",e+="<h2>"+r+"</h2>",e+='<p class="meta">',e+='<time datetime="'+o+'">'+o+"</time>",e+="</p>",e+="</li>"}),imageGallery.html(e))}function stripResults(e){var t=e.albums.items;$.each(t,function(e,t){var a={};a.id=t.id,a.name=t.name,a.thumb=t.images[1].url,$.ajax({url:"https://api.spotify.com/v1/albums/"+t.id,success:function(e){a.release_date=e.release_date},complete:showResults}),albums.push(a)})}function searchAlbums(){searchQuery=input.val(),albums=[],$.ajax({url:"https://api.spotify.com/v1/search",data:{q:searchQuery,type:"album"},success:stripResults})}function checkSortButtons(e){sortBy=e,"name"===sortBy?sortResults(albums,sortByName):sortResults(albums,sortByDate)}function sortByDate(e){e.sort(function(e,t){var a=e.release_date,s=t.release_date;return a<s?-1:a>s?1:0}),console.log("Sorted by date:"),console.log(e)}function sortByName(e){e.sort(function(e,t){var a=e.name,s=t.name;return a<s?-1:a>s?1:0}),console.log("Sorted by name:"),console.log(e)}function sortResults(e,t){t(e)}var input=$("#query"),searchQuery,imageGallery=$("#image-gallery"),sortBy="name",albums;$(input).keyup(searchAlbums),$('input[type="radio"').change(function(){var e=this.id;$("label").attr("data-state","deselected"),$('label[for="'+e+'"]').attr("data-state","selected"),checkSortButtons(e)});