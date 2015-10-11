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
			color: colors[Math.floor(Math.random()*3)],
			players: {}
		};
	}
	sendSelfLocation() {
		// var url = 'http://jsonp.afeld.me/?url=https://prod-mmx-001.magnet.com:5221/mmxmgmt/api/v1/topics/agar.me/publish';

		// var xhr = createCORSRequest('POST', url);

		// xhr.setRequestHeader("X-mmx-app-id", "7yyifl20zg2");
		// xhr.setRequestHeader("X-mmx-api-key", "f6526236-eac9-4f17-ae53-81ca2564840a")
		// xhr.send();
	}
	retrieveOthersLocations(){
		var url = 'http://jsonp.afeld.me/?url=https://prod-mmx-001.magnet.com:5221/mmxmgmt/api/v1/topics/agar.me/items&size=200';

		var xhr = createCORSRequest('GET', url);

		let faker = {
			items: [
				{
					meta: {
						name: 'Seth',
						radius: 4,
						colour: 'blue',
						location: [37.8705976,-122.2514462]
					}
				},
				{
					meta: {
						name: 'Andy',
						radius: 2,
						colour: 'red',
						location: [37.8706078,-122.2517215]
					}
				},
				{
					meta: {
						name: 'Clemmy',
						radius: 1,
						colour: 'green',
						location: [37.8704078,-122.2515215]
					}
				}
			]
		}

		xhr.onload = () => {
			// this.setState({players: JSON.parse(xhr.responseText).items.reduce((obj, item) => {
			this.setState({players: faker.items.reduce((obj, item) => {
				if (this.state.players[item.meta.name]) {
					this.state.players[item.meta.name].marker.destroy();
				}
				let marker = new nokia.maps.map.Circle(item.meta.location, item.meta.radius, {precision: 100, brush: {color: item.meta.colour}, pen: {lineWidth: 0}});
				this.state.map.objects.add(marker);

				obj[item.meta.name] = item.meta;
				obj[item.meta.name].marker = marker;
				return obj;
			}, {} )});
		}

		xhr.setRequestHeader("X-mmx-app-id", "7yyifl20zg2");
		xhr.setRequestHeader("X-mmx-api-key", "f6526236-eac9-4f17-ae53-81ca2564840a")
		xhr.send();
	}
	componentDidMount() {
		var coords = new nokia.maps.geo.Coordinate(this.state.position.latitude, this.state.position.longitude);

		let map = new nokia.maps.map.Display(
			document.getElementById('mapContainer'), {
				zoomLevel: 20,
				center: coords
			}
		);
		let marker = new nokia.maps.map.Circle(coords, 3, {precision: 100, brush: {color: this.state.color}, pen: {lineWidth: 0}});

		map.objects.add(marker);

		window.setInterval(() => {
			var success = (pos) => { this.setState({position: {
				longitude: pos.coords.longitude,
				latitude: pos.coords.latitude
			}}) };
			navigator.geolocation.getCurrentPosition(success, null, {
				enableHighAccuracy: true
			});

		 	this.sendSelfLocation();
			this.retrieveOthersLocations();

			var coords = new nokia.maps.geo.Coordinate(this.state.position.latitude, this.state.position.longitude);

			this.state.map.setCenter(coords);
			this.state.marker.set('center', coords);
		}, 500);

		this.setState({map, marker});
	}
	render() {
		return <div id='mapContainer' />;
	}
}

function createCORSRequest(method, url) {
	var xhr = new XMLHttpRequest();
	if ("withCredentials" in xhr) {
		xhr.open(method, url, true);
	} else if (typeof XDomainRequest != "undefined") {
		xhr = new XDomainRequest();
		xhr.open(method, url);
	} else {
		xhr = null;
	}
	return xhr;
}
