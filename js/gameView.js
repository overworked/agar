import React, { Component } from 'react';
import {TextField, RaisedButton} from 'material-ui';
import Store from './store.js';

window.React = React;

export default class GameView extends Component {
	render() {
    console.log(Store.data);
		return (
			<div>Hi there</div>
		);
	}
}
