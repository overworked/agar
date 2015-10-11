import React, { Component } from 'react';
import superagent from 'superagent';
import jsonp from 'superagent-jsonp';

nokia.Settings.set('app_id', 'gg7K9ZNHGDxtTjp04GO7');
nokia.Settings.set('app_code', 'y5vrY3rXNdVVd9eT_G1K7w');

let colors = [
	'rgba(50, 255, 255, 0.7)',
	'rgba(255, 50, 255, 0.7)',
	'rgba(255, 255, 50, 0.7)'
]

export default class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			position: {
				longitude: 0,
				latitude: 0
			},
			map: null,
			marker: null,
			radius: 3,
			color: colors[Math.floor(Math.random()*3)]
		};

		setInterval(() => {
			var success = (pos) => { this.setState({position: {
				longitude: pos.coords.longitude,
				latitude: pos.coords.latitude
			}}) };
			navigator.geolocation.getCurrentPosition(success, null, {
				enableHighAccuracy: true
			});
		}, 100);
	}
	componentDidMount() {
		var coords = new nokia.maps.geo.Coordinate(this.state.position.latitude, this.state.position.longitude);

		let map = new nokia.maps.map.Display(
			document.getElementById('mapContainer'), {
				zoomLevel: 20,
				center: coords
			}
		);
		let marker = new nokia.maps.map.Circle(coords, 3, {precision: 100, brush: {color: 'rgba(255, 252, 50, 0.7)'}, pen: {lineWidth: 0}});

		map.objects.add(marker);

		window.setInterval(function(){
			retrieveOthersLocations();
		 	sendSelfLocation();
		}, 2000);
		this.setState({map, marker});
	}
	render() {
		var coords = new nokia.maps.geo.Coordinate(this.state.position.latitude, this.state.position.longitude);

		if (this.state.map) {
				this.state.map.setCenter(coords);
		}

		if (this.state.marker) {
				this.state.marker.set('center', coords);
		}

		return (
			<div>
				<div id='mapContainer' />
			</div>
		);
	}
}

function sendSelfLocation() {

}

function sendSelfCallback(err, xml){
	
}


function retrieveOthersLocations(){
    // var xmlHttp = new XMLHttpRequest();
    // // xmlHttp.onreadystatechange = function() { 
    // //     if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
    // //         callback(xmlHttp.responseText);
    // // }
    // xmlHttp.open("GET", "https:prod-mmx-001.magnet.com:5221/mmxmgmt/api/v1/topics/agar.me/items?size=200", true); // true for asynchronous
    // xmlHttp.setRequestHeader("X-mmx-app-id", "7yyifl20zg2")
    // xmlHttp.setRequestHeader("X-mmx-api-key", "f6526236-eac9-4f17-ae53-81ca2564840a")
    // xmlHttp.send(callback);

    var url = 'http://jsonp.afeld.me/?url=https://prod-mmx-001.magnet.com:5221/mmxmgmt/api/v1/topics/agar.me/items&size=200';
	
	var xhr = createCORSRequest('GET', url);

	xhr.onload = function() {
		console.log(xhr.responseText);
	}

	xhr.setRequestHeader("X-mmx-app-id", "7yyifl20zg2");
	xhr.setRequestHeader("X-mmx-api-key", "f6526236-eac9-4f17-ae53-81ca2564840a")
	xhr.send();
}
function createCORSRequest(method, url) {
  var xhr = new XMLHttpRequest();
  if ("withCredentials" in xhr) {

    // Check if the XMLHttpRequest object has a "withCredentials" property.
    // "withCredentials" only exists on XMLHTTPRequest2 objects.
    xhr.open(method, url, true);

  } else if (typeof XDomainRequest != "undefined") {

    // Otherwise, check if XDomainRequest.
    // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
    xhr = new XDomainRequest();
    xhr.open(method, url);

  } else {

    // Otherwise, CORS is not supported by the browser.
    xhr = null;

  }
  return xhr;
}

	// // // console.log(debug++);
	// // // if (debug > 100) debug = 0;
	// superagent.get('http://crossorigin.me/https://prod-mmx-001.magnet.com:5221/mmxmgmt/api/v1/topics/agar.me/items?size=200')
	// .set("X-mmx-app-id", "7yyifl20zg2")
	// .set("X-mmx-api-key", "f6526236-eac9-4f17-ae53-81ca2564840a")
	// .set("Accept", "application/json")
	// .use(jsonp)
	// .end(retrieveOthersCallback);//retrieveOthersCallback);
	// // // var req = new XMLHttpRequest();

	// // req.open('GET', 'https://prod-mmx-001.magnet.com:5221/mmxmgmt/api/v1/topics/agar.me/items?size=200', true);
 // //    // Just like regular ol' XHR
 // //    req.onreadystatechange = function() {
 // //        if (req.readyState === 4) {
 // //            if (req.status >= 200 && req.status < 400) {
 // //                // JSON.parse(req.responseText) etc.
 // //            } else {
 // //                // Handle error case
 // //            }
 // //        }
 // //    };
 // //    req.send();