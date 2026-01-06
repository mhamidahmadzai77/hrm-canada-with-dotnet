document.addEventListener('DOMContentLoaded', () => {
    const images = document.querySelectorAll('.slideshow-image');
    const imageContainer = document.querySelector('.image-container');
    const imageElement = imageContainer.querySelector('.slideshow-displayed-image');
    let currentIndex = 0;
    let intervalId;
    let timeoutId1;
    let timeoutId2;

    const showImage = (index) => {
        if (index < 0) {
            currentIndex = images.length - 1; // Go to last image  
        } else if (index >= images.length) {
            currentIndex = 0; // Go to first image  
        } else {
            currentIndex = index;
        }

        // Update the onclick to navigate to the correct URL  
        const appealUrl = images[currentIndex].getAttribute('data-appeal-url');
        imageContainer.setAttribute('onclick', `goToAppeal('${appealUrl}')`);

        const currentImage = images[currentIndex];

        // Create a new image element for the next image  
        const newImageElement = document.createElement('img');
        newImageElement.src = currentImage.src;
        newImageElement.classList.add('slideshow-image');
        newImageElement.style.position = 'absolute';
        newImageElement.style.width = '100%';
        newImageElement.style.height = 'auto';

        // Append the new image to the container  
        imageContainer.appendChild(newImageElement);

        // Trigger the fade-in for the new image and fade-out for the current image  
        newImageElement.classList.add('active');
        imageElement.classList.add('out');

        timeoutId1 = setTimeout(() => {
            imageElement.src = newImageElement.src;
            imageElement.classList.remove('out');

            timeoutId2 = setTimeout(() => {
                imageContainer.style.backgroundImage = `url(${currentImage.src})`;
                imageContainer.style.backgroundSize = 'cover';
                imageContainer.style.backgroundPosition = 'center';
            }, 500);

            newImageElement.remove();
        }, 3000);
    };


    function showImageUsingNextAndPreviousBtn(index) {
        if (index < 0) {
            currentIndex = images.length - 1; // Go to last image  
        } else if (index >= images.length) {
            currentIndex = 0; // Go to first image  
        } else {
            currentIndex = index;
        }

        // Update the onclick to navigate to the correct URL  
        const appealUrl = images[currentIndex].getAttribute('data-appeal-url');
        imageContainer.setAttribute('onclick', `goToAppeal('${appealUrl}')`);

        const currentImage = images[currentIndex];

        // Create a new image element for the next image  
        const newImageElement = document.createElement('img');
        newImageElement.src = currentImage.src;
        newImageElement.classList.add('slideshow-image');
        newImageElement.style.position = 'absolute';
        newImageElement.style.width = '100%';
        newImageElement.style.height = 'auto';

        // Append the new image to the container  
        imageContainer.appendChild(newImageElement);

        // Trigger the fade-in for the new image and fade-out for the current image  
        newImageElement.classList.add('active');
        imageElement.classList.add('out');

        timeoutId1 = setTimeout(() => {
            imageElement.src = newImageElement.src;
            imageElement.classList.remove('out');

            timeoutId2 = setTimeout(() => {
                imageContainer.style.backgroundImage = `url(${currentImage.src})`;
                imageContainer.style.backgroundSize = 'cover';
                imageContainer.style.backgroundPosition = 'center';
            }, 500);

            newImageElement.remove();
        }, 100);
    }


    // Event listeners for previous and next buttons  
    document.getElementById('prevBtn').addEventListener('mouseover', () => {
        clearInterval(intervalId);
    });

    document.getElementById('nextBtn').addEventListener('mouseover', () => {

        clearInterval(intervalId);
    });

    document.getElementById('prevBtn').addEventListener('mouseout', () => {
        intervalId = setInterval(() => {
            showImage(currentIndex + 1);
        }, 5000);
    });

    document.getElementById('nextBtn').addEventListener('mouseout', () => {
        intervalId = setInterval(() => {
            showImage(currentIndex + 1);
        }, 5000);
    });

    document.getElementById('prevBtn').addEventListener('click', () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        showImageUsingNextAndPreviousBtn(currentIndex - 1);
    });

    document.getElementById('nextBtn').addEventListener('click', () => {
        clearTimeout(timeoutId1);
        clearTimeout(timeoutId2);
        showImageUsingNextAndPreviousBtn(currentIndex + 1);
    });

    // Set initial image when the document is ready  
    if (images.length > 0) {
        imageElement.src = images[0].src;
        const initialAppealUrl = images[0].getAttribute('data-appeal-url');
        imageContainer.setAttribute('onclick', `goToAppeal('${initialAppealUrl}')`);
        imageElement.classList.add('active');

        // Set the initial background image  
        imageContainer.style.backgroundImage = `url(${images[0].src})`;
        imageContainer.style.backgroundSize = 'cover';
        imageContainer.style.backgroundPosition = 'center';
    }

    // Auto transition every 5 seconds  
    intervalId = setInterval(() => {
        showImage(currentIndex + 1);
    }, 5000);
});

function goToAppeal(url) {
    if (url) {
        window.location.href = url;
    } else {
        console.error("No URL provided");
    }
}

function addAnimation(element) {
    element.classList.add('scale-animation');
}

function removeAnimation(element) {
    element.classList.remove('scale-animation');
}

function copyCurrentURL() {

    // Get the current URL
    var currentURL = window.location.href;

    // Create a temporary input element
    var tempInput = document.createElement("input");
    tempInput.value = currentURL;
    document.body.appendChild(tempInput);

    // Select the input value and copy it to the clipboard
    tempInput.select();
    document.execCommand("copy");

    // Remove the temporary input
    document.body.removeChild(tempInput);

    // Alert the user that the URL has been copied

    showToast("", "You copied the link to clipboard", "info");
}



function shareOnFacebook() {

    // Get the current URL
    var currentURL = window.location.href;

    // Create a temporary input element

    var url = encodeURIComponent(currentURL); // URL to share  
    var title = encodeURIComponent('Share on facebook'); // Title for shared content  
    var description = encodeURIComponent('Share current page on facebook'); // Description of the content  

    var facebookShareUrl = 'https://www.facebook.com/dialog/share?app_id=YOUR_APP_ID&display=popup&href=' + url + '&Quote=' + title;

    // Open the share dialog  
    window.open(facebookShareUrl, 'Share');
}


function shareOnX() {

    // Get the current URL
    var currentURL = window.location.href;

    // Create a temporary input element
    var url = encodeURIComponent(currentURL); // URL to share  
    var text = encodeURIComponent('Join us in making a difference with Human Relief Mission!'); // Message for shared content  
    var hashtags = 'HRM,HumanReliefMission'; // Comma-separated list of hashtags  

    var twitterShareUrl = 'https://twitter.com/intent/tweet?text=' + text + '&url=' + url + '&hashtags=' + hashtags;

    // Open the share dialog in a new window  
    window.open(twitterShareUrl, 'Share');
}
