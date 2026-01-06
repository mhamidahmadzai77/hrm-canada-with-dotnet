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
        if ((field.id === 'lowDonateAmount' || field.id === 'mediumDonateAmount' || field.id === 'highDonateAmount') && !(fieldValue > 0)) {
            isValid = false;
            errorMessage = 'This field is required';
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
    $('.validate, select, textarea').on('input', function () {
        
        validateField(this);

    });

    // Submit button click event  
    $('#add-new-appeal').click(function (e) {
        e.preventDefault(); // Prevent default form submission  
        
        let formIsValid = true;

        // Validate all fields before submitting  
        $('.validate, select, textarea.validate').each(function () {
            if (!validateField(this)) {
                formIsValid = false;
            }
        });

        // If form is valid, proceed with AJAX submission  
        if (formIsValid) {
            var fileInput1 = document.getElementById('image1');
            var fileInput2 = document.getElementById('image2');
            var fileInput3 = document.getElementById('image3');
            var image1 = fileInput1.files[0]; // Get the selected file  
            var image2 = fileInput2.files[0]; // Get the selected file  
            var image3 = fileInput3.files[0]; // Get the selected file  

            // Prepare form data  
            const formData = new FormData();
            formData.append('id', $('#id').val());
            formData.append('title', $('#title').val());
            formData.append('metadata', $('#metadata').val());
            formData.append('country', $('#country').val());
            formData.append('status', $('#status').val());
            formData.append('content', $('#content').val());
            formData.append('lowDonateAmount', $('#lowDonateAmount').val());
            formData.append('mediumDonateAmount', $('#mediumDonateAmount').val());
            formData.append('highDonateAmount', $('#highDonateAmount').val());
            formData.append('lowDonateAmountMessage', $('#lowDonateAmountMessage').val());
            formData.append('mediumDonateAmountMessage', $('#mediumDonateAmountMessage').val());
            formData.append('highDonateAmountMessage', $('#highDonateAmountMessage').val());
            formData.append('image1', image1);
            formData.append('image2', image2);
            formData.append('image3', image3);
            formData.append('contentImage1Note', $('#contentImage1Note').val());
            formData.append('contentImage2Note', $('#contentImage2Note').val());

            // AJAX call  
            $.ajax({
                url: '/Appeals/UpdateAppeal', // Update with your controller/action URL  
                type: 'POST',
                data: formData,
                contentType: false,
                processData: false,
                success: function (response) {
                    if (response.redirectTo) {
                        
                        window.location.href = response.redirectTo;
                    }
                    else if (response == "did not update") {
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
                    swal("Error Occurred!", error, {
                        icon: "error", buttons: " Ok "
                    });
                }
            });
        } else {
            // Scroll to the first invalid field  
            const firstErrorField = $('.form-group.has-error').first().find('input, select, textarea');
            if (firstErrorField.length) {
                $('html, body').animate({
                    scrollTop: firstErrorField.offset().top - 100 // Adjust offset if needed  
                }, 600); // Duration in milliseconds  
                firstErrorField.focus(); // Focus on the first invalid field  
            }
        }
    });
});

