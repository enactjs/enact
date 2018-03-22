import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

const BarBase = kind({
	name: 'Bar',

	propTypes: {
		value: PropTypes.number,
		vertical: PropTypes.bool
	},

	computed: {
		style: ({value, vertical}) => {
			const prop = vertical ? 'height' : 'width';
			return {
				[prop]: `${value * 100}%`
			};
		}
	},

	render: (props) => {
		delete props.value;
		delete props.vertical;

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
