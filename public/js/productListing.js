function filter(filterBy, brandId, listingName){
    $.ajax({
      url:'/products',
      type:'patch',
      data : {
        filterBy : filterBy,
        brandId : brandId,
        listingName : listingName,
      },
      success : (res) => {
        console.log(res.success)
        if(res.success == "clear"){
          $('#productContainer').load(location.href + ' #productContainer');
          $("#searchInput").val("");

        }else{
          $('#productContainer').load(location.href + ' #productContainer'); 
        //   location.reload(); 
       }
        if(res.success == 0){
          $('#searchInput').val('');
        }
      }
    });
  }

  function removeFilter(filterBy){
    $.ajax({
      url : '/products',
      type : 'patch',
      data : {
        filterBy : filterBy,
      },
      success : (res) => {
        $('#productContainer').load(location.href + ' #productContainer');
        $('#searchInput').load(location.href + ' #searchInput');
        // location.reload();
        
      }
    })
  }
  function sortBy(order) {
    $.ajax({
      url: "/products",
      method: "post",
      data: { sortBy: order },
      success: (res) => {
        if (res.sorted == '1') {    
          // Swal.fire({
          //   toast: true,
          //   icon: "success",
          //   position: "top-right",
          //   showConfirmButton: false,
          //   timer: 1000,
          //   animation: true,
          //   title: "Sorted",
          // });
          $("#productContainer").load(location.href + " #productContainer");
        }
      },
    });
  }

  function search(){
    var searchInput=$("#searchInput").val();
    if (searchInput) {
        $("#searchButton").html(
          `<button class="btn btn-sm" onclick="filter('none')" >Remove Filter</button>`
        );
      }
      $.ajax({
        url: "/products",
        method: "put",
        data: { searchInput: searchInput },
        success: (res) => {
          console.log("fgfg"+res);
          $("#productContainer").load(location.href + " #productContainer");
        },
      });
}