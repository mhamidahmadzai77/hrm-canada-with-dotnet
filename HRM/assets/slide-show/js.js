$(document).ready(function () {
    // Validate function for each field  
    function validateField(field) {
        const fieldValue = $(field).val();
        const errorMessageElement = $('<div class="error-message" style="color: red;"></div>');

        $(field).closest('.form-group').removeClass('has-error');
        $(field).next('.error-message').remove(); // Clear previous error messages  

        let isValid = true;
        let errorMessage = '';

        if (!fieldValue) {
            isValid = false;
            errorMessage = 'This field is required';
        }

        if ((field.id === 'priotiry' ) && !(fieldValue > 0)) {
            isValid = false;
            errorMessage = 'This field is required(must be 1 or more).';
        }

        // Add error class and message if invalid  
        if (!isValid) {
            $(field).closest('.form-group').addClass('has-error');
            errorMessageElement.text(errorMessage);
            $(field).after(errorMessageElement); // Append the error message  
        }

        return isValid;
    }

    // Validate each field on input  
    $('.validate').on('input', function () {
        validateImages();
        validateField(this);

    });

    // Submit button click event  
    $('#register-slideshow-image').click(function (e) {
        e.preventDefault(); // Prevent default form submission  
        let formIsValid = true;

        // Validate all fields before submitting  
        $('.validate').each(function () {
            if (!validateField(this)) {
                formIsValid = false;
            }
        });

        // Validate all images
        validateImages();

        // If form is valid, proceed with AJAX submission  
        if (formIsValid) {

            var fileInput1 = document.getElementById('image1');
            var image1 = fileInput1.files[0]; // Get the selected file  
            
            // Prepare form data  
            const formData = new FormData();
            formData.append('priority', $('#priority').val());
            formData.append('appealURL', $('#appeal-url').val());
            formData.append('image', image1);
            // AJAX call  
       

            $.ajax({
                url: '/SlideShow/Registraion',  
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                  
                    if (response.redirectTo) {
                        window.location.href = response.redirectTo;
                    }
                    else if (response == "did not save") {
                        swal("Error", "Something went wrong, please try again.", {
                            icon: "error", buttons: " Ok "
                        });
                    }
                    else {
                        swal("Exception Occurred!", response, {
                            icon: "info", buttons: " Ok "
                        });
                    }
                },
                error: function (xhr, status, error) {
                    swal("Error Occurred!", error.errorMessage, {
                        icon: "error", buttons: " Ok "
                    });
                }
            });
        } else {
            // Scroll to the first invalid field  
            const firstErrorField = $('.form-group.has-error').first().find('input');
            if (firstErrorField.length) {
                $('html, body').animate({
                    scrollTop: firstErrorField.offset().top - 100 // Adjust offset if needed  
                }, 600); // Duration in milliseconds  
                firstErrorField.focus(); // Focus on the first invalid field  
            }
        }
    });
});

// Validate images function   
function validateImages() {
    // Handle first image  
    var fileInput1 = document.getElementById('image1');
    var file = fileInput1.files[0];
    if (file) {
        document.getElementById('image1-error').style.display = "none";
    } else {
        document.getElementById('image1-error').style.display = "block";
    }
    

}



function deleteSlideshowImage(id) {

    swal({
        title: "Are you sure you want to delete it permanantly?",
        text: "",
        icon: "warning",
        buttons: ["No", "Yes"]
        ,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                // If user clicked yes button

                $.ajax({
                    url: '/SlideShow/DeleteSlideShowRecord', 
                    type: 'POST',
                    data: { id: id },
                    success: function (response) {
                        if (response === "deleted") {
                            showToast("Deleted successfully!", "", "success");
                            document.getElementById(id).remove();
                        } else if (response === "did not delete") {
                            swal("Error", "Something went wrong, please try again.", {
                                icon: "error", buttons: " Ok "
                            });
                        } else {
                            swal("Exception Occurred!", response, {
                                icon: "info", buttons: " Ok "
                            });
                        }
                    },
                    error: function (xhr, status, error) {
                        swal("Error Occurred!", error, {
                            icon: "error", buttons: " Ok "
                        });
                    }
                });

            }
        });

}



