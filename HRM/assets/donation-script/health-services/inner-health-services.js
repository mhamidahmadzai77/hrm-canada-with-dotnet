var donationType = "monthly";


document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
document.getElementById('inner-amount-2').style.color = "#000";
document.getElementById('inner-amount').value = "20";
document.getElementById('inner-donation-message').innerHTML = "just $20 a month towards our Health Services fund can contribute towards providing medicine to a community in need";
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
        document.getElementById('inner-amount-1').innerHTML = "£20";
        document.getElementById('inner-amount-2').innerHTML = "£100";
        document.getElementById('inner-amount-3').innerHTML = "£1300";

        // select default option
        document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
        document.getElementById('inner-amount-2').style.color = "#000";
        document.getElementById('inner-amount').value = "100";
        document.getElementById('inner-donation-message').innerHTML = "towards our Health Services fund can provide specialised nutrition to a malnourished person in Afghanistan";

    } else {
        donateSwitchElement.style.left = "5px";
        donationType = "monthly";
        document.getElementById('inner-amount-1').innerHTML = "$10";
        document.getElementById('inner-amount-2').innerHTML = "$20";
        document.getElementById('inner-amount-3').innerHTML = "$40";

        // select default option
        document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
        document.getElementById('inner-amount-2').style.color = "#000";
        document.getElementById('inner-amount').value = "20";
        document.getElementById('inner-donation-message').innerHTML = "just $20 a month towards our Health Services fund can contribute towards providing medicine to a community in need";

    }
}

function innerAmountClicked(amount) {
    document.getElementById('inner-amount-4').value = "";
    var donateSwitchElement = document.getElementById("inner-circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        if (amount == "1") {
            amount = "10";
            document.getElementById('inner-donation-message').innerHTML = "just £10 a month towards our Health Services fund can contribute towards providing a family with a hygiene pack";
        }
        else if (amount == "2") {
            amount = "20";
            document.getElementById('inner-donation-message').innerHTML = "just £20 a month towards our Health Services fund can contribute towards providing medicine to a community in need";
        }
        else if (amount == "3") {
            amount = "40";
            document.getElementById('inner-donation-message').innerHTML = "just £40 a month towards our Health Services fund can contribute towards our emergency ambulance service in Afghanistan";
        }
    }
    else {
        if (amount == "1") {
            amount = "20";
            document.getElementById('inner-donation-message').innerHTML = "towards our Health Services fund can provide a family with a hygiene pack";
        }
        else if (amount == "2") {
            amount = "100";
            document.getElementById('inner-donation-message').innerHTML = "towards our Health Services fund can provide specialised nutrition to a malnourished person in Afghanistan";
        }
        else if (amount == "3") {
            amount = "1300";
            document.getElementById('inner-donation-message').innerHTML = "towards our Health Services fund can contribute towards providing medicine to a whole community in need";
        }
    }
    $('#inner-amount').val(amount);
    var amountButtons = document.getElementsByClassName('inner-btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }
    if (amount == "10" || (amount == "20" && donationType == "one off")) {
        document.getElementById("inner-amount-1").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-1").style.color = "#000";
    }
    if ((amount == "20" && donationType == "monthly") || (amount == "100" && donationType == "one off")) {
        document.getElementById("inner-amount-2").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-2").style.color = "#000";
    }
    if ((amount == "40" && donationType == "monthly") || amount == "1300") {
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
            currentAmount = "10";
        else if (num == "2")
            currentAmount = "20";
        else if (num == "3")
            currentAmount = "40";
    }
    else {
        if (num == "1")
            currentAmount = "20";
        else if (num == "2")
            currentAmount = "100";
        else if (num == "3")
            currentAmount = "1300";
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
                addAndRefreshBasket(3, "Health-Service", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Health-Service",
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
                addAndRefreshBasket(3, "Health-Service", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Health-Service",
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
