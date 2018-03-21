import Trackable from '@enact/ui/Trackable';
import kind from '@enact/core/kind';
import React from 'react';

import css from './Slider.less';

const KnobBase = kind({
	name: 'Knob',

	propTypes: {
		percentX: React.PropTypes.number,
		percentY: React.PropTypes.number,
		x: React.PropTypes.number,
		y: React.PropTypes.number
	},

	styles: {
		css,
		className: 'knob'
	},

	computed: {
		style: ({style, x, y}) => ({
			...style,
			transform: `translate3d(${x}px, ${y}px, 0)`
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

const Knob = Trackable(
	KnobBase
);

export default Knob;
export {
	Knob,
	KnobBase
};
