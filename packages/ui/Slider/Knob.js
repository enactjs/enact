import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import ComponentOverride from '../ComponentOverride';

const Knob = kind({
	name: 'Knob',

	propTypes: {
		orientation: PropTypes.string,
		proportion: PropTypes.number,
		tooltipComponent: PropTypes.oneOfType([PropTypes.object, PropTypes.func]),
		value: PropTypes.number
	},

	render: ({orientation, proportion, tooltipComponent, value, ...rest}) => {
		delete rest.orientation;

		return (
			<div {...rest}>
				<ComponentOverride
					component={tooltipComponent}
					orientation={orientation}
					proportion={proportion}
				>
					{value}
				</ComponentOverride>
			</div>
		);
	}
});

export default Knob;
export {
	Knob
};
