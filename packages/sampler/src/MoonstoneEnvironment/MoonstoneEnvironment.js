// Moonstone Environment

import classnames from 'classnames';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import {Column, Cell} from '@enact/ui/Layout';
import BodyText from '@enact/moonstone/BodyText';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import {Panels, Panel, Header} from '@enact/moonstone/Panels';
import platform from '@enact/core/platform';
import {boolean, select} from '../enact-knobs';
import qs from 'query-string';

import css from './MoonstoneEnvironment.module.less';

const globalGroup = 'Global Knobs';

const reloadPage = () => {
	const {protocol, host, pathname} = window.parent.location;
	window.parent.location.href = protocol + '//' + host + pathname;
};

const PanelsBase = kind({
	name: 'MoonstoneEnvironmentPanels',

	propTypes: {
		description: PropTypes.string,
		title: PropTypes.string
	},

	styles: {
		css,
		className: 'moonstoneEnvironmentPanels'
	},

	computed: {
		className: ({styler}) => styler.append(platform.platformName)
	},

	render: ({children, description, title, ...rest}) => (
		<Panels {...rest} onApplicationClose={reloadPage}>
			<Panel className={css.panel}>
				<Header type="compact" title={title} casing="preserve" />
				<Column>
					{description ? (
						<Cell shrink component={BodyText} className={css.description}>{description}</Cell>
					) : null}
					<Cell className={css.storyCell}>{children}</Cell>
				</Column>
			</Panel>
		</Panels>
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
	'': '',
	'backgroundColorful1': '#bb3352 url("http://picsum.photos/1280/720?image=1080") no-repeat center/cover',
	'backgroundColorful2': '#4e6a40 url("http://picsum.photos/1280/720?image=1063") no-repeat center/cover',
	'backgroundColorful3': '#5985a8 url("http://picsum.photos/1280/720?image=930") no-repeat center/cover',
	'backgroundColorful4': '#71736d url("http://picsum.photos/1280/720?image=1044") no-repeat center/cover',
	'backgroundColorful5': '#547460 url("http://picsum.photos/1280/720?image=1053") no-repeat center/cover',
	'backgroundColorful6': '#7c4590 url("http://picsum.photos/1280/720?image=967") no-repeat center/cover',
	'backgroundColorful7': '#5d6542 url("http://picsum.photos/1280/720?image=1025") no-repeat center/cover',
	'backgroundColorful8': '#555 url("http://picsum.photos/1280/720") no-repeat center/cover'
};

const skins = {
	'Dark': 'dark',
	'Light': 'light'
};

const getArgs = (str) => {
	return qs.parse(str || (typeof window !== 'undefined' ? window.parent.location.search : ''));
};

// This allows any knob to be taken from the URL.
const getKnobFromArgs = (args, propName, fallbackValue) => {
	const knob = 'knob-' + propName;
	let value = fallbackValue;

	if (args && knob in args) {
		try {
			// If it's valid JSON, parse it
			value = JSON.parse(args[knob]);
		} catch (e) {
			// no handling required; allow fallbackValue to be used
		}
	}

	return value;
};

const StorybookDecorator = (story, config) => {
	// Executing `story` here allows the story knobs to register and render before the global knobs below.
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

	if (sample && sample.props && sample.props.info) {
		config.description = sample.props.info;
	}

	const args = getArgs();
	const classes = {
		aria: boolean('debug aria', DevelopmentConfig, getKnobFromArgs(args, 'debug aria')),
		layout: boolean('debug layout', DevelopmentConfig, getKnobFromArgs(args, 'debug layout')),
		spotlight: boolean('debug spotlight', DevelopmentConfig, getKnobFromArgs(args, 'debug spotlight'))
	};
	if (Object.keys(classes).length > 0) {
		classes.debug = true;
	}

	return (
		<Moonstone
			className={classnames(classes)}
			title={`${config.kind} ${config.story}`.trim()}
			description={config.description}
			locale={select('locale', locales, Config)}
			textSize={boolean('large text', Config, getKnobFromArgs(args, 'large text')) ? 'large' : 'normal'}
			highContrast={boolean('high contrast', Config, getKnobFromArgs(args, 'high contrast'))}
			style={{
				'--moon-env-background': backgroundLabelMap[select('background', backgroundLabels, Config, getKnobFromArgs(args, 'background'))]
			}}
			skin={select('skin', skins, Config, getKnobFromArgs(args, 'skin'))}
		>
			{sample}
		</Moonstone>
	);
};

const FullscreenStorybookDecorator = (story, config) => {
	const sample = story();
	const args = getArgs();
	return (
		<MoonstoneFullscreen
			title={`${config.kind} ${config.story}`.trim()}
			description={config.description}
			locale={select('locale', locales, 'en-US')}
			textSize={boolean('large text', getKnobFromArgs(args, 'large text')) ? 'large' : 'normal'}
			highContrast={boolean('high contrast', getKnobFromArgs(args, 'high contrast'))}
			style={backgroundLabelMap[select('background', backgroundLabels, getKnobFromArgs(args, 'background'))]}
			skin={select('skin', skins, getKnobFromArgs(args, 'skin'))}
		>
			{sample}
		</MoonstoneFullscreen>
	);
};

export default StorybookDecorator;
export {StorybookDecorator as Moonstone, FullscreenStorybookDecorator as MoonstoneFullscreen};
