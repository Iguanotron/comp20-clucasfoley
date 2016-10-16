var map;

var myLat = 0;
var myLng = 0;
var me;

var marker;
var options = {
	zoom: 9,
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
			marker = new google.maps.Marker({
				position: me,
				title: "I am here"
			});
			marker.setMap(map);
		});
	} else {
		alert('Geolocation not supported by your browser :\'(');
	}
}

function init() {
	map = new google.maps.Map(document.getElementById('map'), options);
	locateMe();
}
