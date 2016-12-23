import {withRequired, extendPropType} from '@enact/ui/validators';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import React from 'react';

const stepped = withRequired(function (props, propName, component) {
	const value = props[propName];
	if (value != null) {
		if ((value - props.min) % props.step !== 0) {
			return new Error(
				`The min-adjusted ${propName} of ${component} must be evenly divisible by step`
			);
		}
	}
});

const steppedNumber = withRequired(
	extendPropType(React.PropTypes.number, stepped)
);

const validValue = withRequired(
	extendPropType(stepped, checkDefaultBounds)
);

export {stepped, steppedNumber, validValue};
