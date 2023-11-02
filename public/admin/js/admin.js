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
        $("#deliver"+i).load(location.href+" deliver"+i);
      }
    }
  })
}