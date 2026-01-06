var donationType = "one off";


document.getElementById('amount-2').style.backgroundColor = "#fff";
document.getElementById('amount-2').style.color = "#000";
document.getElementById('amount').value = "120";
document.getElementById('donation-message').innerHTML = "can provide 30 people with two ready-to-eat meals per day";

function amountClicked(amount) {
    document.getElementById('amount-4').value = "";


    if (amount == "1") {
        amount = "60";
        document.getElementById('donation-message').innerHTML = "can provide emergency medicines and medical supplies";
    }
    else if (amount == "2") {
        amount = "120";
        document.getElementById('donation-message').innerHTML = "can provide 30 people with two ready-to-eat meals per day";
    }
    else if (amount == "3") {
        amount = "300";
        document.getElementById('donation-message').innerHTML = "can provide psychosocial support sessions to children in Gaza";
    }

    $('#amount').val(amount);
    var amountButtons = document.getElementsByClassName('btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }
    if (amount == "60") {
        document.getElementById("amount-1").style.backgroundColor = "#fff";
        document.getElementById("amount-1").style.color = "#000";
    }
    if (amount == "120") {
        document.getElementById("amount-2").style.backgroundColor = "#fff";
        document.getElementById("amount-2").style.color = "#000";
    }
    if (amount == "300") {
        document.getElementById("amount-3").style.backgroundColor = "#fff";
        document.getElementById("amount-3").style.color = "#000";
    }
}

function changeColorWithMouseOver(num) {

    var element = document.getElementById('amount-' + num);
    element.style.backgroundColor = '#fff'; // Change 'white' to the desired background color
    element.style.color = '#000'; // Change 'black' to the desired text color
}

function changeColorWithMouseOut(num) {
    var currentAmount = "";

    if (num == "1")
        currentAmount = "60";
    else if (num == "2")
        currentAmount = "120";
    else if (num == "3")
        currentAmount = "300";

    var amountValue = document.getElementById('amount').value;

    if (amountValue != currentAmount) {
        var element = document.getElementById('amount-' + num);
        element.style.backgroundColor = '#660199'; // Change 'purple' to the desired background color
        element.style.color = '#fff'; // Change 'white' to the desired text color
    }

}

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
            addAndRefreshBasket(11, project, value);
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
            addAndRefreshBasket(11, project, value);
            showToast("Thank you!", "Your donation of £[" + value + "] has been added to the basket.", "success");
        }
    }
}

