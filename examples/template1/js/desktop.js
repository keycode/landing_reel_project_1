




var isMobile = false;


var isInIframe = (parent !== window);

document.addEventListener('DOMContentLoaded', () => {

 
  

});

function funslideup() {
    window.parent.logFromIframe("slideup");
}


function funslidedown() {
    window.parent.logFromIframe("slidedown");
}