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

	styles: {
		css,
		className: 'knob'
	},

	computed: {
		style: ({style, x, y}) => ({
			...style,
			transform: `translate3d(${x * 100}%, ${y * 100}%, 0)`
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
