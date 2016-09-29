// Moonstone Environment

import kind from '@enact/core/kind';
import React from 'react';
import MoonstoneDecorator from '@enact/moonstone/MoonstoneDecorator';
import {ActivityPanels as Panels, Panel, Header} from '@enact/moonstone/Panels';

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

const StorybookDecorator = (story, config) => {
	return (
		<Moonstone title={config.kind + ' ' + config.story} description={config.description}>
			{story()}
		</Moonstone>
	);
};

const FullscreenStorybookDecorator = (story, config) => {
	return (
		<MoonstoneFullscreen title={config.kind + ' ' + config.story} description={config.description}>
			{story()}
		</MoonstoneFullscreen>
	);
};

export default StorybookDecorator;
export {StorybookDecorator as Moonstone, FullscreenStorybookDecorator as MoonstoneFullscreen};
