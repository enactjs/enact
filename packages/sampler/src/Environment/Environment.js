// Environment

import classnames from 'classnames';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import BodyText from '@enact/ui/BodyText';
import {Column, Cell} from '@enact/ui/Layout';
import {boolean, select} from '@enact/storybook-utils/addons/knobs';
import qs from 'query-string';

import css from './Environment.module.less';

const globalGroup = 'Global Knobs';

const PanelsBase = kind({
	name: 'EnvironmentPanels',

	propTypes: {
		description: PropTypes.string,
		title: PropTypes.string
	},

	styles: {
		css,
		className: 'environmentPanels enact-fit enact-unselectable'
	},

	render: ({children, description, title, ...rest}) => (
		<Column {...rest}>
			<Cell component={BodyText} className={css.header} shrink>{title}</Cell>
			{description ? (
				<Cell shrink component={BodyText} className={css.description}>{description}</Cell>
			) : null}
			<Cell component="section">{children}</Cell>
		</Column>
	)
});

// NOTE: Locales taken from strawman. Might need to add more in the future.
const locales = {
	'local':                                                             '',
	'en-US - US English':                                                'en-US',
	'ko-KR - Korean':                                                    'ko-KR',
	'es-ES - Spanish, with alternate weekends':                          'es-ES',
	'am-ET - Amharic, 5 meridiems':                                      'am-ET',
	'th-TH - Thai, with tall characters':                                'th-TH',
	'ar-SA - Arabic, RTL and standard font':                             'ar-SA',
	'ur-PK - Urdu, RTL and custom Urdu font':                            'ur-PK',
	'zh-Hans-HK - Simplified Chinese, custom Hans font':                 'zh-Hans-HK',
	'zh-Hant-HK - Traditional Chinese, custom Hant font':                'zh-Hant-HK',
	'vi-VN - Vietnamese, Special non-latin font handling':               'vi-VN',
	'ta-IN - Tamil, custom Indian font':                                 'ta-IN',
	'ja-JP - Japanese, custom Japanese font':                            'ja-JP',
	'en-JP - English, custom Japanese font':                             'en-JP',
	'si-LK - Sinhala, external font family with different line metrics': 'si-LK'
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

	const {globals} = config;

	const Config = {
		defaultProps: {
			locale: 'en-US'
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

	const hasText = config.parameters && config.parameters.info && config.parameters.info.text;
	const args = getArgs();
	const classes = {
		aria: boolean('debug aria', DevelopmentConfig, getKnobFromArgs(args, 'debug aria')),
		layout: boolean('debug layout', DevelopmentConfig, getKnobFromArgs(args, 'debug layout')),
		spotlight: boolean('debug spotlight', DevelopmentConfig, getKnobFromArgs(args, 'debug spotlight'))
	};
	if (Object.keys(classes).length > 0) {
		classes.debug = true;
	}

	globals.locale = select('locale', locales, Config, globals.locale);
	globals.background = select('background', backgroundLabels, Config, getKnobFromArgs(args, 'background', globals.background));

	return (
		<PanelsBase
			className={classnames(classes)}
			title={`${config.kind}`.replace(/\//g, ' ').trim()}
			description={hasText ? config.parameters.info.text : null}
			locale={globals.locale}
			style={{
				'--env-background': backgroundLabelMap[globals.background]
			}}
			{...config.panelsProps}
		>
			{sample}
		</PanelsBase>
	);
};

export default StorybookDecorator;
export {StorybookDecorator};
