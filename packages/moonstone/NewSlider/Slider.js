/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import {forwardWithPrevent, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Changeable from '@enact/ui/Changeable';
import ComponentOverride from '@enact/ui/ComponentOverride';
import Spottable from '@enact/spotlight/Spottable';
import Slottable from '@enact/ui/Slottable';
import Toggleable from '@enact/ui/Toggleable';
import Touchable from '@enact/ui/Touchable';
import PropTypes from 'prop-types';
import anyPass from 'ramda/src/anyPass';
import compose from 'ramda/src/compose';
import React from 'react';

import Bar from './Bar';
import Knob from './Knob';
import {
	calcPercent,
	handleDecrement,
	handleIncrement,
	isActive,
	toggleActive
} from './utils';

import componentCss from './Slider.less';


const SliderBase = kind({
	name: 'Slider',

	propTypes: {
		active: PropTypes.bool,
		backgroundPercent: PropTypes.number,
		css: PropTypes.object,
		disabled: PropTypes.bool,
		knob: PropTypes.node,
		knobStep: PropTypes.number,
		knobValue: PropTypes.number,
		max: PropTypes.number,
		min: PropTypes.number,
		onActivate: PropTypes.func,
		onChange: PropTypes.func,
		onDecrement: PropTypes.func,
		onIncrement: PropTypes.func,

		/**
		 * If `true` the slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		orientation: PropTypes.string,
		pressed: PropTypes.bool,
		step: PropTypes.number,
		value: PropTypes.number
	},

	defaultProps: {
		knob: Knob,
		min: 0,
		max: 100,
		orientation: 'horizontal',
		value: 0
	},

	styles: {
		css: componentCss,
		className: 'slider',
		publicClassNames: true
	},

	handlers: {
		onKeyUp: handle(
			forwardWithPrevent('onKeyUp'),
			anyPass([
				toggleActive,
				handleIncrement,
				handleDecrement
			])
		)
	},

	computed: {
		// children: ({children, max, min, tooltip, tooltipAsPercent, value}) => {
		// 	// If there's no tooltip, or custom children present, supply those.
		// 	if (!tooltip || children) return children;
		// 	return tooltipAsPercent ? Math.floor(computeProportionProgress({value, max, min}) * 100) + '%' : value;
		// },
		className: ({active, pressed, orientation, styler}) => styler.append(
			orientation,
			{
				active,
				pressed
			}
		),
		x: ({max, min, orientation, value}) => {
			return orientation === 'horizontal' ? calcPercent(min, max, value) : 0;
		},
		y: ({max, min, orientation, value}) => {
			return orientation === 'vertical' ? calcPercent(min, max, value) : 0;
		}
	},

	render: ({backgroundPercent, css, disabled, knob, orientation, x, y, ...rest}) => {
		delete rest.active;
		delete rest.max;
		delete rest.min;
		delete rest.pressed;
		delete rest.value;

		const percent = orientation === 'horizontal' ? x : y;

		return (
			<div {...rest} disabled={disabled}>
				<div className={css.bars}>
					<Bar className={componentCss.load} orientation={orientation} value={backgroundPercent} />
					<Bar className={componentCss.fill} orientation={orientation} value={percent} />
				</div>
				<ComponentOverride
					component={knob}
					disabled={disabled}
					x={x}
					y={y}
				/>
			</div>
		);
	}
});

const PositionDecorator = (Wrapped) => class extends React.Component {
	static displayName = 'PositionDecorator'

	static propTypes = {
		max: PropTypes.number,
		min: PropTypes.number,
		onChange: PropTypes.func,
		orientation: PropTypes.string
	}

	static defaultProps = {
		orientation: 'horizontal'
	}

	constructor () {
		super();

		this.handleDown = this.handleDown.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.bounds = {};
	}

	emitChangeForPosition (position) {
		const {max, min, onChange} = this.props;

		const percent = calcPercent(this.bounds.min, this.bounds.max, position);
		const value = (max - min) * percent;

		onChange({
			type: 'onChange',
			value
		});
	}

	updateBounds (node) {
		const {orientation} = this.props;

		const bounds = node.getBoundingClientRect();
		const computedStyle = window.getComputedStyle(node);

		if (orientation === 'horizontal') {
			this.bounds.min = bounds.left + parseInt(computedStyle.paddingLeft);
			this.bounds.max = bounds.right - parseInt(computedStyle.paddingRight);
		} else {
			this.bounds.min = bounds.top + parseInt(computedStyle.paddingTop);
			this.bounds.max = bounds.bottom - parseInt(computedStyle.paddingBottom);
		}
	}

	handleDown ({clientX, clientY, currentTarget}) {
		this.updateBounds(currentTarget);
		this.emitChangeForPosition(this.props.orientation === 'horizontal' ? clientX : clientY);
	}

	handleDrag ({x, y}) {
		this.emitChangeForPosition(this.props.orientation === 'horizontal' ? x : y);
	}

	render () {
		return (
			<Wrapped
				{...this.props}
				onDown={this.handleDown}
				onDragStart={this.handleDrag}
				onDrag={this.handleDrag}
			/>
		);
	}
};

const SliderDecorator = compose(
	Changeable,
	PositionDecorator,
	Toggleable({prop: 'active', toggle: 'onActivate'}),
	Touchable({
		activeProp: 'pressed',
		drag: {
			global: true
		}
	}),
	Spottable,
	Slottable({slots: ['knob']})
);

const Slider = SliderDecorator(SliderBase);

export default Slider;
export {
	Slider,
	SliderBase
};

export OldSlider from './OldSlider';
