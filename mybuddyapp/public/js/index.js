var timeoutHolder;
var searchBtn = $("#searchBtn");
var searchBar = $("#locationSearch");
var checkLocation = function(){
  clearTimeout(timeoutHolder);
  $.ajax({
    url:"/geocoder",
    data:{
      location : searchBar.val()
    }
  }).done(function(data){
      var addr = data.address;
    searchBar.val(addr);
  }).fail(function(){$("#locationSearchParent").addClass("has-error,")});
  return false;
};
searchBtn.on("click", checkLocation);
searchBar.blur(checkLocation);
