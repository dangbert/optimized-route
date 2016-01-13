//https://developers.google.com/maps/documentation/javascript/reference?hl=en

//things to add:
//add an info button that displays the address when it's hovered over
//or when the location name is hovered over
//make waypoints draggable
//check for dupplicate waypoints

var map;
var markers = []; //store the location markers we add tinyurl.com/gmproj5
var directionsDisplay;
var directionsService;

var start; //start place
var end; //end place
var wayPoint = []; //array for holding places objects of each travel point. [0] = start, [1] = end, others = waypoints

//called after the google maps api is loaded
function initMap() {
    //create map object
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.09024, lng: -100.712891}, //initially centered in the middle of the US, quickly replaced with current location
        zoom: 4
//        mapTypeId: google.maps.MapTypeId.ROADMAP
    });
    
    
    // attempt to get user location with W3C Geolocation (Preferred). see: tinyurl.com/gmproj3
    var initialLocation;
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            initialLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
            map.setCenter(initialLocation);
            map.setZoom(11);
        });
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
            
    
    //useful: https://jsonformatter.curiousconcept.com/
    //if searchBox0 is used
    searchBox0.addListener('places_changed', function () {
        document.getElementById("loc1").value = ""; //clear searchbox
        
        if(exists(searchBox0.getPlaces()[0]))
            return; //don't allow a duplicate place to be added
        
        start = searchBox0.getPlaces()[0]; //add the first place from the search
        setMarker(0, start);
//        console.log(JSON.stringify(start)); //print in JSON format
        document.getElementById("startInfo").innerHTML = "<br>" + start['name']; //shortened name
        document.getElementById("startInfo").title = start['formatted_address'];
        
        //document.getElementById("startInfo").innerHTML = "<br>" + start['formatted_address'];
        calcRoute();
    });
    
    //if searchBox1 is used //
    searchBox1.addListener('places_changed', function () {
        document.getElementById("loc2").value = "";
        
        if(exists(searchBox1.getPlaces()[0]))
            return; //don't allow a duplicate place to be added
        
        if(wayPoint.length < 8) { //8 waypoints max
            wayPoint.push(searchBox1.getPlaces()[0]); //add place to end of array
            var i = wayPoint.length-1;
            setMarker(i+2, wayPoint[i]);
            document.getElementById("wayPointsInfo").innerHTML += "<li id='point" + i + "'>" + "<t class='tooltip' title='" + wayPoint[i]['formatted_address'] + "'>" +
            wayPoint[i]['name'] +
                "</t><a href='javascript:void(0)' onclick='deletePoint(this)'><img src='images/delete.png' height='10' hspace='10'></a>\
                <a href='javascript:void(0)'>"; // [X]
//            console.log("wayPoint=" + wayPoint + '\n');
            
            calcRoute();
        }
        else
            alert("Only 8 waypoints are allowed. Please remove a waypoint before adding a new one.");
    });
    
    //if searchBox2 is used
    searchBox2.addListener('places_changed', function () {
        if(exists(searchBox2.getPlaces()[0]))
            return; //don't allow a duplicate place to be added
        
        end = searchBox2.getPlaces()[0];
        document.getElementById("loc3").value = "";
        setMarker(1, end);
        document.getElementById("endInfo").innerHTML = "<br>" + end['name'];
        document.getElementById("endInfo").title = end['formatted_address'];
        calcRoute();
    });
    

    
    //place the search boxes on the top left of the map
//    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('loc1'));
//    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('loc2'));
//    map.controls[google.maps.ControlPosition.TOP_LEFT].push(document.getElementById('loc3'));
}


function calcRoute(routeStart) {
    if(typeof start == 'undefined' || typeof end == 'undefined' || typeof wayPoint[0] == 'undefined') {
        directionsDisplay.setMap(null); //in case the map was previously drawn
        for(var i=0; i<markers.length; i++)
            if(typeof markers[i] != 'undefined')
                markers[i].setMap(map); //redraw the points that were previously turned off
        return; //don't calculate route if all needed points aren't set
    }
//    printLocations();
    directionsDisplay.setMap(map);
    var actualWaypoints = [];
    for(var i=0; i<wayPoint.length; i++) { //loop through the waypoints (skip start and end places)
//        console.log("Defining actualWaypoint[" + i + "]");
        actualWaypoints[i] = { //subtract 2 to fill this array starting at [0]
            location: wayPoint[i].geometry.location, //latlng object
            stopover: true
        }
    }
    
    console.log("***calculating route");
    
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
            directionsDisplay.setDirections(result);
        }
    });
    
}


function setMarker(n, plc) { //sets markers[n] to the latlng object loc, creates a new marker if it doesn't exist
    
    if(n==0)
        var link = "http://www.googlemapsmarkers.com/v1/00FF00";
    if(n==1)
        var link = "http://www.googlemapsmarkers.com/v1/FF0000";
    if(n>1)
        var link = "http://www.googlemapsmarkers.com/v1/FFA500";
    
    if(typeof markers[n] == 'undefined') { //if it doesn't exist
        markers[n] = new google.maps.Marker({ //create new marker
            position: plc.geometry.location, //a latlng object
            map: map,
//            label: n.toString(),
            animation: google.maps.Animation.DROP,
            icon: link,
            title: n.toString(),
            draggable: true //make true later if the loc is retrieved from the marker
        });
    }
    else {
        markers[n].setPosition(plc.geometry.location);
    }    
}


function clearMarkers() {
    for(var i=0; i<markers.length; i++)
        if(typeof markers[i] != 'undefined')
            markers[i].setMap(null); //turn markers off but don't delete in case directionsDisplay is turned off
    console.log("***markers cleared");
}



function deletePoint(elem) { //tinyurl.com/gmproj8
    elem = elem.parentNode; //a ul element with id="pointn" where n is sum number. elem started as the <a> element that was clicked
    var i = parseInt(elem.id.substring(5));
                
    wayPoint.splice(i,1); //location i, remove 1 element
    markers[i+2].setMap(null);
    markers.splice(i+2, 1); //i is offset by 2 bc start and end are in front
    
    elem.parentNode.removeChild(document.getElementById("point" + i)); //delete element
    
    for(var t=i+1; document.getElementById("point" + t) != null; t++) { //fix ids of the others
        document.getElementById("point" + t).id = "point" + (t-1);
    }
    

    
    console.log("***removed waypoint[" + i + "]");
    console.log("wayPoint=" + wayPoint);
    calcRoute();
}


function printLocations() {
    console.log("Printing geometry.location of all locations");
    if(typeof start != 'undefined')
        console.log("start=" + start.geometry.location);
    else
        console.log("start=UNDEFINED");
    if(typeof end != 'undefined')
        console.log("end=" + end.geometry.location);
    else
        console.log("end=UNDEFINED");
    
    console.log("wayPoint.length=" + wayPoint.length);
    for(var i=0; i<wayPoint.length; i++)
        console.log("wayPoint[" + i + "].geometry.location=" + wayPoint[i].geometry.location);
}

function exists(plc) { //plc
    for(var i=0; i<wayPoint.length; i++) {
        console.log("checking i=" + i);
        if(wayPoint[i]['formatted_address'] == plc['formatted_address']) {
            alert("Address:\n" + "'" + wayPoint[i]['formatted_address'] + "'\nwas previously entered!\n");
            return true;
           }
    }
    if((typeof start !='undefined' && start['formatted_address'] == plc['formatted_address']) || (typeof end !='undefined' && end['formatted_address'] == plc['formatted_address'])) {
        alert("Address:\n" + "'" + plc['formatted_address'] + "'\nis your start or end point!\n");
        return true;
    }
    return false; //working :D!
    
}