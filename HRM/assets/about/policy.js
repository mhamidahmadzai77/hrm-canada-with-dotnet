const { ERR } = require("parse5/dist/common/error-codes");



document.getElementById('file').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type !== 'application/pdf') {
        showToast("", "Please select a PDF file.", "error");
        event.target.value = ''; // Clear the input
    }
});




function validatePolicyName() {
    const policyNameInput = document.getElementById('policyName');
    const errorSpan = document.getElementById('policy-error');
    const value = policyNameInput.value;

    if (value.length < 3) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
    }
}

function validateFile() {
    const fileInput = document.getElementById('file');
    const errorSpan = document.getElementById('file-error');
    var file = fileInput.files[0];
    if (file) {
        errorSpan.style.display = 'none';
        return true;
    } else {
        errorSpan.style.display = 'block';
        return false;
    }

}
function validateEditedFile() {
    const fileInput = document.getElementById('edit-file');
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

function isSelected() {

    const fileInput = document.getElementById('file');
    const errorSpan = document.getElementById('file-error');
    var file = fileInput.files[0];
    if (file) {
        errorSpan.style.display = 'none';
        return true;
    } else {
        errorSpan.style.display = 'block';
        return false;
    }
}
function sendData() {

    const isPolicyNameValid = validatePolicyName();
    const isFileValid = validateFile();
    if (isPolicyNameValid && isFileValid) {
        var fileInput = document.getElementById('file');
        var file = fileInput.files[0]; // Get the selected file  

        // Get file size and convert to KB or MB  
        let fileSize;
        if (file.size >= 1024 * 1024) { // Size is greater than or equal to 1 MB  
            fileSize = (file.size / (1024 * 1024)).toFixed(2) + ' MB'; // Convert to MB  
        } else {
            fileSize = (file.size / 1024).toFixed(2) + ' KB'; // Convert to KB  
        }

        const policyName = document.getElementById('policyName').value; // Correctly capturing the year value  

        // Create FormData object  
        const formData = new FormData();
        formData.append('policyName', policyName);
        formData.append('size', fileSize);
        formData.append('file', file); // Append the file object  
        
        $.ajax({
            type: 'POST',
            url: '/About_Us/Add_Policy',
            data: formData,
            contentType: false, // Don't set any content type header  
            processData: false,  // Prevent jQuery from transforming the data into a query string  
            success: function (response) {

                if (typeof response == "number") {
                    showToast("You added new policy", "", "success");
                    document.getElementById('policyName').value = "";
                    fileInput.value = ''; // Clear the file input

                    // Now display the list
                    displayPolicyList();

                    // Add new row to table
                    // Select the table body  
                    const tableBody = document.querySelector('#sample_2 tbody');

                    // Create a new row and give it an ID  
                    const newRow = document.createElement('tr');
                    newRow.id = response; // Assign a unique ID to the row  

                    // Create new cells and give them unique IDs  
                    const newCell1 = document.createElement('td');

                    newCell1.textContent = '*'; // Set cell content  

                    const newCell2 = document.createElement('td');
                    newCell2.id = 'policyName' + response; // Unique ID for the second cell  
                    newCell2.textContent = policyName; // Set cell content  

                    const newCell3 = document.createElement('td');

                    const newCell4 = document.createElement('td');
                    newCell4.id = 'fileType' + response; // Unique ID for the second cell  
                    newCell4.textContent = "PDF"; // Set cell content  
                    
                    const newCell5 = document.createElement('td');
                    newCell5.id = 'fileSize' + response; // Unique ID for the second cell  
                    newCell5.textContent = fileSize; // Set cell content  


                    // Append the cells to the  row  
                    newRow.appendChild(newCell1);
                    newRow.appendChild(newCell2);
                    newRow.appendChild(newCell3);
                    newRow.appendChild(newCell4);
                    newRow.appendChild(newCell5);

                    // Insert the new row at the beginning of the table body  
                    tableBody.insertBefore(newRow, tableBody.firstChild);


                }
                else if (response === "did not save") {
                    swal("Something went wrong! please try again", "", {
                        icon: "error", buttons: " Ok "
                    });
                }
                else {
                    swal("Exception Occurred!", "" + response , {
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



function deletePolicy(id) {

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
                    url: '/About_Us/DeletePolicy',
                    type: 'POST',
                    data: { id: id }
                    ,
                    success: function (response) {
                        if (response === "deleted") {
                            swal("Deleted successfully", "", {
                                icon: "success", buttons: "Ok"
                            });
                            document.getElementById("" + id).remove();
                        }
                        else if (response === "does not delete") {
                            swal("Error Occured", "Something went wrong, Please try again", {
                                icon: "error", buttons: "Ok"
                            });
                        }
                        else {
                            swal("Exception Occurred", "" + response, {
                                icon: "error", buttons: " Ok "
                            });
                        }

                    },
                    error: function (error) {
                        swal("Error Occurred", "" + error, {
                            icon: "error", buttons: " Ok "
                        });
                    }
                });



            }
        });

}


function diplayInsertionForm() {
    document.getElementById("add-policy").style.display = "block";
    document.getElementById("view-policy").style.display = "none";
}

function displayPolicyList() {
    document.getElementById("add-policy").style.display = "none";
    document.getElementById("view-policy").style.display = "block";
}


