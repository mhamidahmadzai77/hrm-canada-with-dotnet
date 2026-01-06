var donationType = "monthly";


document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
document.getElementById('inner-amount-2').style.color = "#000";
document.getElementById('inner-amount').value = "30";
document.getElementById('inner-donation-message').innerHTML = "just $30 a month towards our Green Afghanistan project can contribute to planting 5 trees in Afghanistan, every month";
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
        document.getElementById('inner-amount-1').innerHTML = "$6";
        document.getElementById('inner-amount-2').innerHTML = "$30";
        document.getElementById('inner-amount-3').innerHTML = "$60";

        // select default option
        document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
        document.getElementById('inner-amount-2').style.color = "#000";
        document.getElementById('inner-amount').value = "30";
        document.getElementById('inner-donation-message').innerHTML = "towards our Green Afghanistan project can help plant 5 trees in Afghanistan";

    } else {
        donateSwitchElement.style.left = "5px";
        donationType = "monthly";
        document.getElementById('inner-amount-1').innerHTML = "$6";
        document.getElementById('inner-amount-2').innerHTML = "$30";
        document.getElementById('inner-amount-3').innerHTML = "$60";

        // select default option
        document.getElementById('inner-amount-2').style.backgroundColor = "#fff";
        document.getElementById('inner-amount-2').style.color = "#000";
        document.getElementById('inner-amount').value = "30";
        document.getElementById('inner-donation-message').innerHTML = "just $30 a month towards our Green Afghanistan project can contribute to planting 5 trees in Afghanistan, every month";

    }
}

function innerAmountClicked(amount) {
    document.getElementById('inner-amount-4').value = "";
    var donateSwitchElement = document.getElementById("inner-circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        if (amount == "1") {
            amount = "6";
            document.getElementById('inner-donation-message').innerHTML = "just $6 a month towards our Green Afghanistan project can contribute to planting a tree in Afghanistan, every month";
        }
        else if (amount == "2") {
            amount = "30";
            document.getElementById('inner-donation-message').innerHTML = "just $30 a month towards our Green Afghanistan project can contribute to planting 5 trees in Afghanistan, every month";
        }
        else if (amount == "3") {
            amount = "60";
            document.getElementById('inner-donation-message').innerHTML = "just $60 a month towards our Green Afghanistan project can contribute to planting 10 trees in Afghanistan, every month";
        }
    }
    else {
        if (amount == "1") {
            amount = "6";
            document.getElementById('inner-donation-message').innerHTML = "towards our Green Afghanistan project can help plant a tree in Afghanistan";
        }
        else if (amount == "2") {
            amount = "30";
            document.getElementById('inner-donation-message').innerHTML = "towards our Green Afghanistan project can help plant 5 trees in Afghanistan";
        }
        else if (amount == "3") {
            amount = "60";
            document.getElementById('inner-donation-message').innerHTML = "towards our Green Afghanistan project can help plant 10 trees  in Afghanistan";
        }
    }
    $('#inner-amount').val(amount);
    var amountButtons = document.getElementsByClassName('inner-btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }
    if (amount == "6" || (amount == "6" && donationType == "one off")) {
        document.getElementById("inner-amount-1").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-1").style.color = "#000";
    }
    if ((amount == "30" && donationType == "monthly") || (amount == "30" && donationType == "one off")) {
        document.getElementById("inner-amount-2").style.backgroundColor = "#fff";
        document.getElementById("inner-amount-2").style.color = "#000";
    }
    if ((amount == "60" && donationType == "monthly") || amount == "60") {
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
            currentAmount = "6";
        else if (num == "2")
            currentAmount = "30";
        else if (num == "3")
            currentAmount = "60";
    }
    else {
        if (num == "1")
            currentAmount = "6";
        else if (num == "2")
            currentAmount = "30";
        else if (num == "3")
            currentAmount = "60";
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
                addAndRefreshBasket(10, "Green-Afghanistan", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Green-Afghanistan",
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
                addAndRefreshBasket(10, "Green-Afghanistan", value);
                showToast("Thank you!", "Your donation of $[" + value + "] has been added to the basket.", "success");
            }
            else {
                var data = {
                    donationType: "monthly",
                    name: "Green-Afghanistan",
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

