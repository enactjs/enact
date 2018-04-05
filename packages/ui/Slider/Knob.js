import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import css from './Slider.less';

const Knob = kind({
	name: 'Knob',

	propTypes: {
		x: PropTypes.number,
		y: PropTypes.number
	},

	defaultProps: {
		x: 0,
		y: 1
	},

	styles: {
		css,
		className: 'knob'
	},

	computed: {
		style: ({style, x, y}) => ({
			...style,
			'--ui-slider-knob-x': x,
			'--ui-slider-knob-y': 1 - y
		})
	},

	render: (props) => {
		delete props.percentX;
		delete props.percentY;
		delete props.x;
		delete props.y;

		return (
			<div {...props} />
		);
	}
});

export default Knob;
export {
	Knob
};
