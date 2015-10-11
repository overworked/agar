import React, { Component } from 'react';

nokia.Settings.set('app_id', 'gg7K9ZNHGDxtTjp04GO7');
nokia.Settings.set('app_code', 'y5vrY3rXNdVVd9eT_G1K7w');

export default class Map extends Component {
	constructor(props) {
		super(props);
		this.state = {
			zoomLevel: 20,
			position: {
				longitude: 0,
				latitude: 0
			},
			map: null,
			marker: null
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
				zoomLevel: this.state.zoomLevel,
				center: coords
			}
		);
		let marker = new nokia.maps.map.Circle(coords, 3, {precision: 100, brush: {color: 'rgba(255, 252, 50, 0.7)'}, pen: {lineWidth: 0}});

		map.objects.add(marker);

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
