import React, { Component } from 'react';
import {TextField, RaisedButton} from 'material-ui';

window.React = React;

class App extends Component {
	render() {
		return (
			<div style={{width: '100%', height: '100%', position: 'absolute'}}>
				<div style={{top: '40%', textAlign: 'center', position: 'relative'}}>
					<TextField
					  hintText="Display Name"
					  floatingLabelText="Enter a display name" />
					<RaisedButton label="Join Game" primary={true} />
				</div>
			</div>
		);
	}
};

React.render(<App />, document.getElementById('app'));
