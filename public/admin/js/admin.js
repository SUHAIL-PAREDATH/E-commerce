// ============================= BANNER  ===========================

// banners making api call for delete and changeActivity for Banner
//Change Activity
function changeActivity(id, active){
  $.ajax({
    url:'/admin/banner',
    type: 'patch',
    data: {bannerID: id, currentActivity : active,},
    success : (res)=>{
      $("#" + id).load(location.href + " #" + id);
      $("." +id).load(location.href + " ."+id )
    },
  });
}

// delte Banner
function deleteBanner(id){
  $.ajax({
    url:'/admin/banner',
    type:'delete',
    data : {bannerID : id},
    success: (res)=> {
      $("#" + id).load(location.href + " #" + id);
    },

  });
}

// =========================Orders details in admin side=================

//orders
function deliverOrder(id, i) {
  $.ajax({
    url: "/admin/orders",
    type: "patch",
    data: {
      orderID: id,
    },
    success: (res) => {
      if (res.data.delivered === 1) {
        $("#deliver" + i).load(location.href + " #deliver" + i);
      }
    },
  });
}

function returnOrder(id,i){
  $.ajax({
    url:"/admin/orders",
    type:"put",
    data:{
      orderID:id,
    },
    success:(res)=>{
      if(res.data.returned===1){
        $("#deliver" + i).load(location.href + " #deliver" + i);
      }
    }
  })
}

function printInvoice(divName) {
  var printContents = document.getElementById(divName).innerHTML;
  var originalContents = document.body.innerHTML;

  document.body.innerHTML = printContents;

  window.print();

  document.body.innerHTML = originalContents;
}

// cancel order api call
function cancelOrder(orderId){
  console.log("Reached");
  $.ajax({
    url : '/admin/orders/cancel/' + orderId,
    method : "patch",
    success : (res) => {
      if(res.success.message === 'cancelled'){
        $("#orderDetails").load(location.href + " #orderDetails");
        Swal.fire({
          toast: true,
          icon: "success",
          position: "top-right",
          showConfirmButton: false,
          timer: 1000,
          timerProgressBar: true,
          animation: true,
          title: "Order cancelled",
        });
      }
    },
  });
}