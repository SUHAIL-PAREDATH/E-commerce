// function removeFromCart(productID) {
//   console.log(productID)
//   $.ajax({
//       url:`/cart?id=${productID}`,
//       method:"delete",
//       success: (res) => {
//           if (res.success === "removed") {
//             $("#cart").load(location.href + " #cart");
//             Swal.fire({
//               toast: true,
//               icon: "error",
//               position: "top-right",
//               showConfirmButton: false,
//               timer: 1000,
//               timerProgressBar: true,
//               animation: true,
//               title: "Removed from cart",
//             });
//           }
//         },
//   })
// }

// function changeCount(productID, i,count) {
//     let proQty= $(`#cartCount${i}`).html();
//     console.log(proQty);
//     console.log(count);
//     if(proQty==1 && count === -1){
  
//       Swal.fire({
//         icon: 'warning',
//         title:"<h5 style=color='white'>"+ `Item will be Deleted from you cart`+"</h5>",
//         showCancelButton: true,
//         background:'#19191a',
//         iconColor:'blue',
//         confirmButtonColor: '#3085d6',
//         cancelButtonColor: '#d33',
//         confirmButtonText: 'Yes'
//     }).then(result=>{
//       if(result.value){
//         $.ajax({
//           url: "/cart",
//           method: "put",
//           data: { id: productID,count:count },
//           success: (res) => {
//             if(res.data.currentProduct.quantity===0){
//                  $("#cart").load(location.href + " #cart");
//             }else{
//              $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
//             $(`#totalItems`).html(res.data.userCart.totalQuantity);
//             $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
//             }
            
            
//           },
//         });
//       }
//     })
  
//     }else{   
//       $.ajax({
//         url: "/cart",
//         method: "put",
//         data: { id: productID,count:count },
//         success: (res) => {
//           if(res.data.currentProduct.quantity===0){
//                $("#cart").load(location.href + " #cart");
//           }else{
//            $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
//           $(`#totalItems`).html(res.data.userCart.totalQuantity);
//           $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
//           }
          
          
//         },
//       });}
//     }
  
//   function reduceCount(productID, i,count) {
      
//       $.ajax({
//         url: "/cart/count",
//         method: "delete",
//         data: { id: productID },
//         success: (res) => {
          
//           $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
//           $(`#totalItems`).html(res.data.userCart.totalQuantity);
//           $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
//         },
//       });
//     }

// ==============================check out page =============
    function checkOut(){
      const stock= $('#stockCheck').val()
       if(stock==0){
         Swal.fire({  
           icon: "error",     
           showConfirmButton: false,
           timer: 2000,
           timerProgressBar: true,
           animation: true,
           title: "Cart Item is out of stockk",
         })
     
       }else{
         window.location= "/cart/checkout"
       }
     }
// ===========================================================
function removeFromCart(event, productID) {
  event.preventDefault();
  console.log(productID);
  $.ajax({
    url: `/cart?id=${productID}`,
    method: "delete",
    success: (res) => {
      if (res.success === "removed") {
        $("#cart").load(location.href + " #cart");
        Swal.fire({
          toast: true,
          icon: "error",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Removed from cart",
          customClass: "custom-swal-class", // Add this line
        });
      }
    },
  });
}

// =======================================================

function changeCount(productID, i, count) {
  let proQty = $(`#cartCount${i}`).html();
  console.log(proQty);
  console.log(count);
  if (proQty == 1 && count === -1) {
    Swal.fire({
      icon: 'warning',
      title: "<h5 style=color='white'>" + `Item will be Deleted from your cart` + "</h5>",
      showCancelButton: true,
      background: '#19191a',
      iconColor: 'blue',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes'
    }).then(result => {
      if (result.value) {
        $.ajax({
          url: "/cart",
          method: "put",
          data: { id: productID, count: count },
          success: (res) => {
            if (res.data.currentProduct.quantity === 0) {
              $("#cart").load(location.href + " #cart");
            } else {
              $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
              $(`#totalItems`).html(res.data.userCart.totalQuantity);
              $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
            }
          },
        });
      }
    })

    // Prevent form submission
    event.preventDefault();
  } else {
    $.ajax({
      url: "/cart",
      method: "put",
      data: { id: productID, count: count },
      success: (res) => {
        if (res.data.currentProduct.quantity === 0) {
          $("#cart").load(location.href + " #cart");
        } else {
          $(`#cartCount${i}`).html(res.data.currentProduct.quantity);
          $(`#totalItems`).html(res.data.userCart.totalQuantity);
          $(`#totalPrice`).html("₹ " + res.data.userCart.totalPrice);
        }
      },
    });

    // Prevent form submission
    event.preventDefault();
  }
}
