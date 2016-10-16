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
}

var stations = {
	'South Station':     {lat: 42.352271,   lon: -71.05524200000001},
	'Andrew':            {lat: 42.330154,   lon: -71.057655},
	'Porter Square':     {lat: 42.3884,     lon: -71.11914899999999},
	'Harvard Square':    {lat: 42.373362,   lon: -71.118956},
	'JFK/UMass':         {lat: 42.320685,   lon: -71.052391},
	'Savin Hill':        {lat: 42.31129,    lon: -71.053331},
	'Park Street':       {lat: 42.35639457, lon: -71.0624242},
	'Broadway':          {lat: 42.342622,   lon: -71.056967},
	'North Quincy':      {lat: 42.275275,   lon: -71.029583},
	'Shawmut':           {lat: 42.29312583, lon: -71.06573796000001},
	'Davis':             {lat: 42.39674,    lon: -71.121815},
	'Alewife':           {lat: 42.395428,   lon: -71.142483},
	'Kendall/MIT':       {lat: 42.36249079, lon: -71.08617653},
	'Charles/MGH':       {lat: 42.361166,   lon: -71.070628},
	'Downtown Crossing': {lat: 42.355518,   lon: -71.060225},
	'Quincy Center':     {lat: 42.251809,   lon: -71.005409},
	'Quincy Adams':      {lat: 42.233391,   lon: -71.007153},
	'Ashmont':           {lat: 42.284652,   lon: -71.06448899999999},
	'Wollaston':         {lat: 42.2665139,  lon: -71.0203369},
	'Fields Corner':     {lat: 42.300093,   lon: -71.061667},
	'Central Square':    {lat: 42.365486,   lon: -71.103802},
	'Braintree':         {lat: 42.2078543,  lon: -71.0011385}
}

function setStationMarker(stationName) {
	var marker = new google.maps.Marker({
		position: new google.maps.LatLng(
			stations[stationName].lat, stations[stationName].lon),
		title: stationName
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
}

function getSchedule(stationName) {
	return stationName + ": No schedule yet!"
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
	return "The nearest station, " + nearestStation + ", is " + nearestDistance + " miles away (as the crow flies)";
}

function toRad(x) {
	return x * Math.PI / 180;
}

function myDistanceFrom(position) {
	var R = 3959; // Earth's radius, in miles
	var lat1 = toRad(myLat);
	var lat2 = toRad(position.lat);
	var lon1 = toRad(myLng);
	var lon2 = toRad(position.lon);
	var dLat = lat2 - lat1;
	var dLon = lon2 - lon1;
	var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
}