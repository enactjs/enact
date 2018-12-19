// Moonstone Environment

import classnames from 'classnames';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import {Panels, Panel, Header} from '@enact/moonstone/Panels';
import {boolean, select} from '../enact-knobs';
import {selectV2} from '@storybook/addon-knobs';

import css from './MoonstoneEnvironment.less';

const globalGroup = 'Global Knobs';

const reloadPage = () => {
	const {protocol, host, pathname} = window.parent.location;
	window.parent.location.href = protocol + '//' + host + pathname;
};

const PanelsBase = kind({
	name: 'MoonstoneEnvironment',

	propTypes: {
		description: PropTypes.string,
		title: PropTypes.string
	},

	render: ({children, title, description, ...rest}) => (
		<div {...rest}>
			<Panels onApplicationClose={reloadPage}>
				<Panel className={css.panel}>
					<Header type="compact" title={title} casing="preserve" />
					{description ? (
						<div className={css.description}>
							<p>{description}</p>
						</div>
					) : null}
					{children}
				</Panel>
			</Panels>
		</div>
	)
});

const FullscreenBase = kind({
	name: 'MoonstoneEnvironment',

	render: (props) => (
		<div {...props} />
	)
});

const Moonstone = MoonstoneDecorator({overlay: false}, PanelsBase);
const MoonstoneFullscreen = MoonstoneDecorator({overlay: false}, FullscreenBase);

// NOTE: Locales taken from strawman. Might need to add more in the future.
const locales = {
	'local':                                                '',
	'en-US - US English (Default)':                         'en-US',
	'ko-KR - Korean':                                       'ko-KR',
	'es-ES - Spanish, with alternate weekends':             'es-ES',
	'am-ET - Amharic, 6 meridiems':                         'am-ET',
	'th-TH - Thai, with tall characters':                   'th-TH',
	'ar-SA - Arabic, RTL and standard font':                'ar-SA',
	'ur-PK - Urdu, RTL and custom Urdu font':               'ur-PK',
	'zh-Hant-HK - Traditional Chinese, custom Hant font':   'zh-Hant-HK',
	'vi-VN - Vietnamese, Special non-latin font handling':  'vi-VN',
	'ja-JP - Japanese, custom Japanese font':               'ja-JP',
	'en-JP - English, custom Japanese font':                'en-JP'
};

// This mapping/remapping is necessary to support objects being used as select-knob values, since
// they cannot be safely URL encoded during the knob saving/linking process.
const backgroundLabels = {
	'Default (Based on Skin)':  '',
	'Strawberries (Red)':       'backgroundColorful1',
	'Tunnel (Green)':           'backgroundColorful2',
	'Mountains (Blue)':         'backgroundColorful3',
	'Misty River':              'backgroundColorful4',
	'Turbulant Tides':          'backgroundColorful5',
	'Space Station':            'backgroundColorful6',
	'Warm Pup':                 'backgroundColorful7',
	'Random':                   'backgroundColorful8'
};

// Values of `backgroundLabels` must be kept in sync with keys of `backgroundLabelMap`.
const backgroundLabelMap = {
	'': {},
	'backgroundColorful1': {background: '#bb3352 url("https://picsum.photos/1280/720?image=1080") no-repeat center/cover'},
	'backgroundColorful2': {background: '#4e6a40 url("https://picsum.photos/1280/720?image=1063") no-repeat center/cover'},
	'backgroundColorful3': {background: '#5985a8 url("https://picsum.photos/1280/720?image=930") no-repeat center/cover'},
	'backgroundColorful4': {background: '#71736d url("https://picsum.photos/1280/720?image=1044") no-repeat center/cover'},
	'backgroundColorful5': {background: '#547460 url("https://picsum.photos/1280/720?image=1053") no-repeat center/cover'},
	'backgroundColorful6': {background: '#7c4590 url("https://picsum.photos/1280/720?image=967") no-repeat center/cover'},
	'backgroundColorful7': {background: '#5d6542 url("https://picsum.photos/1280/720?image=1025") no-repeat center/cover'},
	'backgroundColorful8': {background: '#555 url("https://picsum.photos/1280/720") no-repeat center/cover'}
};

const skins = {
	'Dark': 'dark',
	'Light': 'light'
};

const debugAriaTypes = {
	'': '',
	'All': 'all',
	'Live region attributes': 'live',
	'Relationship attributes': 'relationship',
	'Role': 'role',
	'Widget attributes': 'widget'
};

// NOTE: Knobs cannot set locale in fullscreen mode. This allows any knob to be taken from the URL.
const getPropFromURL = (propName, fallbackValue) => {
	propName = encodeURI(propName);
	const locationParams = window.parent.location.search;

	const startIndex = locationParams.indexOf('knob-' + propName);
	if (startIndex > -1) {
		const keyIndex = locationParams.indexOf('=', startIndex);

		if (locationParams.indexOf('&', keyIndex) > -1 ) {
			const valueIndex = locationParams.indexOf('&', keyIndex);
			return locationParams.substring(keyIndex + 1, valueIndex);
		} else {
			return locationParams.substring(keyIndex + 1, locationParams.length);
		}
	}

	return fallbackValue;
};

const StorybookDecorator = (story, config) => {
	const sample = story();
	const Config = {
		defaultProps: {
			locale: 'en-US',
			'large text': false,
			'high contrast': false,
			skin: 'dark'
		},
		groupId: globalGroup
	};

	const DevelopmentConfig = {
		defaultProps: {
			'debug aria': false,
			'debug layout': false,
			'debug spotlight': false
		},
		groupId: 'Development'
	};

	const debugAriaType = select('debug aria type', debugAriaTypes, DevelopmentConfig, getPropFromURL('debugAriaType'));

	let classes = {
		aria: boolean('debug aria', DevelopmentConfig, (getPropFromURL('debug aria') === 'true')),
		layout: boolean('debug layout', DevelopmentConfig, (getPropFromURL('debug layout') === 'true')),
		spotlight: boolean('debug spotlight', DevelopmentConfig, (getPropFromURL('debug spotlight') === 'true'))
	};

	classes = Object.assign({[debugAriaType]: classes.aria}, classes);

	if (Object.keys(classes).length > 0) {
		classes.debug = true;
	}

	return (
		<Moonstone
			className={classnames(classes)}
			title={`${config.kind} ${config.story}`.trim()}
			description={config.description}
			locale={selectV2('locale', locales, 'en-US', globalGroup)}
			textSize={boolean('large text', Config, (getPropFromURL('large text') === 'true')) ? 'large' : 'normal'}
			highContrast={boolean('high contrast', Config, (getPropFromURL('high contrast') === 'true'))}
			style={backgroundLabelMap[select('background', backgroundLabels, Config, getPropFromURL('background'))]}
			skin={select('skin', skins, Config, getPropFromURL('skin'))}
		>
			{sample}
		</Moonstone>
	);
};

const FullscreenStorybookDecorator = (story, config) => {
	const sample = story();
	return (
		<MoonstoneFullscreen
			title={`${config.kind} ${config.story}`.trim()}
			description={config.description}
			locale={selectV2('locale', locales, 'en-US', globalGroup)}
			textSize={boolean('large text', (getPropFromURL('large text') === 'true')) ? 'large' : 'normal'}
			highContrast={boolean('high contrast', (getPropFromURL('high contrast') === 'true'))}
			style={backgroundLabelMap[select('background', backgroundLabels, getPropFromURL('background'))]}
			skin={select('skin', skins, getPropFromURL('skin'))}
		>
			{sample}
		</MoonstoneFullscreen>
	);
};

export default StorybookDecorator;
export {StorybookDecorator as Moonstone, FullscreenStorybookDecorator as MoonstoneFullscreen};
