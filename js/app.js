import React, { Component } from 'react';

window.React = React;

class App extends Component {
	render() {
		return <span>Hello World</span>;
	}
};

React.render(<App />, document.getElementById('app'));
