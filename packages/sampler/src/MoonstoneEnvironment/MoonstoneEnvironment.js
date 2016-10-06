// Moonstone Environment

import kind from '@enact/core/kind';
import React from 'react';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import {ActivityPanels as Panels, Panel, Header} from '@enact/moonstone/Panels';
import {select} from '@kadira/storybook-addon-knobs';

import css from './MoonstoneEnvironment.less';

const PanelsBase = kind({
	name: 'MoonstoneEnvironment',

	styles: {
		css,
		className: 'moonstone'
	},

	render: ({children, title, description, ...rest}) => (
		<div {...rest}>
			<Panels>
				<Panel>
					<Header type="compact" title={title} preserveCase />
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

	styles: {
		css,
		className: 'moonstone'
	},

	render: (props) => (
		<div {...props} />
	)
});

const Moonstone = MoonstoneDecorator(PanelsBase);
const MoonstoneFullscreen = MoonstoneDecorator(FullscreenBase);

// NOTE: Locales taken from strawman. Might need to add more in the future.
const locales = [
	'en-US',
	'ko-KR',
	'th-TH ',
	'ar-SA',
	'ur-PK',
	'zh-Hant-HK',
	'ja-JP',
	'en-JP'
];

// NOTE: Knobs cannot set locale in fullscreen mode. This allows the locale to
// be taken from the URL.
const getLocaleFromURL = () => {
	const locationParams = window.parent.location.search;

	const startIndex = locationParams.indexOf('knob-locale');
	if (startIndex > -1) {
		const keyIndex = locationParams.indexOf('=', startIndex);
		const valueIndex = locationParams.indexOf('&', keyIndex);

		return locationParams.substring(keyIndex + 1, valueIndex);
	}

	return 'en-US';
};

const StorybookDecorator = (story, config) => {

	const sample = story();
	return (
		<Moonstone
			title={config.kind + ' ' + config.story}
			description={config.description}
			locale={select('locale', locales, getLocaleFromURL())}
		>
			{sample}
		</Moonstone>
	);
};

const FullscreenStorybookDecorator = (story, config) => {
	const sample = story();
	return (
		<MoonstoneFullscreen
			title={config.kind + ' ' + config.story}
			description={config.description}
			locale={select('locale', locales, getLocaleFromURL())}
		>
			{sample}
		</MoonstoneFullscreen>
	);
};

export default StorybookDecorator;
export {StorybookDecorator as Moonstone, FullscreenStorybookDecorator as MoonstoneFullscreen};
