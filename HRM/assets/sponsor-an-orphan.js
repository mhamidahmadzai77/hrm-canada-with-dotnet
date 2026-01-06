
// Get the input fields
const noOfOrphansInput = document.getElementById('no-of-orphans');
const totalDonationInput = document.getElementById('total-donation');

// Add an input event listener to the number of orphans input field
noOfOrphansInput.addEventListener('input', function () {
   

    // Calculate the total donation amount
    const noOfOrphans = parseInt(noOfOrphansInput.value);
    const total = noOfOrphans * 60;

    // Update the total donation input field with the calculated amount
    if (noOfOrphans > 0) {
        // Change border color
        document.getElementById('no-of-orphans').style.borderColor = "unset";
        // Assign total to the corresponding field
        totalDonationInput.value = total;
    }
    else {
        // Change border color
        document.getElementById('no-of-orphans').style.borderColor = "red";

        totalDonationInput.value = "";
    }



});


function donateNow() {
    const noOfOrphans = parseInt(noOfOrphansInput.value);
    if (noOfOrphans > 0) {
        var amount = parseInt(totalDonationInput.value);
        // Go to donation page
        var data = {
            donationType: "monthly",
            name: "Orphan-Sponsorship",
            amount: amount
        };
        $.ajax({
            url: '/Donation/Donate_Start', // Adjust the URL to your controller and action method  
            type: 'POST',
            data: data,
            success: function (response) {
                if (response.redirectTo) {
                    window.location.href = response.redirectTo;
                }
            },
            error: function (xhr, status, error) {
                console.error("Error: ", error);
            }
        });
    }
    else {
        document.getElementById('no-of-orphans').focus();
        document.getElementById('no-of-orphans').style.borderColor = "red";
    }
}

