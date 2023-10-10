
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