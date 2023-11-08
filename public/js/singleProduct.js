
function addToCart(productID){
    $.ajax({
      url: "/cart",
      method: "post",
      data: {
        id: productID,
      },
      success: (res) => {
       
        if (res.success == "countAdded") {
          Swal.fire({
            toast: true,
            icon: "success",
            position: "top-right",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            animation: true,
            title: "Count added in cart",
          });
          $("#cartCount").load(location.href + " #cartCount");
        } else if (res.success == "addedToCart") {
          Swal.fire({
            toast: true,
            icon: "success",
            position: "top-right",
            showConfirmButton: false,
            timer: 1000,
            timerProgressBar: true,
            animation: true,
            title: "Added to cart",
          });
          $("#cartCount").load(location.href + " #cartCount");
        }else if(res.success === "outofstcok" ){
          Swal.fire({
            toast: true,
            icon: "error",
            position: "top-right",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            animation: true,
            title: "Out Of Stock",
          });
        }
         else {
          window.location.href = "/login";
        }
      },
    });
  }

  //========================= adding product to wish list ===============================
function addToWishlist(productId) {
  let currentURL = window.location.href;
  $.ajax({
    url: "/wishlist",
    method: "patch",
    data: {
      id: productId,
      url: currentURL,
    },
    success: (res) => {
      if (res.data.message === 0) {
        $("#wishlistHeart").html('<i class="fa fa-heart text-dark">');
        Swal.fire({
          toast: true,
          icon: "error",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Removed from wishlist",
        });

        $("#wish-count").load(location.href + " #wish-count");
      } else if (res.data.message === 1) {
        $("#wishlistHeart").html('<i class="fa fa-heart text-danger">');
        Swal.fire({
          toast: true,
          icon: "success",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Added to wishlist",
        });
        $("#wish-count").load(location.href + " #wish-count");
        $("#wishlistHeart").html('<i class="fa fa-heart text-danger">');
        
      } else {
        window.location.href = "/login"
      }
    },
  });
}

function buyNow(productID) {
  $.ajax({
    url: "/cart",
    method: "post",
    data: {
      id: productID,
    },
    success: (res) => {
      if (res.success === "addedToCart" || res.success === "countAdded") {
        window.location.href = "/cart";
      }
      else if(res.success === "outofstcok" ){
        Swal.fire({
          toast: true,
          icon: "error",
          position: "top-right",
          showConfirmButton: false,
          timer: 1500,
          timerProgressBar: true,
          animation: true,
          title: "Out Of Stock",
        });
      }
       else {
        window.location.href = "/login";
      }
    },
  });
}