import React, { Component } from 'react';
import Store from './store.js';
import $ from 'jquery';

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
			radius: 1,
			color: colors[Math.floor(Math.random()*3)],
			players: {}
		};
	}
	sendSelfLocation() {
		var url = 'http://localhost:3000/api/publish';
		$.ajax({
		  type: "POST",
		  url: url,
			data: {
				content: {
					name: Store.data.username,
					location: [this.state.position.latitude, this.state.position.longitude],
					radius: this.state.radius,
					colour: this.state.color
				}
			},
		  success: function() {
				console.log('done');
			},
			dataType: 'json'
		});
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
						location: [37.870540,-122.2514415]
					}
				},
				{
					meta: {
						name: 'Clemmy',
						radius: 3,
						colour: 'green',
						location: [37.8704078,-122.2515215]
					}
				},
				{
					meta: {
						name: 'eatMe',
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

			var success = (pos) => { this.setState(
				{
					position: {
						longitude: pos.coords.longitude,
						latitude: pos.coords.latitude
					}
				});

				var selfPlayer = {
					name: Store.data.username,
					radius: this.state.radius,
					colour: this.state.colour,
					location: [this.state.position.latitude, this.state.position.longitude],
					marker: this.state.marker
				};
				for (var player in this.state.players) {
					// for (var player2 in this.state.players) {
						// if (this.state.players[player1].radius > this.state.players[player2].radius) {
							if (detectCollision(selfPlayer, this.state.players[player])) {
								this.state.players[player].marker.destroy();
								// this.state.radius += this.state.players[player].radius;
								this.setState({
									radius: this.state.players[player].radius
								});
							}
						// }
					// }
				}
			};

			navigator.geolocation.getCurrentPosition(success, null, {
				enableHighAccuracy: true
			});
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
		let marker = new nokia.maps.map.Circle(coords, this.state.radius, {precision: 100, brush: {color: this.state.color}, pen: {lineWidth: 0}});

		map.objects.add(marker);

		window.setInterval(() => {
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

function detectCollision(biggerPlayer, smallerPlayer) {
  var distanceAB = biggerPlayer.marker.center.distance(smallerPlayer.marker.center);
	return biggerPlayer.radius >= distanceAB + 0.4 * smallerPlayer.radius;
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
