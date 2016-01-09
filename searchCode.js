var map;
var markers = []; //store the location markers we add tinyurl.com/gmproj5
var directionsDisplay;
var directionsService;
var midWaypoints = [];

var wayPoint = []; //array for holding places objects from each searchbox

//called after the google maps api is loaded
function initMap() {
    //detect user's location see: tinyurl.com/gmproj3
    var initialLocation;
    var browserSupportFlag =  new Boolean();

    //create map object
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.09024, lng: -100.712891}, //initially centered in the middle of the U.S., quickly replaced with current location
        zoom: 4
//        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    // attempt to get user location with W3C Geolocation (Preferred)
    if(navigator.geolocation) {
        browserSupportFlag = true;
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            map.setZoom(12);
        });
    }
    else { // Browser doesn't support Geolocation
        alert("Unable to determine your location.");
        browserSupportFlag = false;
        handleNoGeolocation(browserSupportFlag);
    }
    
    
    //DIRECTIONS based on directions-panel.html from tinyurl.com/gmproj2
    directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(map);
    directionsService = new google.maps.DirectionsService
    
    
    // Create the searchBoxes and link them to the UI element. from: tinyurl.com/gmproj1
    var searchBox0 = new google.maps.places.SearchBox(document.getElementById('loc1'));
    var searchBox1 = new google.maps.places.SearchBox(document.getElementById('loc2'));
    var searchBox2 = new google.maps.places.SearchBox(document.getElementById('loc3'));
    
    // Bias the SearchBox results towards current map's viewport.
    map.addListener('bounds_changed', function () {
        searchBox0.setBounds(map.getBounds());
        searchBox1.setBounds(map.getBounds());    
        searchBox2.setBounds(map.getBounds());
    });
            

    
    //if searchBox0 is used
    searchBox0.addListener('places_changed', function () {
        wayPoint[0] = searchBox0.getPlaces()[0]; //add the first place from the search
        setMarker(0, wayPoint[0].geometry.location); //was places2[0].geometry.location
        calcRoute();
    });
    
    //if searchBox1 is used
    searchBox1.addListener('places_changed', function () {
        wayPoint[1] = searchBox1.getPlaces()[0];
        //var places1 = searchBox1.getPlaces();
        setMarker(1, wayPoint[1].geometry.location);
        
        var i=0;
        while(typeof midWaypoints[i] != 'undefined')
            i++;
        
        midWaypoints[i] = wayPoint[1].geometry.location;  
        
        calcRoute();
    });
    
    //if searchBox2 is used
    searchBox2.addListener('places_changed', function () {
        wayPoint[2] = searchBox2.getPlaces()[0];
        setMarker(2, wayPoint[2].geometry.location);
          
        calcRoute();
    });
    
    
    
    //place the search boxes on the top left of the map
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('loc1'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('loc2'));
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('loc3'));
}


function setMarker(n, loc) { //sets markers[n] to the latlng object loc, creates a new marker if it doesn't exist    
    if(typeof markers[n] == 'undefined') { //if it doesn't exist
        markers[n] = new google.maps.Marker({ //create new marker
            position: loc, //a latlng object
            map: map,
            label: n.toString(),
            title: 'Hello World!',
            draggable: true
        });
    }
    else {
        markers[n].setPosition(loc);
        //marker1.setMap(null); //delete
    }    
}


function calcRoute(routeStart) {
    for(var i=0; i<3; i++) {
        if(typeof wayPoint[i] == 'undefined')
            return;
    }
    
    var actualWaypoints = [];
    for(var i=0; typeof midWaypoints[i] != 'undefined'; i++) {
        actualWaypoints[i] = {
            location: midWaypoints[i], //latlng
            stopover: true
        }
    }
  
    
    alert("calculating route");
    var start = wayPoint[0]
    var end = wayPoint[2];
    
    var request = { //https://developers.google.com/maps/documentation/javascript/directions
        origin: start.geometry.location, //latlng object
        destination: end.geometry.location,
        waypoints: actualWaypoints,
        optimizeWaypoints: true, ///VERY IMPORTANT!!! WOW example: tinyurl.com/gmproj6
        travelMode: google.maps.TravelMode.DRIVING
    }
    directionsService.route(request, function(result, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            clearMarkers();
            alert("status ok!")
            directionsDisplay.setDirections(result);
        }
    });
    
}

function clearMarkers() {
    for(var i=0; typeof markers[i] != 'undefined'; i++)
        markers[i].setMap(null);
    
}