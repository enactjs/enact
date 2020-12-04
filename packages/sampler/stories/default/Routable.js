import {action} from '@enact/storybook-utils/addons/actions';
import React from 'react';
import Heading from '@enact/ui/Heading';
import {Linkable, Routable, Route} from '@enact/ui/Routable';
import {storiesOf} from '@storybook/react';

const LinkedButton = Linkable('button');
const viewStyle = {padding: '6px', border: '1px solid black'};
const buttonStyle = {margin: '6px', padding: '6px'};

const AppView = () => (
	<div style={viewStyle}>
		<Heading>/app</Heading>
		<LinkedButton style={buttonStyle} path="./settings">Settings</LinkedButton>
		<LinkedButton style={buttonStyle} path="./home">Home</LinkedButton>
	</div>
);

const SettingsView = () => (
	<div style={viewStyle}>
		<Heading>/app/settings</Heading>
		<LinkedButton style={buttonStyle} path="./wifi">Wi-Fi</LinkedButton>
		<LinkedButton style={buttonStyle} path="./wired">Wired</LinkedButton>
		<LinkedButton style={buttonStyle} path="./bluetooth">Bluetooth</LinkedButton>
	</div>
);
const HomeView = () => (<Heading style={viewStyle}>/app/home</Heading>);

const WifiView = () => (
	<div style={viewStyle}>
		<Heading>/app/settings/wifi</Heading>
		<LinkedButton style={buttonStyle} path="/app">Back To App</LinkedButton>
	</div>
);
const WiredView = () => (
	<div style={viewStyle}>
		<Heading>/app/settings/wired</Heading>
		<LinkedButton style={buttonStyle} path="/app">Back To App</LinkedButton>
	</div>
);
const BluetoothView = () => (
	<div style={viewStyle}>
		<Heading>/app/settings/blutooth</Heading>
		<LinkedButton style={buttonStyle} path="/app">Back To App</LinkedButton>
	</div>
);

const RoutableViews = Routable({navigate: 'onNavigate'}, ({children}) => <>{children}</>);

storiesOf('UI', module)
	.add(
		'Route',
		() => {
			let [path, setPath] = React.useState('/app');
			const handleNavigate = (ev) => {
				action('onNavigate')(ev);
				setPath(ev.path);
			};
			return (
				// eslint-disable-next-line react/jsx-no-bind
				<RoutableViews onNavigate={handleNavigate} path={path}>
					<Route path="app" component={AppView}>
						<Route path="settings" component={SettingsView}>
							<Route path="wifi" component={WifiView} />
							<Route path="wired" component={WiredView} />
							<Route path="bluetooth" component={BluetoothView} />
						</Route>
						<Route path="home" component={HomeView} />
					</Route>
				</RoutableViews>
			);
		},
		{
			info: {
				text: 'Basic usage of Route'
			}
		}
	);
