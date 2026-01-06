
function validateFirstname() {
    const firstnameInput = document.getElementById('firstname');
    const errorSpan = document.getElementById('firstname-error');
    const value = firstnameInput.value;

    if (value.length < 3 || value.length > 30) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}

function validateSurname() {
    const surnameInput = document.getElementById('surname');
    const errorSpan = document.getElementById('surname-error');
    const value = surnameInput.value;

    if (value.length < 3 || value.length > 30) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}


function gender() {
    const radios = document.getElementsByName('Gender');
    let selectedValue = '';

    for (const radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break; // Exit the loop once the checked radio button is found  
        }
    }

    return selectedValue; // Return the selected radio button value  
}

function validateBirthday() {
    const birthdayInput = document.getElementById('birthday');
    const errorSpan = document.getElementById('birthday-error');
    const value = birthdayInput.value;

    if (value.length < 1) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}

function validateAddress() {
    const addressInput = document.getElementById('address');
    const errorSpan = document.getElementById('address-error');
    const value = addressInput.value;

    if (value.length < 1) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}


function validateMail() {
    
     const emailInput = document.getElementById('email');
    const errorSpan = document.getElementById('email-error');
    const value = emailInput.value.trim();
    
    // Regular expression for validating an email format  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (value === '') {
        errorSpan.textContent = 'Email is required.';
        errorSpan.style.display = 'block';
        return false;
    } else if (!emailPattern.test(value)) {
        errorSpan.textContent = 'Please enter a valid email address.';
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}


function validateEmergencyContactName() {
    const contactNameInput = document.getElementById('emergencyContactName');
    const errorSpan = document.getElementById('emergency-contact-name-error');
    const value = contactNameInput.value;

    if (value.length < 1) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}

// Function to allow only numeric input  
function isNumberKey(evt) {
    const charCode = (evt.which) ? evt.which : evt.keyCode;

    // Allow only numeric keys (0-9) and control keys (backspace, tab)  
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false; // Block keystroke  
    }
    return true; // Allow keystroke  
}




function sendData() {
    const isFirstnameValid = validateFirstname();
    const isSurnameValid = validateSurname();
    const isBirthdayValid = validateBirthday();
    const isAddressValid = validateAddress();
    const isEmailValid = validateMail();
    const isContactNameValid = validateEmergencyContactName();

    if (isFirstnameValid && isSurnameValid && isEmailValid && isBirthdayValid && isAddressValid && isContactNameValid) {
        const formData = {
            firstname: document.getElementById('firstname').value,
            surname: document.getElementById('surname').value,
            gender: gender(),
            birthday: document.getElementById('birthday').value,
            address: document.getElementById('address').value,
            email: document.getElementById('email').value,
            emergencyContactName: document.getElementById('emergencyContactName').value,
            contactNumber: document.getElementById('contactNumber').value
        };

        $.ajax({
            url: '/Home/Volunteering',
            type: 'POST',
            data: formData,
            success: function (response) {

                if (response == "saved") {
                    showToast("We saved you information", "", "success");

                    document.getElementById('firstname').value = "";
                    document.getElementById('surname').value = "";
                    document.getElementById('birthday').value = "";
                    document.getElementById('address').value = "";
                    document.getElementById('email').value = "";
                    document.getElementById('emergencyContactName').value = "";
                    document.getElementById('contactNumber').value = "";

                }
                else if (response == "did not save") {
                    swal("Something went wrong! please try again", "", {
                        icon: "error", buttons: " Ok "
                    });
                }
                else {
                    swal("Exception Occurred!", "" + response, {
                        icon: "info", buttons: " Ok "
                    });


                }


            },
            error: function (error) {
                swal("Error Occurred!", "" + error, {
                    icon: "error", buttons: " Ok "
                });
            }
        });

    }
}


