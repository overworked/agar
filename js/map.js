import React, { Component } from 'react';

nokia.Settings.set('app_id', 'gg7K9ZNHGDxtTjp04GO7');
nokia.Settings.set('app_code', 'y5vrY3rXNdVVd9eT_G1K7w');

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
	}
	render() {
		return (
			<div id='mapContainer' />
		);
	}
}
