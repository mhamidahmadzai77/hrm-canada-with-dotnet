const { ERR } = require("parse5/dist/common/error-codes");



document.getElementById('file').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (file && file.type !== 'application/pdf') {
        showToast("", "Please select a PDF file.", "error");
        event.target.value = ''; // Clear the input
    }
});




function validateYear() {
    const yearInput = document.getElementById('year');
    const errorSpan = document.getElementById('year-error');
    const value = yearInput.value;

    if (value.length == null) {
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

function validateEditedYear() {
    const yearInput = document.getElementById('edit-year');
    const errorSpan = document.getElementById('edit-year-error');
    const value = yearInput.value;

    if (value.length == null) {
        errorSpan.style.display = 'block';
        return false;
    } else {
        errorSpan.style.display = 'none';
        return true;
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
    const isYearValid = validateYear();
    const isFileValid = validateFile();
    validateImage();
    var fileInput1 = document.getElementById('imageFile');
    var imageFile = fileInput1.files[0];
    var isImageValid = true;
    if (imageFile) {
        isImageValid = true;
    }
    else {
        isImageValid = false;
    }

    if (isYearValid && isFileValid && isImageValid) {
        // Get file 
        var fileInput = document.getElementById('file');
        var file = fileInput.files[0]; // Get the selected file

        // Get cover image
        var fileInput2 = document.getElementById('imageFile');
        var image = fileInput2.files[0];

        const year = document.getElementById('year').value; // Correctly capturing the year value

        
        // Create FormData object  
        const formData = new FormData();
        formData.append('year', year);
        formData.append('file', file); // Append the file object  
        formData.append('imageFile', image); // Append the image object  

        $.ajax({
            type: 'POST',
            url: '/About_Us/Add_Annual_Report',
            data: formData,
            contentType: false, // Don't set any content type header  
            processData: false,  // Prevent jQuery from transforming the data into a query string  
            success: function (response) {

                if (typeof response == "number") {
                    showToast("You added new annual report", "", "success");
                    document.getElementById('year').value = "";
                    fileInput.value = ''; // Clear the file input

                    // Now display the list
                    displayReportList();

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
                    newCell2.id = 'yearId' + response; // Unique ID for the second cell  
                    newCell2.textContent = year; // Set cell content  

                    const newCell3 = document.createElement('td');
                    
                    // Append the cells to the  row  
                    newRow.appendChild(newCell1);
                    newRow.appendChild(newCell2);
                    newRow.appendChild(newCell3);

                    // Insert the new row at the beginning of the table body  
                    tableBody.insertBefore(newRow, tableBody.firstChild);  

                    
                }
                else if (response === "did not save") {
                    swal("Something went wrong! please try again", "", {
                        icon: "error", buttons: " Ok "
                    });
                }
                else {
                    swal("Exception Occurred!", "" + response + " May you've entered duplicate report(year).", {
                        icon: "info", buttons: " Ok "
                    });
                }
            },
            error: function (error) {
                swal("Error Occurred!", "" + error.responseText, {
                    icon: "error", buttons: " Ok "
                });
            }
        });
    }
}



function deleteReport(id) {

    swal({
        title: "Are you sure you want to delete permanantly?",
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
                    url: '/About_Us/DeleteAnnualReport',
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
    document.getElementById("add-report").style.display = "block";
    document.getElementById("view-report").style.display = "none";
}

function displayReportList() {
    document.getElementById("add-report").style.display = "none";
    document.getElementById("view-report").style.display = "block";
}


// Validate image function   
function validateImage() {
    
    var fileInput1 = document.getElementById('imageFile');
    var file = fileInput1.files[0];
    if (file) {
        document.getElementById('image-error').style.display = "none";
    } else {
        document.getElementById('image-error').style.display = "block";
    }

}



