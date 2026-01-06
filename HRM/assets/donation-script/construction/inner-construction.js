var donationType = "monthly";


document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
document.getElementById('inner-amount-2').style.color = "#000";
document.getElementById('inner-amount').value = "100";
document.getElementById('inner-donation-message').innerHTML = "just $100 a month towards our Construction fund can contribute towards providing a family with a house in Afghanistan";
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
        document.getElementById('inner-amount-1').innerHTML = "£9000";
        document.getElementById('inner-amount-2').innerHTML = "£16000";
        document.getElementById('inner-amount-3').style.display = "none";

        // select default option
        document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
        document.getElementById('inner-amount-2').style.color = "#000";
        document.getElementById('inner-amount').value = "9000";
        document.getElementById('inner-donation-message').innerHTML = "to construct a bakery for a whole community in need";

    } else {
        document.getElementById('inner-amount-3').style.display = "inline";

        donateSwitchElement.style.left = "5px";
        donationType = "monthly";
        document.getElementById('inner-amount-1').innerHTML = "$40";
        document.getElementById('inner-amount-2').innerHTML = "$100";
        document.getElementById('inner-amount-3').innerHTML = "$160";

        // select default option
        document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
        document.getElementById('inner-amount-2').style.color = "#000";
        document.getElementById('inner-amount').value = "100";
        document.getElementById('inner-donation-message').innerHTML = "just $100 a month towards our Construction fund can contribute towards providing a family with a house in Afghanistan";

    }
}

function innerAmountClicked(amount) {
    document.getElementById('inner-amount-4').value = "";
    var donateSwitchElement = document.getElementById("inner-circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        if (amount == "1") {
            amount = "40";
            document.getElementById('inner-donation-message').innerHTML = "just $40 a month towards our Construction fund can contribute towards providing a community with a local bakery";
        }
        else if (amount == "2") {
            amount = "100";
            document.getElementById('inner-donation-message').innerHTML = "just $100 a month towards our Construction fund can contribute towards providing a family with a house in Afghanistan";
        }
        else if (amount == "3") {
            amount = "160";
            document.getElementById('inner-donation-message').innerHTML = "just $160 a month towards our Construction fund can contribute towards providing a community with a masjid";
        }
    }
    else {
        if (amount == "1") {
            amount = "9000";
            document.getElementById('inner-donation-message').innerHTML = "to construct a bakery for a whole community in need";
        }
        else if (amount == "2") {
            amount = "16000";
            document.getElementById('inner-donation-message').innerHTML = "help construct a masjid for a community in Afghanistan";
        }
        else if (amount == "3") {
            amount = "1300";
            document.getElementById('inner-donation-message').innerHTML = "towards our Food Security fund can contribute towards providing fresh bread to a needy community";
        }
    }
    $('#inner-amount').val(amount);
    var amountButtons = document.getElementsByClassName('inner-btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }
    if (amount == "40" || (amount == "9000" && donationType == "one off")) {
        document.getElementById("inner-amount-1").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-1").style.color = "#000";
    }
    if ((amount == "100" && donationType == "monthly") || (amount == "16000" && donationType == "one off")) {
        document.getElementById("inner-amount-2").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-2").style.color = "#000";
    }
    if ((amount == "160" && donationType == "monthly") || amount == "1300") {
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
            currentAmount = "40";
        else if (num == "2")
            currentAmount = "100";
        else if (num == "3")
            currentAmount = "160";
    }
    else {
        if (num == "1")
            currentAmount = "9000";
        else if (num == "2")
            currentAmount = "16000";
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
                addAndRefreshBasket(4, "Building-Masjid", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Building-Masjid",
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
                addAndRefreshBasket(4, "Building-Masjid", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Building-Masjid",
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

