//:::JQUERY:::
$(document).ready(function() {
    console.log('jquery ready');
    
    $('#ham').click(function(){
        var panel = $("#directionsPanel");
        console.log("ham button click");
        
        if(!panel.hasClass('disabled')) {//if not disabled
            panel.toggleClass('hidden');
        }
        
//        $("#directionsPanel").animate({
//            left: '0px'
//        }, 200);
    });
});