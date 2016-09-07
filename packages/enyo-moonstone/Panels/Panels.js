import kind from 'enyo-core/kind';
import React from 'react';

import Viewport from './Viewport';

import css from './Panels.less';

/**
 * Basic Panels component without breadcrumbs or default arranger
 *
 * @class Panels
 */
const Panels = kind({
	name: 'Panels',

	propTypes: Viewport.propTypes,

	styles: {
		css,
		classes: 'panels enyo-fit'
	},

	render: ({noAnimation, arranger, children, classes, index, ...rest}) => (
		<div {...rest} className={classes}>
			<Viewport noAnimation={noAnimation} arranger={arranger} index={index}>
				{children}
			</Viewport>
		</div>
	)
});

export default Panels;
export {Panels};
