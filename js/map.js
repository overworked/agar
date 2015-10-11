import React, { Component } from 'react';

nokia.Settings.set('app_id', 'gg7K9ZNHGDxtTjp04GO7');
nokia.Settings.set('app_code', 'y5vrY3rXNdVVd9eT_G1K7w');

var debug = 0;
var debug2 = 0;

export default class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			zoomLevel: 20,
			center: [52.51, 13.4]
		};
	}
	componentDidMount() {
		var map = new nokia.maps.map.Display(
			document.getElementById('mapContainer'), {
				zoomLevel: this.state.zoomLevel,
				center: this.state.center
			}
		);
		var marker = new nokia.maps.map.Circle([52.51, 13.4], 3, {precision: 100, brush: {color: 'rgba(255, 252, 50, 0.7)'}, pen: {lineWidth: 0}});
		map.objects.add(marker);

		window.setInterval(function(){
			retrieveOthersLocations();
		 	sendSelfLocation();
		}, 2000);
	}
	render() {
		return (
			<div id='mapContainer' />
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