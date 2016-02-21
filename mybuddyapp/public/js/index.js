var timeoutHolder;
var searchBtn = $("#searchBtn");
var searchBar = $("#locationSearch");
searchBtn.on("click", function(){
  clearTimeout(timeoutHolder);
    timeoutHolder = setTimeout(function(){
      $.ajax({
        url:"/geocoder",
        data:{
          location : searchBar.val()
        }
      }).done(function(data){
        console.log(data)
        var addr = data.address;
        searchBar.val(addr);
      }).fail(function(){$("#locationSearchParent").addClass("has-error,")});
    },1000);
    return false;
});
