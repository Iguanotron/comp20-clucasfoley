var map;

var myLat = 0;
var myLng = 0;
var myMarker;
var me;

var infowindow = new google.maps.InfoWindow();
var options = {
	zoom: 10,
	center: me,
	mapTypeId: google.maps.MapTypeId.ROADMAP
};

function locateMe() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function(position) {
			myLat = position.coords.latitude;
			myLng = position.coords.longitude;
			me = new google.maps.LatLng(myLat, myLng);
			map.panTo(me);
			myMarker = new google.maps.Marker({
				position: me,
				title: "My location"
			});
			myMarker.setMap(map);
			google.maps.event.addListener(myMarker, 'click', function() {
				infowindow.setContent(getNearestStation());
				infowindow.open(map, myMarker);
			});
		});
	} else {
		alert('Geolocation not supported by your browser :\'(');
	}
}

function init() {
	map = new google.maps.Map(document.getElementById('map'), options);
	locateMe();
	renderStations();
	updateTrips();
	setInterval(updateTrips, 30000); // Every 30 sec
}

var stations = {
	'South Station':     new google.maps.LatLng(42.352271,   -71.05524200000001),
	'Andrew':            new google.maps.LatLng(42.330154,   -71.057655),
	'Porter Square':     new google.maps.LatLng(42.3884,     -71.11914899999999),
	'Harvard Square':    new google.maps.LatLng(42.373362,   -71.118956),
	'JFK/UMass':         new google.maps.LatLng(42.320685,   -71.052391),
	'Savin Hill':        new google.maps.LatLng(42.31129,    -71.053331),
	'Park Street':       new google.maps.LatLng(42.35639457, -71.0624242),
	'Broadway':          new google.maps.LatLng(42.342622,   -71.056967),
	'North Quincy':      new google.maps.LatLng(42.275275,   -71.029583),
	'Shawmut':           new google.maps.LatLng(42.29312583, -71.06573796000001),
	'Davis':             new google.maps.LatLng(42.39674,    -71.121815),
	'Alewife':           new google.maps.LatLng(42.395428,   -71.142483),
	'Kendall/MIT':       new google.maps.LatLng(42.36249079, -71.08617653),
	'Charles/MGH':       new google.maps.LatLng(42.361166,   -71.070628),
	'Downtown Crossing': new google.maps.LatLng(42.355518,   -71.060225),
	'Quincy Center':     new google.maps.LatLng(42.251809,   -71.005409),
	'Quincy Adams':      new google.maps.LatLng(42.233391,   -71.007153),
	'Ashmont':           new google.maps.LatLng(42.284652,   -71.06448899999999),
	'Wollaston':         new google.maps.LatLng(42.2665139,  -71.0203369),
	'Fields Corner':     new google.maps.LatLng(42.300093,   -71.061667),
	'Central Square':    new google.maps.LatLng(42.365486,   -71.103802),
	'Braintree':         new google.maps.LatLng(42.2078543,  -71.001138)
}

var redLinePaths = [
	[
		'Alewife',
		'Davis',
		'Porter Square',
		'Harvard Square',
		'Central Square',
		'Kendall/MIT',
		'Charles/MGH',
		'Park Street',
		'Downtown Crossing',
		'South Station',
		'Broadway',
		'Andrew',
		'JFK/UMass'
	],
	[
		'JFK/UMass',
		'North Quincy',
		'Wollaston',
		'Quincy Center',
		'Quincy Adams',
		'Braintree'
	],
	[
		'JFK/UMass',
		'Savin Hill',
		'Fields Corner',
		'Shawmut',
		'Ashmont'
	]
];

var apiUnavailable = true;
var trips = [];
var request = new XMLHttpRequest();

function setStationMarker(stationName) {
	var markerImage = {
		url: "t-icon.png",
		anchor: new google.maps.Point(11, 11) // center the icon
	}
	var marker = new google.maps.Marker({
		position: stations[stationName],
		title: stationName,
		icon: markerImage
	});
	marker.setMap(map);
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(getSchedule(stationName));
		infowindow.open(map, marker);
	});
}

function renderStations() {
	for (stationName in stations) {
		setStationMarker(stationName);
	}
	for (var i = 0; i < redLinePaths.length; i++) {
		linkStations(redLinePaths[i]);
	}
}

function getSchedule(stationName) {
	if (apiUnavailable) {
		return "<h3>No data available at this time. Try again soon!</h3>";
	}
	var schedule = {
		"Braintree": [],
		"Ashmont": [],
		"Alewife": []
	};
	for (var i = 0; i < trips.length; i++) {
		for (var j = 0; j < trips[i].Predictions.length; j++) {
			if (trips[i].Predictions[j].Stop === stationName) {
				schedule[trips[i].Destination].push(trips[i].Position.Timestamp + trips[i].Predictions[j].Seconds);
			}
		}
	}
	var currentDate = new Date();
	var currentTime = currentDate.getTime() / 1000;
	var output = "<h1>" + stationName + "</h1>" +
		"As of " + currentDate.toTimeString() + "<br/>";

	for (destination in schedule) {
		if (schedule[destination].length > 0) {
			output += "<h4>Trains to " + destination + ":</h4>";
			for (var i = 0; i < schedule[destination].length; i++) {
				var arrivalTime = new Date(schedule[destination][i]);
				output += "Arriving in " + Math.floor((schedule[destination][i] - currentTime) / 60) + " minutes<br/>";
			}
		} else {
			output += "<h4>No trains to " + destination + "</h4>";
		}
	}
	return output;
}

function getNearestStation() {
	var nearestStation;
	var nearestDistance = Infinity;
	var thisDistance;
	for (stationName in stations) {
		thisDistance = myDistanceFrom(stations[stationName]);
		if (thisDistance < nearestDistance) {
			nearestStation = stationName;
			nearestDistance = thisDistance;
		}
	}
	//return nearestDistance + " miles from " + nearestStation + " (as the crow flies)";
	return "<h3>You are here!</h3>" +
		"<p>Nearest T station (as the crow flies):</p>" + 
		"<h1 style=\"text-align: center\">" + nearestStation + "</h1>";
}

function toRad(x) {
	return x * Math.PI / 180;
}

function myDistanceFrom(position) {
	// position should be a LatLng
	var R = 3959; // Earth's radius, in miles
	var lat1 = toRad(myLat);
	var lat2 = toRad(position.lat());
	var lng1 = toRad(myLng);
	var lng2 = toRad(position.lng());
	var dLat = lat2 - lat1;
	var dLng = lng2 - lng1;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}

function linkStations(stationPath) {
	var path = [];
	for (var i = 0; i < stationPath.length; i++) {
		path[i] = stations[stationPath[i]];
	}
	var line = new google.maps.Polyline({
		path: path,
		geodesic: true,
		strokeColor: '#FF0000',
		strokeOpacity: 1.0,
		strokeWeight: 3
	});
	line.setMap(map);
}

function updateTrips() {
	request.open('get', 'https://rocky-taiga-26352.herokuapp.com/redline.json', true);
	request.onreadystatechange = function () {
		if (this.readyState == 4) {
			var data = JSON.parse(this.responseText);
			if (data.TripList) { // valid data was received
				apiUnavailable = true; // while trips is being updated
				trips = data.TripList.Trips;
				apiUnavailable = false;
			}
		}
	}
	request.send();
}
