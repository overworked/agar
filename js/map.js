import React, { Component } from 'react';

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
	// console.log(debug++);
	// if (debug > 100) debug = 0;
	httpGetAsync("https://prod-mmx-001.magnet.com:5221/mmxmgmt/api/v1/topics/agar.me/items?size=200", sendSelfCallback())
}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function() { 
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true); // true for asynchronous 
    xmlHttp.setRequestHeader("x-mmx-app-id", "7yyifl20zg2")
    xmlHttp.setRequestHeader("x-mmx-api-key", "f6526236-eac9-4f17-ae53-81ca2564840a")
    xmlHttp.send(null);
}

function sendSelfCallback(xml){
	console.log(xml)
}

function retrieveOthersLocations(){
	console.log(debug2--);
	if (debug2 < -100) debug2 = 0;
}