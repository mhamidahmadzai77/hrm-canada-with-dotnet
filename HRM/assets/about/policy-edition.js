const { ERR } = require("parse5/dist/common/error-codes");

document.getElementById('file').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type !== 'application/pdf') {
        showToast("", "Please select a PDF file.", "error");
        event.target.value = ''; // Clear the input
    }
});




function validateEditedPolicyName() {
    const policyInput = document.getElementById('edit-policy-name');
    const errorSpan = document.getElementById('edit-policy-error');
    const value = policyInput.value;
    
    if (value.length < 3) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}

function validateEditedFile() {
    const fileInput = document.getElementById('edit-file');

    var file = fileInput.files[0];
    if (file) {

        return true;
    } else {
        return false;
    }

}

function isSelected() {

    const fileInput = document.getElementById('file');
    const errorSpan = document.getElementById('edit-file-error');
    var file = fileInput.files[0];
    if (file) {
        errorSpan.style.display = 'none';
        return true;
    } else {
        errorSpan.style.display = 'block';
        return false;
    }
}

function sendUpdatedData() {
    const isPolicyNameValid = validateEditedPolicyName();
    const isFileValid = validateEditedFile();
    let fileSize;
    if (isFileValid) {
        var fileInput = document.getElementById('edit-file');
        if (isFileValid) {
            var file = fileInput.files[0]; // Get the selected file  
            // Get file size and convert to KB or MB  
            if (file.size >= 1024 * 1024) { // Size is greater than or equal to 1 MB  
                fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB'; // Convert to MB  
            } else {
                fileSize = (file.size / 1024).toFixed(2) + ' KB'; // Convert to KB  
            }
        }
    }
    else {
        fileSize = "";
    }


    const policyName = document.getElementById('edit-policy-name').value; // Correctly capturing the year value  
    var id = document.getElementById('id').value;
    // Create FormData object  
    const formData = new FormData();
    formData.append('id', id);
    formData.append('policyName', policyName);
    formData.append('size', fileSize);
    if (fileSize != "") {
        formData.append('file', file); // Append the file object  
    }

    if (isPolicyNameValid) {
        $.ajax({
            type: 'POST',
            url: '/About_Us/Update_Policy',
            data: formData,
            contentType: false, // Don't set any content type header  
            processData: false,  // Prevent jQuery from transforming the data into a query string  
            success: function (response) {

                if (response.redirectTo) {
                    window.location.href = response.redirectTo;
                }
                else if (response === "did not update") {
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





