
window.addEventListener('scroll', function () {
    
    const page_container = document.querySelector('.page-container');
    const fixed_footer = document.querySelector('.fixed-footer-donation-button');

    // Check if the content div is in view
    if (page_container.getBoundingClientRect().bottom <= window.innerHeight) {
        
        fixed_footer.style.display = 'none';
    } else {
        fixed_footer.style.display = 'block';
    }
});



