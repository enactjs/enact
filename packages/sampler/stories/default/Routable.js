import {action} from '@enact/storybook-utils/addons/actions';
import {useState} from 'react';
import ri from '@enact/ui/resolution';
import Heading from '@enact/ui/Heading';
import {Linkable, Routable, Route} from '@enact/ui/Routable';

const LinkedButton = Linkable('button');
const viewStyle = {
	padding: ri.scaleToRem(6),
	margin: ri.scaleToRem(6),
	border: '1px solid black'
};
const buttonStyle = {
	margin: ri.scaleToRem(6),
	padding: ri.scaleToRem(6)
};

const AppView = () => (
	<div style={viewStyle}>
		<Heading>/app</Heading>
		<LinkedButton style={buttonStyle} path="./settings">
			Settings
		</LinkedButton>
		<LinkedButton style={buttonStyle} path="./home">
			Home
		</LinkedButton>
	</div>
);

const SettingsView = () => (
	<div style={viewStyle}>
		<Heading>/app/settings</Heading>
		<LinkedButton style={buttonStyle} path="./wifi">
			Wi-Fi
		</LinkedButton>
		<LinkedButton style={buttonStyle} path="./wired">
			Wired
		</LinkedButton>
		<LinkedButton style={buttonStyle} path="./bluetooth">
			Bluetooth
		</LinkedButton>
	</div>
);
const HomeView = () => (
	<Heading style={viewStyle}>/app/home</Heading>
);

const SettingModuleComponents = {};
// eslint-disable-next-line enact/display-name
const SettingModuleView = (settingModuleName) => () => (
	<div style={viewStyle}>
		<Heading>/app/settings/{settingModuleName}</Heading>
		<LinkedButton style={buttonStyle} path="/app">
			Back To App
		</LinkedButton>
	</div>
);

const RoutableViews = Routable({navigate: 'onNavigate'}, ({children}) => (
	<>{children}</>
));

export default {
	title: 'UI/Routable'
};

export const _Routable = () => {
	let [path, setPath] = useState('/app');
	const handleNavigate = (ev) => {
		action('onNavigate')(ev);
		setPath(ev.path);
	};
	return (
		// eslint-disable-next-line react/jsx-no-bind
		<RoutableViews onNavigate={handleNavigate} path={path}>
			<Route path="app" component={AppView}>
				<Route path="settings" component={SettingsView}>
					{['wifi', 'wired', 'bluetooth'].map((settingModule) => {
						SettingModuleComponents[settingModule] =
							SettingModuleComponents[settingModule] ||
							SettingModuleView(settingModule);
						return (
							<Route
								key={settingModule}
								path={settingModule}
								component={SettingModuleComponents[settingModule]}
							/>
						);
					})}
				</Route>
				<Route path="home" component={HomeView} />
			</Route>
		</RoutableViews>
	);
};

_Routable.parameters = {
	info: {
		text: 'Basic usage of Routable'
	},
	controls: {
		hideNoControlsWarning: true
	}
};
