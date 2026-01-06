

// Global variables 
var amount1 = "";
var amount2 = "";
var amount3 = "";
var message1 = "";
var message2 = "";
var message3 = "";
var DontionType = "";
var amount = 0;

// Hide donation amount part by default
document.getElementById('donatino-amount-part').style.display = "none";


function selectDonationType(DontionTypeValue) {
    document.getElementById('donationType').value = DontionTypeValue;

    if (DontionType != null) {
        if (DontionType != DontionTypeValue) {
            document.getElementById('donatino-amount-part').style.display = "none";
        }
    }
    DontionType = DontionTypeValue;
    controlContinueButton();
    // Get the button element by its ID
    var button = document.getElementById("continueButton");

    // Trigger the click event
    button.click();

    // Select the hidden input field by its ID  
    var hiddenField = document.getElementById("project");

    // Remove a value to the hidden field  
    hiddenField.value = "";

    // Clear existing funds divs if they exist  
    const existingOneOffFunds = document.querySelector('.one-off-funds');
    const existingMonthlyFunds = document.querySelector('.monthly-funds');

    if (existingOneOffFunds) {
        existingOneOffFunds.remove();
    }
    if (existingMonthlyFunds) {
        existingMonthlyFunds.remove();
    }

    // Dispaly donation type in your detail and payment detail sections
    const elements = document.getElementsByClassName('display-donation-type');

    if (elements.length > 0) {
        elements[0].innerHTML = "Your " + DontionType + " donation";
    }

    // Create and append the appropriate funds div based on the donation type  
    if (DontionType === "one-off") {

        // Assign donation type to hidden text box 
        document.getElementById('donation_type').value = DontionType

        // Display one-off logo and hide the others
        document.getElementById('one-off-donation-footer-logos').style.display = "flex";
        document.getElementById('donation-footer-logos').style.display = "none";
        document.getElementById('monthly-donation-footer-logos').style.display = "none";

        const oneOffFundsDiv = document.createElement('div');
        oneOffFundsDiv.className = 'col-md-8 funds one-off-funds';
        oneOffFundsDiv.innerHTML = ` <h1>Select Your Fund</h1>
                                                        <div class="radio-button">  
    <input type="radio" name="project_name" value="sadaqah" onclick="selectProject('Sadaqah', '60', '100', '200', 'Making a donation of $60 can provide a family with food for a month', 'Making a donation of $100 can provide a whole community with water', 'Making a donation of $200 can provide a whole community with ready made hot meals')" id="sadaqah">  
    <label for="sadaqah">Sadaqah</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="zakat" onclick="selectProject('Zakat', '200', '440', '960', 'Making a donation of $200 can provide three large families with food for a month', 'Making a donation of $440 can send two children to school for one year', 'Making a donation of $960 can sponsor an orphan for one year')" id="zakat">  
    <label for="zakat">Zakat</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="where-most-needed" onclick="selectProject('Where Most Needed', '60', '100', '200', 'Making a donation of $60 can provide a family with food for a month', 'Making a donation of $100 can provide a whole community with water', 'Making a donation of $200 can provide a whole community with ready made hot meals')" id="where-most-needed">  
    <label for="where-most-needed">Where Most Needed</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="gaza-appeal" onclick="selectProject('Gaza Emergency Appeal', '50', '100', '200', 'Making a donation of $50 can provide a family in Gaza with food for a month', 'Making a donation of $100 can provide two families in Gaza with food for a month', 'Making a donation of $200 can provide four families in Gaza with food for a month')" id="gaza-appeal">  
    <label for="gaza-appeal">Gaza Emergency Appeal</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="afghanistan-appeal" onclick="selectProject('Afghanistan Appeal', '60', '100', '200', 'Making a donation of $60 can provide a family with food for a month', 'Making a donation of $100 can provide a whole community with water', 'Making a donation of $200 can provide a whole community with ready made hot meals')" id="afghanistan-appeal">  
    <label for="afghanistan-appeal">Afghanistan Appeal</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="pakistan-appeal" onclick="selectProject('Pakistan Appeal', '60', '100', '200', 'Making a donation of $60 can provide a family with food for a month', 'Making a donation of $100 can provide a whole community with water', 'Making a donation of $200 can provide a whole community with ready made hot meals')" id="pakistan-appeal">  
    <label for="pakistan-appeal">Pakistan Appeal</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="nigeria-appeal" onclick="selectProject('Nigeria Appeal', '60', '100', '200', 'Making a donation of $60 can provide a family with food for a month', 'Making a donation of $100 can provide a whole community with water', 'Making a donation of $200 can provide a whole community with ready made hot meals')" id="nigeria-appeal">  
    <label for="nigeria-appeal">Nigeria Appeal</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="bangladesh-appeal" onclick="selectProject('Bangladesh Appeal', '60', '100', '200', 'Making a donation of $60 can provide a family with food for a month', 'Making a donation of $100 can provide a whole community with water', 'Making a donation of $200 can provide a whole community with ready made hot meals')" id="bangladesh-appeal">  
    <label for="bangladesh-appeal">Bangladesh Appeal</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="food-security" onclick="selectProject('Food Security', '60', '100', '200', 'Making a donation of $60 can provide a family with food for a month', 'Making a donation of $100 can provide a neighborhood with hot meals', 'Making a donation of $200 can provide a whole community with fresh bread')" id="food-security">  
    <label for="food-security">Food Security</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="water-aid" onclick="selectProject('Water Aid', '100', '500', '1300', 'Making a donation of $100 can provide a community with a water tanker', 'Making a donation of $500 can provide a community with a hand pump', 'Making a donation of $1300 can install a water well for a community to use')" id="water-aid">  
    <label for="water-aid">Water Aid</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="health-aid" onclick="selectProject('Health Aid', '20', '50', '1300', 'Making a donation of $20 can help provide a family with a hygiene kit', 'Making a donation of $50 can help send an ambulance to aid someone in need', 'Making a donation of $1300 can help sponsor a free medical camp for a needy community')" id="health-aid">  
    <label for="health-aid">Health Aid</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="education" onclick="selectProject('Education', '20', '30', '40', 'Making a donation of $20 can help give a student a school bag', 'Making a donation of $30 can help sponsor a Hafiz in Madrasah', 'Making a donation of $40 can help sponsor two students in a school')" id="education">  
    <label for="education">Education</label>  
</div>
                                                        <!-- Bellow div is required. If was not added then some css style will not apply -->
                                                        <div>
                                                            <input type="radio" id="orphans-children" style="visibility:hidden" name="project" value="orphans-children">
                                                        </div>
`;
        document.querySelector('.funds-container .row').appendChild(oneOffFundsDiv);

        document.getElementById('one-off').style.border = "2px solid #fff";
        document.getElementById('one-off').style.backgroundColor = "#8b251c";

        document.getElementById('monthly').style.border = "2px solid #660199";
        document.getElementById('monthly').style.backgroundColor = "#a91f21";
    } else if (DontionType === "monthly") {

        // Assign donation type to hidden text box 
        document.getElementById('donation_type').value = DontionType

        // Display monthy logo and hide the others
        document.getElementById('one-off-donation-footer-logos').style.display = "none";
        document.getElementById('donation-footer-logos').style.display = "none";
        document.getElementById('monthly-donation-footer-logos').style.display = "flex";

        const monthlyFundsDiv = document.createElement('div');
        monthlyFundsDiv.className = 'col-md-8 funds monthly-funds';
        monthlyFundsDiv.innerHTML = `<h1>Select Your Fund</h1>
                                                        <div class="radio-button">  
    <input type="radio" name="project_name" value="sadaqah-monthly" onclick="selectProject('Sadaqah', '6', '10', '20', 'Making a donation of $6 a month can help transform the lives of communities affected by natural disasters and poverty', 'Making a donation of $10 a month can help transform the lives of communities affected by natural disasters and poverty', 'Making a donation of $20 a month can help transform the lives of communities affected by natural disasters and poverty')" id="sadaqah-monthly">  
    <label for="sadaqah-monthly">Sadaqah</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="where-most-needed-monthly" onclick="selectProject('Where Most Needed', '6', '10', '20', 'Making a donation of $6 a month can help transform the lives of communities affected by natural disasters and poverty', 'Making a donation of $10 a month can help transform the lives of communities affected by natural disasters and poverty', 'Making a donation of $20 a month can help transform the lives of communities affected by natural disasters and poverty')" id="where-most-needed-monthly">  
    <label for="where-most-needed-monthly">Where Most Needed</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="gaza-appeal-monthly" onclick="selectProject('Gaza Emergency Appeal', '10', '20', '40', 'Making a donation of $10 towards our Palestine fund can provide life-saving aid', 'Making a donation of $20 towards our Palestine fund can provide life-saving aid', 'Making a donation of $40 towards our Palestine fund can provide life-saving aid')" id="gaza-appeal-monthly">  
    <label for="gaza-appeal-monthly">Gaza Emergency Appeal</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="afghanistan-appeal-monthly" onclick="selectProject('Afghanistan Appeal', '10', '20', '40', 'Making a donation of $10 towards our Afghanistan fund can provide life-saving aid', 'Making a donation of $20 towards our Afghanistan fund can provide life-saving aid', 'Making a donation of $40 towards our Afghanistan fund can provide life-saving aid')" id="afghanistan-appeal-monthly">  
    <label for="afghanistan-appeal-monthly">Afghanistan Appeal</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="water-aid-monthly" onclick="selectProject('Water Aid', '6', '10', '20', 'Making a donation of $6 towards our water aid fund can provide communities with access to clean water', 'Making a donation of $10 towards our water aid fund can provide communities with access to clean water', 'Making a donation of $20 towards our water aid fund can provide communities with access to clean water')" id="water-aid-monthly">  
    <label for="water-aid-monthly">Water Aid</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="health-aid-monthly" onclick="selectProject('Health Aid', '6', '10', '20', 'Making a donation of $6 towards our health aid fund can provide life-saving aid', 'Making a donation of $10 towards our health aid fund can provide life-saving aid', 'Making a donation of $20 towards our health aid fund can provide life-saving aid')" id="health-aid-monthly">  
    <label for="health-aid-monthly">Health Aid</label>  
</div>  

<div class="radio-button">  
    <input type="radio" name="project_name" value="food-security-monthly" onclick="selectProject('Food Security', '6', '10', '20', 'Making a donation of $6 towards our food security fund can provide those in need with food', 'Making a donation of $10 towards our food security fund can provide those in need with food', 'Making a donation of $20 towards our food security fund can provide those in need with food')" id="food-security-monthly">  
    <label for="food-security-monthly">Food Security</label>  
</div>
                                                        <!-- Bellow div is required. If was not added then some css style will not apply -->
                                                        <div>
                                                            <input type="radio" id="orphans-children" style="visibility:hidden" name="project" value="orphans-children">

                                                        </div>
`;
        document.querySelector('.funds-container .row').appendChild(monthlyFundsDiv);

        document.getElementById('monthly').style.border = "2px solid #fff";
        document.getElementById('monthly').style.backgroundColor = "#8b251c";

        document.getElementById('one-off').style.border = "2px solid #660199";
        document.getElementById('one-off').style.backgroundColor = "#a91f21";
    }
}


function controlContinueButton() {

    if (DontionType == "") {
        document.getElementById('continueButton').classList.add("disabled-continue-button");
    }
    else {
        document.getElementById('continueButton').classList.remove("disabled-continue-button");
    }
}
controlContinueButton();


document.addEventListener('DOMContentLoaded', () => {
    const otherAmountDiv = document.getElementById('other-amount');
    const amountRadios = document.querySelectorAll('input[name="amount"]');

    // Function to handle radio button change  
    function handleRadioChange() {
        if (this.value === 'other') {
            otherAmountDiv.style.display = 'block'; // Show other amount div  
            // Focus other amount text box
            document.getElementById('otherAmount').focus();
            document.getElementById('amountMessage').innerHTML = "Pease enter your amount";
        } else {
            otherAmountDiv.style.display = 'none'; // Hide other amount div  
        }
    }

    // Select amount2 by default  
    document.getElementById('amount2').checked = true;

    // Add change event listeners to radio buttons  
    amountRadios.forEach(radio => {
        radio.addEventListener('change', handleRadioChange);
    });
});


// Get amount from radio button
function getSelectedValue() {
    const radios = document.getElementsByName('amount');
    let selectedAmount;

    for (const radio of radios) {
        if (radio.checked) {
            selectedAmount = radio.value;
            break; // Exit the loop once the checked radio is found  
        }
    }

    if (selectedAmount) {
        // First conver amount from string to number.
        let amount = +selectedAmount;
        return amount;
    } else {
        return 0;
    }
}

// Selection of project
function selectProject(project, amount1, amount2, amount3, amount1Message, amount2Message, amount3Message) {

    // Display donation amount part
    document.getElementById('donatino-amount-part').style.display = "block";

    // Fill the hidden project field
    // Select the hidden input field by its ID  
    var hiddenField = document.getElementById("project");

    // Assign a value to the hidden field  
    hiddenField.value = ".";


    document.getElementById('amount1').value = amount1;
    document.getElementById('amount2').value = amount2;
    document.getElementById('amount3').value = amount3;
    document.getElementById('amount1Label').innerHTML = "$" + amount1;
    document.getElementById('amount2Label').innerHTML = "$" + amount2;
    document.getElementById('amount3Label').innerHTML = "$" + amount3;

    // Set default amount and message
    document.getElementById('amount2').checked = true;
    document.getElementById('amount-message').innerHTML = amount2Message;

    // Set messages in global varibles 
    message1 = amount1Message;
    message2 = amount2Message;
    message3 = amount3Message;

    // Set amounts in global variables
    this.amount1 = amount1;
    this.amount2 = amount2;
    this.amount3 = amount3;

    // Set selected default value
    selectedValue = amount2;

    // Set gift aid section
    SetGiftAidSection(selectedValue);

    // Setting project name and payment amount for displaying in your details section
    document.getElementById('projec-name-in-your-detail-page').innerHTML = project;
    document.getElementById('payment-amount-in-your-detail-page').innerHTML = amount2;
    document.getElementById('total-payment-amount-in-your-detail-page').innerHTML = amount2;

    // Setting project name and payment amount for displaying in payment details section
    document.getElementById('project-name-in-payment-detail-page').innerHTML = project;
    document.getElementById('payment-amount-in-payment-detail-page').innerHTML = amount2;
    document.getElementById('total-payment-amount-in-payment-detail-page').innerHTML = amount2;


}


function handleAmountMessageChange() {
    // Get the radio button group  
    const radios = document.getElementsByName('amount');
    let optionNumber = 0;

    // Loop through the radio buttons to find the checked one  
    for (const radio of radios) {

        optionNumber++;

        if (radio.checked) {
            selectedValue = radio.value; // Get the selected value  
            break; // Stop the loop once we find the checked radio button  
        }
    }

    // Set gift aid section
    SetGiftAidSection(selectedValue);


    if (optionNumber == 1) {
        document.getElementById('amount-message').innerHTML = message1;

        // Setting payment amount for displaying in your details section
        document.getElementById('payment-amount-in-your-detail-page').innerHTML = selectedValue;
        document.getElementById('total-payment-amount-in-your-detail-page').innerHTML = selectedValue;

        // Setting payment amount for displaying in payment details section
        document.getElementById('payment-amount-in-payment-detail-page').innerHTML = selectedValue;
        document.getElementById('total-payment-amount-in-payment-detail-page').innerHTML = selectedValue;

    }
    else if (optionNumber == 2) {
        document.getElementById('amount-message').innerHTML = message2;


        // Setting payment amount for displaying in your details section
        document.getElementById('payment-amount-in-your-detail-page').innerHTML = selectedValue;
        document.getElementById('total-payment-amount-in-your-detail-page').innerHTML = selectedValue;

        // Setting payment amount for displaying in payment details section
        document.getElementById('payment-amount-in-payment-detail-page').innerHTML = selectedValue;
        document.getElementById('total-payment-amount-in-payment-detail-page').innerHTML = selectedValue;

    }
    else if (optionNumber == 3) {
        document.getElementById('amount-message').innerHTML = message3;

        // Setting payment amount for displaying in your details section
        document.getElementById('payment-amount-in-your-detail-page').innerHTML = selectedValue;
        document.getElementById('total-payment-amount-in-your-detail-page').innerHTML = selectedValue;

        // Setting payment amount for displaying in payment details section
        document.getElementById('payment-amount-in-payment-detail-page').innerHTML = selectedValue;
        document.getElementById('total-payment-amount-in-payment-detail-page').innerHTML = selectedValue;


    }
    else if (optionNumber == 4) {
        // Change amount message
        document.getElementById('amount-message').innerHTML = "Please enter your amount";
    }

}

function manualAmountInput() {
    // Getting manual amount
    var manualAmount = document.getElementById('otherAmount').value;
    // Set gift aid section
    SetGiftAidSection(manualAmount);

    // Setting payment amount for displaying in your details section
    document.getElementById('payment-amount-in-your-detail-page').innerHTML = manualAmount;
    document.getElementById('total-payment-amount-in-your-detail-page').innerHTML = manualAmount;

    // Setting payment amount for displaying in payment details section
    document.getElementById('payment-amount-in-payment-detail-page').innerHTML = manualAmount;
    document.getElementById('total-payment-amount-in-payment-detail-page').innerHTML = manualAmount;


}


// Setting gift aid section
function SetGiftAidSection(amount) {
    let chosenAmount = parseFloat(amount);
    let AmountWithGiftAid = parseFloat((chosenAmount * 1.25).toFixed(2));
    document.getElementById('paying-amount').innerHTML = chosenAmount;
    document.getElementById('paying-amount-with-gift-aid').innerHTML = AmountWithGiftAid;

}

// Setting project name and payment amount for displaying in your details section
document.getElementById('projec-name-in-your-detail-page').innerHTML = project;
document.getElementById('payment-amount-in-your-detail-page').innerHTML = amount2;
document.getElementById('total-payment-amount-in-your-detail-page').innerHTML = amount2;

// Setting project name and payment amount for displaying in payment details section
document.getElementById('project-name-in-payment-detail-page').innerHTML = project;
document.getElementById('payment-amount-in-payment-detail-page').innerHTML = amount2;
document.getElementById('total-payment-amount-in-payment-detail-page').innerHTML = amount2;



