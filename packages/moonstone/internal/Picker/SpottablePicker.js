import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';
import Spottable from '@enact/spotlight/Spottable';

const Div = Spottable('div');

const SpottablePicker = kind({
	name: 'SpottablePicker',

	propTypes: {
		orientation: PropTypes.string
	},

	computed: {
		selectionKeys: ({disabled, orientation}) => {
			if (disabled) {
				return void 0;
			} else {
				return orientation === 'horizontal' ? [37, 39] : [38, 40];
			}
		}
	},

	render: ({selectionKeys, ...rest}) => {
		delete rest.orientation;

		return (
			<Div {...rest} selectionKeys={selectionKeys} />
		);
	}
});

export default SpottablePicker;
export {
	SpottablePicker
};
