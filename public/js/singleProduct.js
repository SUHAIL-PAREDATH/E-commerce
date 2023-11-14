
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
        }else if(res.success === "outofstock" ){
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
        }else if(res.success === "exceedsStock" ){
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

function reviewAdd(productId) {
  Swal.fire({
    showCloseButton: true,
    showConfirmButton: true,
    background: 'white' ,
    html: `<form id="reviewForm" >
<div class="mb-3">
  <label for="review" class="form-label">Post a review</label>
  <input name="review" class="form-control" id="review" pattern="^[a-zA-Z0-9\s\.,!?']{10,100}$" required title="Please enter a valid review" >
</div>

<div class="mb-3">
  <div class="review-star">
    <input type="checkbox" name="rating" id="st1" value="5" />
    <label for="st1"></label>
    <input type="checkbox" name="rating" id="st2" value="4" />
    <label for="st2"></label>
    <input type="checkbox" name="rating" id="st3" value="3" />
    <label for="st3"></label>
    <input type="checkbox" name="rating" id="st4" value="2" />
    <label for="st4"></label>
    <input type="checkbox" name="rating" id="st5" value="1" />
    <label for="st5"></label>
  </div>
</div>
</form>`,
  }).then((result) => {
    if (result.isConfirmed) {
      $.ajax({
        url: `/reviews?productID=${productId}`,
        method: "post",
        data: $("#reviewForm").serialize(),
        success: (res) => {
          $("section").load(location.href + " section");
          $("#addReview").hide();
        },
      });
    }
  });
}

function helpful(id) {
  $.ajax({
    url: "/reviews",
    method: "patch",
    data: {
      reviewID: id,
    },
    success: (res) => {
      if (res.success == 1) {
        $("#helpful" + id).load(location.href + " #helpful" + id);
      } else {
        window.location.replace("/login");
      }
    },
  });
}