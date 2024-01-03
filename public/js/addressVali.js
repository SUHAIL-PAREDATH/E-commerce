function build() {
    const input = $('#buildNo').val();
    if (input.match(/^[a-zA-Z0-9\s.,#()-]{2,10}$/)) {
      $('#submitBtn').prop("disabled",false)
       $('#buldmssg').empty();
    } else {
        $("#buldmssg").html('<i class="fa fa-exclamation"></i>Add Building Name/No.');
        $('#submitBtn').prop("disabled",true)
    }
}

function addresscheck(){
  const input = $('#address').val();
    if (input.match(/^[a-zA-Z0-9\s.,#()-]{5,25}$/)) {
      $('#submitBtn').prop("disabled",false)
       $('#addressmssg').empty();
    } else {
        $("#addressmssg").html('<i class="fa fa-exclamation"></i>Add address');
        $('#submitBtn').prop("disabled",true)
    }
}
function pincodeCheck(){
  const input = $('#pincode').val();
    if (input.match(/^[0-9\s.,#()-]{6,6}$/)) {
      $('#submitBtn').prop("disabled",false)
       $('#pincodemssg').empty();
    } else {
        $("#pincodemssg").html('<i class="fa fa-exclamation"></i>Invalid');
        $('#submitBtn').prop("disabled",true)
    }
}

function countryCheck(){
  const input = $('#country').val();
    if (input.match(/^[a-zA-Z\s.,#()-]{3,20}$/) && !/\d/.test(input)) {
      $('#submitBtn').prop("disabled",false)
       $('#countrymssg').empty();
    } else {
        $("#countrymssg").html('<i class="fa fa-exclamation"></i>Invalid');
        $('#submitBtn').prop("disabled",true)
    }
}
function numberCheck(){
  const input = $('#number').val();
    if (input.match(/^\d{10}$/)) {
      $('#submitBtn').prop("disabled",false)
       $('#numbermssg').empty();
    } else {
        $("#numbermssg").html('<i class="fa fa-exclamation"></i>Invalid contact Number');
        $('#submitBtn').prop("disabled",true)
    }
}