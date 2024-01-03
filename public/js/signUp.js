

        function usernameValidator() {
            const inputName = $("#form-holder").val();
            const nameReg = /^[a-zA-Z]{3,}$/; // Username must have at least 3 letters
          
            if (nameReg.test(inputName)) {
              $("#submitButton").prop("disabled", false);
              $("#nameInvalid").empty();
            } else {
              $("#submitButton").prop("disabled", true);
              $("#nameInvalid").html(
                '<i class="fa fa-exclamation"></i>Invalid name. Name must have at least 3 letters and contain only letters.'
              );
            }
          };

          function mailValidator() {
            const inputMail = $("#inputMail").val();
            if (
              inputMail.match(
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
              )
            ) {
              $("#submitButton").prop("disabled", false);
              $("#mailInvalid").empty();
            } else {
              $("#submitButton").prop("disabled", true);
              $("#mailInvalid").html('<i class="fa fa-exclamation"></i>Invalid E-mail');
            }
          };


          function passwordValidator() {
            const inputPassword = $("#inputPassword").val();
            if (inputPassword.length >= 8) {
              if (inputPassword.match(/^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/)) {
                $("#submitButton").prop("disabled", false);
                $("#passwordInvalid").empty();
              } else {
                $("#submitButton").prop("disabled", true);
                $("#passwordInvalid").html(
                  '<i class="fa fa-exclamation"></i>Password must contain atleast a number and an alphabet'
                );
              }
            } else {
              $("#submitButton").prop("disabled", true);
              $("#passwordInvalid").html(
                '<i class="fa fa-exclamation"></i>Password must be atleast 8 characters'
              );
            }
          };
        
          // confirm password match
        function passwordMatch() {
            const inputPassword = $("#inputPassword").val();
            const confirmPassword = $("#confirmPassword").val();
            if (inputPassword !== confirmPassword) {
              $("#submitButton").prop("disabled", true);
              $("#passwordmatch").html(
                '<i class="fa fa-exclamation"></i>Password doesnot match'
              );
            } else {
              $("#submitButton").prop("disabled", false);
              $("#passwordmatch").empty();
            }
          }


          function numberValidator() {
            const inputNumber = $("#inputNumber").val();
            const numberReg = new RegExp("^[0-9]{10}$");
            if (numberReg.test(inputNumber)) {
              $("#submitButton").prop("disabled", false);
              $("#numberInvalid").empty();
            } else {
              $("#submitButton").prop("disabled", true);
              $("#numberInvalid").html(
                '<i class="fa fa-exclamation"></i>Invalid contact Number'
              );
            }
          };