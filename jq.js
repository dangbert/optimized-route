//:::JQUERY:::
$(document).ready(function() {
    console.log('jquery ready');
    
    $('#directionsPanel').click(function(){
        console.log("directionsPanel click");
        $('this').toggleClass('off');
    });
});