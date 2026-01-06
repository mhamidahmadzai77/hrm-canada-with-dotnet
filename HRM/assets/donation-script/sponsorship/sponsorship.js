var donationType = "monthly";


document.getElementById('amount-2').style.backgroundColor = "#fff";
document.getElementById('amount-2').style.color = "#000";
document.getElementById('amount').value = "80";
document.getElementById('donation-message').innerHTML = "just $80 a month can sponsor an orphan in Afghanistan";
function donateSwitch() {
    // set unselect all amount buttons
    var amountButtons = document.getElementsByClassName('btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }

    $('#amount').val('');
    var donateSwitchElement = document.getElementById("circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        donateSwitchElement.style.left = "35px";
        donationType = "one off";
        document.getElementById('amount-1').innerHTML = "$240";
        document.getElementById('amount-2').innerHTML = "$960";
        document.getElementById('amount-3').innerHTML = "$1440";

        // select default option
        document.getElementById('amount-2').style.backgroundColor = "#fff";
        document.getElementById('amount-2').style.color = "#000";
        document.getElementById('amount').value = "960";
        document.getElementById('donation-message').innerHTML = "can sponsor an orphan in Afghanistan for a whole year";

    } else {
        donateSwitchElement.style.left = "5px";
        donationType = "monthly";
        document.getElementById('amount-1').innerHTML = "$20";
        document.getElementById('amount-2').innerHTML = "$80";
        document.getElementById('amount-3').innerHTML = "$120";

        // select default option
        document.getElementById('amount-2').style.backgroundColor = "#fff";
        document.getElementById('amount-2').style.color = "#000";
        document.getElementById('amount').value = "80";
        document.getElementById('donation-message').innerHTML = "just $80 a month can sponsor an orphan in Afghanistan";

    }
}

function amountClicked(amount) {
    document.getElementById('amount-4').value = "";
    var donateSwitchElement = document.getElementById("circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        if (amount == "1") {
            amount = "20";
            document.getElementById('donation-message').innerHTML = "just $20 a month can sponsor a student to go to school";
        }
        else if (amount == "2") {
            amount = "80";
            document.getElementById('donation-message').innerHTML = "just $80 a month can sponsor an orphan in Afghanistan";
        }
        else if (amount == "3") {
            amount = "120";
            document.getElementById('donation-message').innerHTML = "just $120 a month can sponsor a needy widow and her children";
        }
    }
    else {
        if (amount == "1") {
            amount = "240";
            document.getElementById('donation-message').innerHTML = "can sponsor a student to go to school for a whole year";
        }
        else if (amount == "2") {
            amount = "960";
            document.getElementById('donation-message').innerHTML = "can sponsor an orphan in Afghanistan for a whole year";
        }
        else if (amount == "3") {
            amount = "1440";
            document.getElementById('donation-message').innerHTML = "can sponsor a needy widow and her children for a whole year";
        }
    }
    $('#amount').val(amount);
    var amountButtons = document.getElementsByClassName('btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }
    if (amount == "20" || amount == "240") {
        document.getElementById("amount-1").style.backgroundColor = "#fff";
        document.getElementById("amount-1").style.color = "#000";
    }
    if (amount == "80" || (amount == "960" && donationType == "one off")) {
        document.getElementById("amount-2").style.backgroundColor = "#fff";
        document.getElementById("amount-2").style.color = "#000";
    }
    if ((amount == "120" && donationType == "monthly") || amount == "1440") {
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
    var donateSwitchElement = document.getElementById("circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        if (num == "1")
            currentAmount = "20";
        else if (num == "2")
            currentAmount = "80";
        else if (num == "3")
            currentAmount = "120";
    }
    else {
        if (num == "1")
            currentAmount = "240";
        else if (num == "2")
            currentAmount = "960";
        else if (num == "3")
            currentAmount = "1440";
    }

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


function donateNow() {
    var otherValue = document.getElementById('amount-4').value;
    if (otherValue !== "") {
        var value = parseInt(otherValue);
        if (!isNaN(value) && value > 0) {
            if (donationType == "one off") {
                addAndRefreshBasket(15, "Sponsorship", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Sponsorship",
                    amount: value
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

        }
    } else {
        var value = parseInt(document.getElementById('amount').value);
        if (!isNaN(value) && value > 0) {
            if (donationType == "one off") {
                addAndRefreshBasket(15, "Sponsorship", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Sponsorship",
                    amount: value
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
        }
    }
}
