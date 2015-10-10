import React, { Component } from 'react';
import {TextField, RaisedButton} from 'material-ui';
import Store from './store.js';
import Map from './map.js';

window.React = React;

export default class GameView extends Component {
	render() {
		return (
			<Map />
		);
	}
}
