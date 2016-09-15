// Moonstone Environment

import kind from 'enact-core/kind';
import React from 'react';
import MoonstoneDecorator from 'enact-moonstone/MoonstoneDecorator';
import {ActivityPanels as Panels, Panel, Header} from 'enact-moonstone/Panels';

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
					<Header type="compact" title={title} />
					<div className={css.description}>
						<p>{description}</p>
					</div>
					{children}
				</Panel>
			</Panels>
		</div>
	)
});

const Moonstone = MoonstoneDecorator(PanelsBase);

export default Moonstone;
