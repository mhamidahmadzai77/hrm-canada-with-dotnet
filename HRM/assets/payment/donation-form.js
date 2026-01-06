var FormWizard = function () {
    return {
        init: function () {
            function e(e) {
                return e.id ? "<img class='flag' src='../../assets/global/img/flags/" + e.id.toLowerCase() + ".png'/>&nbsp;&nbsp;" + e.text : e.text
            }
            if (jQuery().bootstrapWizard) {
                $("#country_list").select2({
                    placeholder: "Select",
                    allowClear: !0,
                    formatResult: e,
                    width: "auto",
                    formatSelection: e,
                    escapeMarkup: function (e) {
                        return e
                    }
                });
                var r = $("#submit_form"), t = $(".alert-danger", r), i = $(".alert-success", r);
                r.validate({
                    doNotHideMessage: !0,
                    errorElement: "span",
                    errorClass: "help-block help-block-error",
                    focusInvalid: !1,
                    rules: {
                        project:
                        {
                            required: !0
                        },
                        amount:
                        {
                            required: !0
                        },
                        donor_firstname: {
                            minlength: 3, required: !0
                        },
                        donor_surname: {
                            minlength: 3,
                            required: !0,
                        },
                        manualAmount: {
                            required: !0
                        },
                        email: {
                            required: !0, email: !0
                        },
                        address: {
                            required: !0
                        },
                        city: {
                            required: !0
                        },
                        country: {
                            required: !0
                        }
                       
                    },
                    messages: {
                        "project": { required: "" }
                    },
                    errorPlacement: function (e, r) {
                        "gender" == r.attr("name") ? e.insertAfter("#form_gender_error") : "payment[]" == r.attr("name") ? e.insertAfter("#form_payment_error") : e.insertAfter(r)
                    },
                    invalidHandler: function (e, r) {
                        i.hide(), t.show(), App.scrollTo(t, -200)
                    },
                    highlight: function (e) {
                        $(e).closest(".form-group").removeClass("has-success").addClass("has-error")
                    },
                    unhighlight: function (e) { $(e).closest(".form-group").removeClass("has-error") }, success: function (e) {
                        "gender" == e.attr("for") || "payment[]" == e.attr("for") ? (e.closest(".form-group").removeClass("has-error").addClass("has-success"), e.remove()) : e.addClass("valid").closest(".form-group").removeClass("has-error").addClass("has-success")
                    },
                    submitHandler: function (e) {
                        i.show(),
                            t.hide(),
                            e[0].submit()
                    }
                });
                var a = function () {
                    $("#tab4 .form-control-static", r).each(function () { var e = $('[name="' + $(this).attr("data-display") + '"]', r); if (e.is(":radio") && (e = $('[name="' + $(this).attr("data-display") + '"]:checked', r)), e.is(":text") || e.is("textarea")) $(this).html(e.val()); else if (e.is("select")) $(this).html(e.find("option:selected").text()); else if (e.is(":radio") && e.is(":checked")) $(this).html(e.attr("data-title")); else if ("payment[]" == $(this).attr("data-display")) { var t = []; $('[name="payment[]"]:checked', r).each(function () { t.push($(this).attr("data-title")) }), $(this).html(t.join("<br>")) } })
                },
                    o = function (e, r, t) {
                        var i = r.find("li").length, o = t + 1; $(".step-title", $("#form_wizard_1")).text("Step " + (t + 1) + " of " + i), jQuery("li", $("#form_wizard_1")).removeClass("done"); for (var n = r.find("li"), s = 0; t > s; s++)jQuery(n[s]).addClass("done"); 1 == o ? $("#form_wizard_1").find(".button-previous").hide() : $("#form_wizard_1").find(".button-previous").show(), o >= i ? ($("#form_wizard_1").find(".button-next").hide(), $("#form_wizard_1").find(".button-submit").show(), a()) : ($("#form_wizard_1").find(".button-next").show(), $("#form_wizard_1").find(".button-submit").hide()), App.scrollTo($(".page-title"))
                    };
                $("#form_wizard_1").bootstrapWizard({ nextSelector: ".button-next", previousSelector: ".button-previous", onTabClick: function (e, r, t, i) { return !1 }, onNext: function (e, a, n) { return i.hide(), t.hide(), 0 == r.valid() ? !1 : void o(e, a, n) }, onPrevious: function (e, r, a) { i.hide(), t.hide(), o(e, r, a) }, onTabShow: function (e, r, t) { var i = r.find("li").length, a = t + 1, o = a / i * 100; $("#form_wizard_1").find(".progress-bar").css({ width: o + "%" }) } }), $("#form_wizard_1").find(".button-previous").hide(), $("#form_wizard_1 .button-submit").click(function () { alert("Finished! Hope you like it :)") }).hide(), $("#country_list", r).change(function () { r.validate().element($(this)) })
            }
        }
    }
}(); jQuery(document).ready(function () { FormWizard.init() });




// Initialize Stripe
// Test mode
//var stripe = Stripe('pk_test_51Ps1NjIYwqj9hFz9fwA2IciVVtd1qGUDFYTK9ssZLvDCiMNKesUW6WdRDYwq2UcLrYS6a52G2mjl8MfnbWMuke3500NurRf7cm');
// Live mode
var stripe = Stripe('pk_live_51Ps1NjIYwqj9hFz9SMTXXUFutprXgYEJygd4RQvQRuItCJwLdsxEuONjSOpYVleneFjNTySc2hl0VGevogsqGpP400O6waAfmS');
var elements = stripe.elements();

// Create an instance of the card element for credit/debit card
var cardElement = elements.create('card');
cardElement.mount('#card-element');

// Create a payment request for Google Pay and Apple Pay
var paymentRequest = stripe.paymentRequest({
    country: 'GB',
    currency: 'gbp',
    total: {
        label: 'Total Donation',
        amount: 1000, // Default amount in cents
    },
    requestPayerName: true,
    requestPayerEmail: true,
});

// Check if the browser supports Payment Request API (Google Pay/Apple Pay)
paymentRequest.canMakePayment().then(function (result) {
    if (result) {
        
        if (result.applePay) {
            // Show Apple Pay button
            document.getElementById('apple-pay-button').style.display = 'block';
            var applePayButton = elements.create('paymentRequestButton', {
                paymentRequest: paymentRequest,
                style: { paymentRequestButtonType: 'applePay' }
            });
            applePayButton.mount('#apple-pay-button');
        }
        if (result.googlePay) {
            // Show Google Pay button
            document.getElementById('google-pay-button').style.display = 'block';
            var googlePayButton = elements.create('paymentRequestButton', {
                paymentRequest: paymentRequest,
                style: { paymentRequestButtonType: 'googlePay' }
            });
            googlePayButton.mount('#google-pay-button');
        }
    } else {
        document.getElementById('apple-pay-button').style.display = 'none';
        document.getElementById('google-pay-button').style.display = 'none';
    }
});

// Handle form submission for card payments
var form = document.querySelector('form');


form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevents the default form submission

    stripe.createToken(cardElement).then(function (result) {
        if (result.error) {
            // Show error in payment form
            var displayError = document.getElementById('card-errors');
            displayError.textContent = result.error.message;
        } else {
            // Create a hidden input to hold the token
            var hiddenInput = document.createElement('input');
            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', 'stripeToken');
            hiddenInput.setAttribute('value', result.token.id);
            form.appendChild(hiddenInput);

            var firstname = document.getElementById('firstname').value;
            var surname = document.getElementById('surname').value;
            document.getElementById('nameField').value = firstname + " " + surname;

            var email = document.getElementById('email').value;
            document.getElementById('emailField').value = email;

            if (typeof selectedValue !== 'undefined') {
                selectedValue = parseInt(selectedValue);
                if (selectedValue) {
                    document.getElementById('amountField').value = selectedValue;
                } else {
                    var amount = document.getElementById('otherAmount').value;
                    selectedValue = amount;
                }
            }

            var formData = new FormData(form);
            var amountValue = formData.get('amount');

            if (amountValue == "other") {
                selectedValue = parseInt(selectedValue);
                formData.set('amount', selectedValue);
            }

            const monthlyInputElement = document.getElementById('monthly-donation-amount');
            if (monthlyInputElement) {
                let monthlyDonationAmount = document.getElementById('monthly-donation-amount').value;
                let monthlyDonationProjectName = document.getElementById('monthly-donation-project-name').value;
                const monthlyAmount = parseInt(monthlyDonationAmount);

                formData.set('amount', monthlyAmount);
                formData.set('project_name', monthlyDonationProjectName);
            }

            // Send AJAX request to process the donation
            $.ajax({
                type: 'POST',
                url: '/Donation/ProcessDonation',
                data: formData,
                contentType: false, // Don't set any content type header  
                processData: false, // Prevent jQuery from transforming the data into a query string  
                success: function (response) {
                    if (response.redirectTo) {
                        window.location.href = response.redirectTo;
                    }
                },
                error: function (error) {
                    console.log("Error: " + error);
                }
            });
        }
    });
});

// Handle Apple Pay button click
paymentRequest.on('paymentmethod', function (ev) {
    stripe.confirmCardPayment(
        '{PAYMENT_INTENT_CLIENT_SECRET}', // Replace with actual client secret from backend
        { payment_method: ev.paymentMethod.id },
        { handleActions: false }
    ).then(function (confirmResult) {
        if (confirmResult.error) {
            ev.complete('fail');
        } else {
            ev.complete('success');
            // Payment succeeded, redirect to success page
            window.location.href = '/success';
        }
    });
});

