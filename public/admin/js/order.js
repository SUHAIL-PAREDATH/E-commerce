function cancelOrder(id){

    Swal.fire({
        icon: 'question',
        title:"<h5 style=color='white'>"+ `Proceed to cancel order?`+"</h5>",
        showCancelButton: true,
        background:'#19191a',
          iconColor:'blue',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            
            $.ajax({
                url:"/orders/"+id,
                method:"patch",
                success:(res)=>{
                    if(res.success=== "cancelled"){
                        $("#orderDetails").load(location.href + " #orderDetails");
                        location.reload()
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
                }
            })
            
    
        }
    })
   
}
function printInvoice(divName) {
    var printContents = document.getElementById(divName).innerHTML;
    var originalContents = document.body.innerHTML;

    document.body.innerHTML = printContents;

    // Add a style to limit the height of the printed content
    var style = document.createElement('style');
    style.innerHTML = `
        @media print {
            body {
                height: auto;
            }
            ${divName} {
                height: auto;
                max-height: 100%; /* You can adjust this value as needed */
            }
        }
    `;
    document.head.appendChild(style);

    window.print();

    // Remove the added style
    document.head.removeChild(style);

    document.body.innerHTML = originalContents;
}


  function returnOrder(id){

    Swal.fire({
        icon: 'question',
        title:"<h5 style=color='white'>"+ `Proceed to return order?`+"</h5>",
        showCancelButton: true,
        background:'#19191a',
          iconColor:'blue',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes'
    }).then((result) => {
        if (result.value) {
            
            $.ajax({
                url:"/orders/"+id,
                method:"put",
                success:(res)=>{
                    if(res.success=== "return"){
                        $("#orderDetails").load(location.href + " #orderDetails");
                        location.reload()
                        Swal.fire({
                            toast: true,
                            icon: "success",
                            position: "top-right",
                            showConfirmButton: false,
                            timer: 1500,
                            timerProgressBar: true,
                            animation: true,
                            title: "Order Return Requested",
                          });
                    }else if(res.success=== "expired"){
                        Swal.fire({
                            icon: "error",
                            showConfirmButton: false,
                            background:'#19191a',
                            timer: 1500,
                            timerProgressBar: true,
                            animation: true,
                            title: "Cancellation period expired",
                          }); 
                    }
                }
            })
            
    
        }
    })
}
   


