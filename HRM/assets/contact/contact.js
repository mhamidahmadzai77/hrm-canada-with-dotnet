
function validateFirstname() {
    const firstnameInput = document.getElementById('contactFirstname');
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

function validateLastname() {
    const lastnameInput = document.getElementById('contactLastname');
    const errorSpan = document.getElementById('lastname-error');
    const value = lastnameInput.value;

    if (value.length < 3 || value.length > 30) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}

function validateMail() {
    const emailInput = document.getElementById('contactEmail');
    const errorSpan = document.getElementById('email-error');
    const value = emailInput.value.trim();
    // Regular expression for validating an email format  
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value === '') {
        errorSpan.innerHTML = 'Email is required.';
        errorSpan.style.display = 'block';
        return false;
    } else if (!emailPattern.test(value)) {
        errorSpan.innerHTML = 'Please enter a valid email address.';
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}

function validateCountry() {
    const countrySelect = document.getElementById('contactCoutry');
    const errorSpan = document.getElementById('country-error');

    if (countrySelect.value === '') {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}

function getSelectedRadioValue() {
    const radios = document.getElementsByName('contactSubjectRadios');
    let selectedValue = '';

    for (const radio of radios) {
        if (radio.checked) {
            selectedValue = radio.value;
            break; // Exit the loop once the checked radio button is found  
        }
    }

    return selectedValue; // Return the selected radio button value  
}


function validateMessage() {
    const messageInput = document.getElementById('contactMessage');
    const errorSpan = document.getElementById('message-error');
    const value = messageInput.value;

    if (value.length < 10 || value.length > 10000) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}

function sendData() {
    const isFirstnameValid = validateFirstname();
    const islastnameValid = validateLastname();
    const isEmailValid = validateMail();
    const isCountryValid = validateCountry();
    const isMessageValid = validateMessage();

    if (isFirstnameValid && islastnameValid && isEmailValid && isCountryValid && isMessageValid) {
        const formData = {
            firstname: document.getElementById('contactFirstname').value,
            lastname: document.getElementById('contactLastname').value,
            email: document.getElementById('contactEmail').value,
            country: document.getElementById('contactCoutry').value,
            subject: getSelectedRadioValue(),
            message: document.getElementById('contactMessage').value
        };

        $.ajax({
            url: '/Contact/Index',
            type: 'POST',
            data: formData,
            success: function (response) {

                if (response == "saved") {
                    showToast("You sent a message successfully", "", "success");

                    document.getElementById('contactFirstname').value = "";
                    document.getElementById('contactLastname').value = "";
                    document.getElementById('contactEmail').value = "";
                    document.getElementById('contactCoutry').value = "";
                    document.getElementById('contactMessage').value = "";

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



function sanitizeMessage(message) {
    // Replace newlines with spaces and trim whitespace  
    return message.replace(/(\r\n|\n|\r)/g, ' ').trim();
}

function displayContent(name, email, time, country, subject, message, id) {

    var elementToRemove = document.getElementById("icon" + id);
    if (elementToRemove) {
        // Remove the element from the DOM  
        elementToRemove.remove();
    }
    const data = {
        id: id
    }
    $.ajax({
        url: '/Contact/ReadContact',
        type: 'POST',
        data: data,
        success: function (response) {


        },
        error: function (error) {

        }
    });

    const screenWidth = window.screen.width;
    if (screenWidth <= 600) {
        document.getElementById("sidebar").style.display = "none";
        document.getElementById("contentArea").style.display = "block";
    }

    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = `<a onclick="goBack()" href="javascript:;" style="color:#660199;"><i class="fa fa-arrow-left"></i></a><h1 class="uppercase bold" style="text-align:center;color:#660199;">${name}</h1><p><span class="bold">Contacted:</span ${time}</p><p><span class="bold">Email:</span> <a href="mailTo:${email}">${email}</a></p><p><span class="bold">From:</span> ${country}</p><p><span class="bold">Subject:</span> ${subject}</p><p styl="text-align:justify;">${message}</p><a class="btn" onclick="goBack()" href="javascript:;" style="background-color:#660199;color:#fff;margin-top:30px;"><i class="fa fa-arrow-left"></i> back</a>`;

    // Hide sidebar and show content area in mobile view  
    if (window.innerWidth <= 600) {
        document.querySelector('.sidebar').classList.remove('active');
        contentArea.classList.add('active');
    }
}

// For mobile view, toggle sidebar on click events  
document.querySelector('.sidebar').addEventListener('click', function (event) {
    if (window.innerWidth <= 600) {
        const lis = this.querySelectorAll('li');
        lis.forEach(li => {
            li.addEventListener('click', () => {
                this.classList.remove('active');
                document.getElementById('contentArea').classList.add('active');
            });
        });
    }
});

function goBack() {
    const targetElement = document.querySelector('#contentArea');

    targetElement.scrollIntoView({
        behavior: 'smooth', // Smooth scroll  
        block: 'start'      // Align to the start of the element  
    });
    document.getElementById("contentArea").style.display = "none;"
    document.getElementById("sidebar").style.display = "block";
}

