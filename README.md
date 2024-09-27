# optimized-route
A website that uses the Google Maps API to create an optimized route between up to 25 waypoints (the traveling salesman problem). Useful for planning a roadtrip or a set of errands.

[Click here]([https://dangbert.github.io/optimized-route/?waypoint=ChIJVXealLU_xkcRja_At0z9AGY%2CChIJgTwKgJcpQg0RaSKMYcHeNsQ%2CChIJdxs61MA5jkcRmmVXBP5fVcs%2CChIJ-88eGYp1nkcRpm2C9-efi7g%2CChIJ7feaKmwD7UcRzffjOYpAeqI&start=ChIJtTeDfh9w5kcRJEWRKN1Yy6I&end=ChIJ8UNwBh-9oRQR3Y1mdkU1Nic](https://dangbert.github.io/optimized-route/?waypoint=ChIJgTwKgJcpQg0RaSKMYcHeNsQ%2CChIJ-88eGYp1nkcRpm2C9-efi7g%2CChIJ7feaKmwD7UcRzffjOYpAeqI%2CChIJdxs61MA5jkcRmmVXBP5fVcs%2CChIJVXealLU_xkcRja_At0z9AGY&start=ChIJdd4hrwug2EcRmSrV3Vo6llI&end=ChIJ8UNwBh-9oRQR3Y1mdkU1Nic)) to see an example route for a roadtrip across Europe.

#### How to use: ####
1.  Go to https://dangbert.github.io/optimized-route/
2.  Enter the start location in the "waypoints" search box.
3.  Enter up to 25 waypoint locations in the "Enter a waypoint" box in any order ([25 is the max the API allows](https://developers.google.com/maps/documentation/javascript/directions#waypoint-limits)).
4.  Enter the end location in the "Set end location" box.
5.  Mouseover a location on the left panel to view its address.
6.  Delete waypoints with the red x; change start/end by entering a new location .
7. **NEW:** bookmark the page at any point to save your route for revisiting later.

If the start, end, and at least one waypoint are all defined then the optimal route will be displayed on the map, and directions will be displayed in a panel to the right of the map.  You can hide/show the panel using the button in the top right of the panel.
