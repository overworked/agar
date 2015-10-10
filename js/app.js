import React, { Component } from 'react';
import {TextField, RaisedButton} from 'material-ui';
import GameView from './gameView.js';
import Store from './store.js';

window.React = React;

class App extends Component {
	constructor(props) {
		super(props);
	}
	onClickJoin() {
		Store.data.username = this.refs.displayNameField.getValue();
		React.render(<GameView />, document.getElementById('app'));
	}
	render() {
		return (
			<div style={{width: '100%', height: '100%', position: 'absolute'}}>
				<div style={{top: '40%', textAlign: 'center', position: 'relative'}}>
					<TextField
					  hintText="Display Name"
					  floatingLabelText="Enter a display name"
						ref="displayNameField" />
					<RaisedButton onClick={this.onClickJoin.bind(this)} label="Join Game" primary={true} />
				</div>
			</div>
		);
	}
}

React.render(<App />, document.getElementById('app'));
