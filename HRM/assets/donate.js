var donationType = "monthly";
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
        donationType = "one time";
        document.getElementById('amount-1').innerHTML = "$45";
        document.getElementById('amount-2').innerHTML = "$100";
        document.getElementById('amount-3').innerHTML = "$150";
    } else {
        donateSwitchElement.style.left = "5px";
        donationType = "monthly";
        document.getElementById('amount-1').innerHTML = "$5";
        document.getElementById('amount-2').innerHTML = "$10";
        document.getElementById('amount-3').innerHTML = "$20";
    }
}

function amountClicked(amount) {
    document.getElementById('amount-4').value = "";
    var donateSwitchElement = document.getElementById("circle-bullet");
    if (donateSwitchElement.style.left === "5px") {
        if (amount == "1")
            amount = "5";
        else if (amount == "2")
            amount = "10";
        else if (amount == "3")
            amount = "20";
    }
    else {
        if (amount == "1")
            amount = "45";
        else if (amount == "2")
            amount = "100";
        else if (amount == "3")
            amount = "150";
    }
    $('#amount').val(amount);
    var amountButtons = document.getElementsByClassName('btn-amount');
    for (var i = 0; i < amountButtons.length; i++) {
        amountButtons[i].style.backgroundColor = '#660199';
        amountButtons[i].style.color = '#fff';
    }
    if (amount == "5" || amount == "45") {
        document.getElementById("amount-1").style.backgroundColor = "#fff";
        document.getElementById("amount-1").style.color = "#000";
    }
    if (amount == "10" || amount == "100") {
        document.getElementById("amount-2").style.backgroundColor = "#fff";
        document.getElementById("amount-2").style.color = "#000";
    }
    if (amount == "20" || amount == "150") {
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
            currentAmount = "5";
        else if (num == "2")
            currentAmount = "10";
        else if (num == "3")
            currentAmount = "20";
    }
    else {
        if (num == "1")
            currentAmount = "45";
        else if (num == "2")
            currentAmount = "100";
        else if (num == "3")
            currentAmount = "150";
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
            alert("Valid Amount");
        } else {
            alert("Invalid Amount");
        }
    } else {
        var value = parseInt(document.getElementById('amount').value);
        if (!isNaN(value) && value > 0) {
            alert("Valid Amount");
        } else {
            alert("Invalid Amount");
        }
    }
}

