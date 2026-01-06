var donationType = "one off";


function otherClicked() {
    $('#amount').val('');
    document.getElementById('donation-message').innerHTML = "Please enter the amount";
    var amountButtons = document.getElementsByClassName('btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }
}
document.getElementById('amount-4').oninput = function () {
    otherAmountChanged(this.value);
};

function otherAmountChanged(value) {
    $('#amount').val(value);

    var amountButtons = document.getElementsByClassName('btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }

    var textVal = document.getElementById("amount-4").value;
    if (textVal !== "") {
        document.getElementById("amount-4").style.backgroundColor = "#fff";
        document.getElementById("amount-4").style.color = "#000";
    }
}


function donateNow(project_name) {
    var otherValue = document.getElementById('amount-4').value;
    if (otherValue !== "") {
        var value = parseInt(otherValue);
        if (!isNaN(value) && value > 0) {
            let project = project_name;
            let project = project_name.split('-')    // Split the string by hyphen  
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word  
                .join('');  // Join the words together without spaces  
            addAndRefreshBasket(19, project, value);
            showToast("Thank you!", "Your donation of £[" + value + "] has been added to the basket.", "success");
        }
    } else {
        var value = parseInt(document.getElementById('amount').value);
        if (!isNaN(value) && value > 0) {
            alert(project_name);
            alert(value);
            let project = project_name;
            let project = project_name.split('-')    // Split the string by hyphen  
                .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word  
                .join('');  // Join the words together without spaces  
            addAndRefreshBasket(19, project, value);
            showToast("Thank you!", "Your donation of £[" + value + "] has been added to the basket.", "success");
        }
    }
}

