
// Prevent form submission on Enter key press       
$('#subscriptionForm').on('keypress', function (e) {
    if (e.which === 13) {
        e.preventDefault();
    }
});  


$(document).ready(function () {
    $('#subscribeButton').click(function () {

        // Clear previous error message  
        $('#emailError').hide();

        // Get the values  
        var email = $('#joinMail').val();
        var isChecked = $('#joinMailCheckbox').is(':checked');

        // Validate email  
        if (!validateEmail(email)) {
            $('#emailError').text('Please enter a valid email address.').show();
            return;
        }

        // Prepare data to send to the server  
        var formData = {
            Email: email,
            Subscribe: isChecked
        };

        // Send data to MVC controller using AJAX  
        $.ajax({
            url: '/Home/Subscribe', // replace with your controller and action names  
            type: 'POST',
            data: JSON.stringify(formData),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (response) {
                // Handle success - you can give feedback to the user  
                if (response == "subscribed") {
                    showToast("Subscribed Successfully", "", "success");
                    document.getElementById('joinMail').value = "";
                }
                else if (response == "already subscribed") {
                    showToast("Already Subscribed", "", "info");
                    document.getElementById('joinMail').value = "";
                }
                else if (response == "did not subscribe") {
                    showToast("Error", "Please try again", "error");
                }
                else {
                    swal("Exception Occurred!", "" + response, {
                        icon: "info", buttons: " Ok "
                    });
                }
                
            },
            error: function (xhr, status, error) {
                // Handle error - you can display an error message  
                swal("Error Occurred!", "" + error, {
                    icon: "error", buttons: " Ok "
                });
            }
        });
    });

});




function controlEmailErrorMessage() {
    
    var email = document.getElementById('joinMail').value;
    if (validateEmail(email)) {
        $('#emailError').hide();
    }
    else {
        $('#emailError').show();
    }
}

// Function to validate email format  
function validateEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex  
    return regex.test(email);
}
