
function displaySearchBox() {
    var search = document.getElementById('search');
    var searchIcon = document.getElementById('search-icon');
    var searchBar = document.getElementById('top-search-bar');
    var searchListItem = document.getElementById('search-list-item');

    // Toggle visibility of the search bar  
    if (searchIcon.className === "icon-magnifier") {
        // Show the search bar with animation  
        searchBar.classList.add('show'); // Add the class to show  
        searchListItem.style.backgroundColor = "#9966cc"; // Change background color  
        searchIcon.className = "glyphicon glyphicon-remove"; // Change icon   

        // Set a timeout to allow the DOM to update before focusing  
        setTimeout(function () {
            search.focus();
        }, 0); // Delay focus slightly to allow rendering  
    } else {
        // Hide the search bar with animation  
        searchBar.classList.remove('show'); // Remove the class to hide  
        searchListItem.style.backgroundColor = "#660199"; // Change background color  
        searchIcon.className = "icon-magnifier"; // Change icon  
    }
}  

