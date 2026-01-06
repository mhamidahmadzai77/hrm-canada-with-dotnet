var donationType = "monthly";


document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
document.getElementById('inner-amount-2').style.color = "#000";
document.getElementById('inner-amount').value = "40";
document.getElementById('inner-donation-message').innerHTML = "just $40 a month towards our Emergency Ambulance Service can save lives in Afghanistan";
function innerDonateSwitch() {
    // set unselect all amount buttons
    var amountButtons = document.getElementsByClassName('inner-btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }

    $('#inner-amount').val('');
    var donateSwitchElement = document.getElementById("inner-circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        donateSwitchElement.style.left = "35px";
        donationType = "one off";
        document.getElementById('inner-amount-1').innerHTML = "$100";
        document.getElementById('inner-amount-2').innerHTML = "$300";
        document.getElementById('inner-amount-3').innerHTML = "$17000";

        // select default option
        document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
        document.getElementById('inner-amount-2').style.color = "#000";
        document.getElementById('inner-amount').value = "300";
        document.getElementById('inner-donation-message').innerHTML = "towards our Emergency Ambulance Service can save lives in Afghanistan";

    } else {
        donateSwitchElement.style.left = "5px";
        donationType = "monthly";
        document.getElementById('inner-amount-1').innerHTML = "$20";
        document.getElementById('inner-amount-2').innerHTML = "$40";
        document.getElementById('inner-amount-3').innerHTML = "$100";

        // select default option
        document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
        document.getElementById('inner-amount-2').style.color = "#000";
        document.getElementById('inner-amount').value = "40";
        document.getElementById('inner-donation-message').innerHTML = "just $40 a month towards our Emergency Ambulance Service can save lives in Afghanistan";

    }
}

function innerAmountClicked(amount) {
    document.getElementById('inner-amount-4').value = "";
    var donateSwitchElement = document.getElementById("inner-circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        if (amount == "1") {
            amount = "20";
            document.getElementById('inner-donation-message').innerHTML = "just $20 a month towards our Emergency Ambulance Service can save lives in Afghanistan";
        }
        else if (amount == "2") {
            amount = "40";
            document.getElementById('inner-donation-message').innerHTML = "just $40 a month towards our Emergency Ambulance Service can save lives in Afghanistan";
        }
        else if (amount == "3") {
            amount = "100";
            document.getElementById('inner-donation-message').innerHTML = "just $100 a month towards our Emergency Ambulance Service can save lives in Afghanistan";
        }
    }
    else {
        if (amount == "1") {
            amount = "100";
            document.getElementById('donation-message').innerHTML = "towards our Emergency Ambulance Service can save lives in Afghanistan";
        }
        else if (amount == "2") {
            amount = "300";
            document.getElementById('donation-message').innerHTML = "towards our Emergency Ambulance Service can save lives in Afghanistan";
        }
        else if (amount == "3") {
            amount = "17000";
            document.getElementById('donation-message').innerHTML = "cost of an ambulance in Afghanistan";
        }
    }
    $('#inner-amount').val(amount);
    var amountButtons = document.getElementsByClassName('inner-btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }
    if (amount == "20" || (amount == "100" && donationType == "one off")) {
        document.getElementById("inner-amount-1").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-1").style.color = "#000";
    }
    if ((amount == "40" && donationType == "monthly") || (amount == "300" && donationType == "one off")) {
        document.getElementById("inner-amount-2").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-2").style.color = "#000";
    }
    if ((amount == "100" && donationType == "monthly") || amount == "17000") {
        document.getElementById("inner-amount-3").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-3").style.color = "#000";
    }
}

function innerChangeColorWithMouseOver(num) {

    var element = document.getElementById('inner-amount-' + num);
    element.style.backgroundColor = '#fff'; // Change 'white' to the desired background color
    element.style.color = '#000'; // Change 'black' to the desired text color
}

function innerChangeColorWithMouseOut(num) {
    var currentAmount = "";
    var donateSwitchElement = document.getElementById("inner-circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        if (num == "1")
            currentAmount = "20";
        else if (num == "2")
            currentAmount = "40";
        else if (num == "3")
            currentAmount = "100";
    }
    else {
        if (num == "1")
            currentAmount = "100";
        else if (num == "2")
            currentAmount = "300";
        else if (num == "3")
            currentAmount = "17000";
    }

    var amountValue = document.getElementById('inner-amount').value;

    if (amountValue != currentAmount) {
        var element = document.getElementById('inner-amount-' + num);
        element.style.backgroundColor = '#660199'; // Change 'purple' to the desired background color
        element.style.color = '#fff'; // Change 'white' to the desired text color
    }

}

function innerOtherClicked() {
    $('#inner-amount').val('');
    document.getElementById('inner-donation-message').innerHTML = "Please enter the amount";
    var amountButtons = document.getElementsByClassName('inner-btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }
}
document.getElementById('inner-amount-4').oninput = function () {
    otherAmountChanged(this.value);
};

function innerOtherAmountChanged(value) {
    $('#inner-amount').val(value);

    var amountButtons = document.getElementsByClassName('inner-btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }

    var textVal = document.getElementById("inner-amount-4").value;
    if (textVal !== "") {
        document.getElementById("inner-amount-4").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-4").style.color = "#000";
    }
}


function innerDonateNow() {
    var otherValue = document.getElementById('inner-amount-4').value;
    if (otherValue !== "") {
        var value = parseInt(otherValue);
        if (!isNaN(value) && value > 0) {
            if (donationType == "one off") {
                addAndRefreshBasket(6, "Ambulance-Service", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Ambulance-Service",
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
        var value = parseInt(document.getElementById('inner-amount').value);
        if (!isNaN(value) && value > 0) {
            if (donationType == "one off") {
                addAndRefreshBasket(6, "Ambulance-Service", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Ambulance-Service",
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

