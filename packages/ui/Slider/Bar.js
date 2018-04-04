import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

const BarBase = kind({
	name: 'Bar',

	propTypes: {
		orientation: PropTypes.string,
		value: PropTypes.number
	},

	computed: {
		style: ({value, orientation}) => {
			const prop = orientation === 'vertical' ? 'height' : 'width';
			return {
				[prop]: `${value * 100}%`
			};
		}
	},

	render: (props) => {
		delete props.value;
		delete props.orientation;

		return (
			<div {...props} />
		);
	}
});

export default BarBase;
export {
	BarBase as Bar,
	BarBase
};
