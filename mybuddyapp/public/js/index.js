var timeoutHolder;
var searchBar = $("#locationSearch");
searchBar.on("input", function(){
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
});
