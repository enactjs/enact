import kind from '@enact/core/kind';
import React from 'react';

import Viewport from './Viewport';

import css from './Panels.less';

/**
 * Basic Panels component without breadcrumbs or default arranger
 *
 * @class Panels
 */
const PanelsBase = kind({
	name: 'Panels',

	propTypes: Viewport.propTypes,

	styles: {
		css,
		className: 'panels enact-fit'
	},

	render: ({noAnimation, arranger, children, index, ...rest}) => (
		<div {...rest}>
			<Viewport noAnimation={noAnimation} arranger={arranger} index={index}>
				{children}
			</Viewport>
		</div>
	)
});

export default PanelsBase;
export {PanelsBase as Panels, PanelsBase};
