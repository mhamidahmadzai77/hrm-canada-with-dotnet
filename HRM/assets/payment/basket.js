
function addAndRefreshBasket(id, name, amount) {
    var data = {
        Id: id,
        Name: name,
        Amount: amount
    };
    $.ajax({
        url: '/Basket/AddToBasket', // Adjust the URL to your controller and action method  
        type: 'POST',
        data: data,
        success: function (data) {

            // Update item count in badge  


            if (data.item === "New Item") {
                // Update basket item numbers
                var count;
                if (data.count != null) {
                    count = data.count ;
                }

                var totalItems = $('.total-items').text();
                if (totalItems != null || totalItems != "") {
                    totalItems = parseInt(totalItems);
                    if (totalItems != 0) {
                        count = count + 1;
                    }
                    else {
                        count = 1;
                    }
                }
                else {
                    count = count + 1;
                }
                $('.badge-danger').each(function () {
                    if ($(this).hasClass('hide')) {
                        $(this).removeClass('hide');
                    }
                });
                $('.total-items').text(count);

                // Logic for new item can be added here 

                var amountId = name + "-amount-id";
                var listItem = `<li  id="${name}"><span class="task"><span class="desc">${name}</span><span class="percent"><i class="fa fa-gbp"></i><span id="${amountId}">${amount}</span><i class="fa fa-close basket-item-close-button" onclick="removeBasketItem(${amount} , '${name}')"></i></span></span></li>`;
                // Insert the new list item before total-list-item  
                $('#total-list-item').before(listItem);

            }
            else {

                var amountId = name + "-amount-id";
                var ItemOldAmount = $('#' + amountId).text();

                let ItemSumAmount = parseInt(ItemOldAmount) + amount;
                // Update Item Amount  
                document.getElementById(amountId).innerHTML = ItemSumAmount;

            }

            var OldTotalAmount = $('#total-amount').text();
            let NewTotalAmount = parseInt(OldTotalAmount) + amount;
            $('#total-amount').text(NewTotalAmount);

        },
        error: function (xhr, status, error) {
            console.error("Error fetching the updated basket: ", error);
        }
    });

}


function removeBasketItem(amount, name) {

    var data = {
        amount: amount,
        name: name
    };
    $.ajax({
        url: '/Basket/ClearBasket', // Adjust the URL to your controller and action method  
        type: 'POST',
        data: data,
        success: function (response) {

            // Update item count in badge  


            if (response === "deleted") {
                let items = $('.badge-danger').text();
                items = parseInt(items) - 1;
                if (items == 0) {
                    $('.badge-danger').addClass('hide');
                    $('.total-items').text(0);
                    $('#total-amount').empty();
                    $('#total-amount').text('0');

                }
                else {
                    $('.badge-danger').text(items);
                    $('.total-items').text(items);
                    // Get the previous total amount and convert it to an integer  
                    let previousTotalAmount = parseInt($('#total-amount').text(), 10);

                    // Convert the amount to remove to an integer  
                    let amountToRemove = parseInt(amount, 10);

                    // Calculate the updated total amount  
                    let updatedTotalAmount = previousTotalAmount - amountToRemove;

                    // Update the total-amount field  
                    $('#total-amount').text(updatedTotalAmount);

                }
                // Remove clickd list item
                $('#' + name).remove();

            }
            else {


            }


        },
        error: function (xhr, status, error) {
            console.error("Error fetching the updated basket: ", error);
        }
    });

}


// Prevent closing the dropdown when clicking inside it  
document.querySelector('.basket-container .dropdown-menu').addEventListener('click', function (event) {
    event.stopPropagation(); // Prevent the click event from bubbling up  
});

// Optionally, add similar functionality for other interactive elements inside the dropdown menu  
document.querySelectorAll('.basket-list li').forEach(function (item) {
    item.addEventListener('click', function (event) {
        event.stopPropagation(); // Prevent the dropdown from closing when clicking an item  
    });
});  