// Moonstone Environment

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import {Panels, Panel, Header} from '@enact/moonstone/Panels';
import {boolean, select} from '@kadira/storybook-addon-knobs';

import css from './MoonstoneEnvironment.less';

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
				<Panel>
					<Header type="compact" title={title} casing="preserve" />
					<div className={css.description}>
						<p>{description}</p>
					</div>
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
	'local': 'local',
	'en-US': 'en-US - US English',
	'ko-KR': 'ko-KR - Korean',
	'es-ES': 'es-ES - Spanish, with alternate weekends',
	'th-TH': 'th-TH - Thai, with tall characters',
	'ar-SA': 'ar-SA - Arabic, RTL and standard font',
	'ur-PK': 'ur-PK - Urdu, RTL and custom Urdu font',
	'zh-Hant-HK': 'zh-Hant-HK - Traditional Chinese, custom Hant font',
	'ja-JP': 'ja-JP - Japanese, custom Japanese font',
	'en-JP': 'en-JP - English, custom Japanese font'
};

const skins = {
	moonstone: 'Dark',
	'moonstone-light': 'Light'
};

// NOTE: Knobs cannot set locale in fullscreen mode. This allows the locale to
// be taken from the URL.
const getLocaleFromURL = () => {
	const locationParams = window.parent.location.search;

	const startIndex = locationParams.indexOf('knob-locale');
	if (startIndex > -1) {
		const keyIndex = locationParams.indexOf('=', startIndex);

		if (locationParams.indexOf('&', keyIndex) > -1 ) {
			const valueIndex = locationParams.indexOf('&', keyIndex);
			return locationParams.substring(keyIndex + 1, valueIndex);
		} else {
			return locationParams.substring(keyIndex + 1, locationParams.length);
		}
	}

	return 'en-US';
};

const StorybookDecorator = (story, config) => {
	const sample = story();
	return (
		<Moonstone
			title={`${config.kind} ${config.story}`.trim()}
			description={config.description}
			locale={select('locale', locales, getLocaleFromURL())}
			textSize={boolean('large text', false) ? 'large' : 'normal'}
			skin={select('skin', skins, 'dark')}
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
			locale={select('locale', locales, getLocaleFromURL())}
			textSize={boolean('large text', false) ? 'large' : 'normal'}
			skin={select('skin', skins, 'dark')}
		>
			{sample}
		</MoonstoneFullscreen>
	);
};

export default StorybookDecorator;
export {StorybookDecorator as Moonstone, FullscreenStorybookDecorator as MoonstoneFullscreen};
