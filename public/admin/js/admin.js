// ============================= BANNER  ===========================

const orderCLTN = require("../../../models/users/order");

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