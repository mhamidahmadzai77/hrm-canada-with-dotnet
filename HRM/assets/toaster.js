function showToast(title, content, backgroundColor) {  
    // Create toast element  
    const toast = document.createElement('div');  
    toast.className = 'toast';
    toast.style.opacity = "0.9";

    if (backgroundColor == "success") {
        toast.style.backgroundColor = "#28a745";
    }
    else if (backgroundColor == "info") {
        toast.style.backgroundColor = "#17a2b8";
    }
    if (backgroundColor == "warning") {
        toast.style.backgroundColor = "#ffc107";
    }
    if (backgroundColor == "error") {
        toast.style.backgroundColor = "#dc3545";
    }


    // Create title and content  
    const toastTitle = document.createElement('strong');  
    toastTitle.innerText = title;  
    
    const toastContent = document.createElement('div');  
    toastContent.innerText = content;  

    // Create close button with Font Awesome icon  
    const closeButton = document.createElement('button');  
    closeButton.className = 'close-btn';  
    closeButton.innerHTML = '<i class="fa fa-close"></i>'; // Font Awesome close icon  
    closeButton.onclick = function() {  
        toast.classList.add('hide');  
        setTimeout(() => {  
            toast.remove();  
        }, 500); // Time must match the transition duration in CSS  
    };  

    // Append title, content, and close button to toast  
    toast.appendChild(toastTitle);  
    toast.appendChild(toastContent);  
    toast.appendChild(closeButton);  

    // Append toast to container  
    const toastContainer = document.getElementById('toast-container');  
    toastContainer.appendChild(toast);  

    // Trigger the show transition after appending to the DOM  
    setTimeout(() => {  
        toast.classList.add('show');  
    }, 10); // Small delay to allow the browser to register the initial position  

    // Set timeout to remove toast after 3 seconds  
    setTimeout(() => {  
        toast.classList.add('hide');  
        setTimeout(() => {  
            toast.remove();  
        }, 500); // Wait for the fade-out transition to finish  
    }, 5000);  
}