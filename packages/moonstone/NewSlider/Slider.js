/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import {forKey, forProp, forward, forwardWithPrevent, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Changeable from '@enact/ui/Changeable';
import ComponentOverride from '@enact/ui/ComponentOverride';
import Spottable from '@enact/spotlight/Spottable';
import Pause from '@enact/spotlight/Pause';
import Slottable from '@enact/ui/Slottable';
import Touchable from '@enact/ui/Touchable';
import PropTypes from 'prop-types';
import anyPass from 'ramda/src/anyPass';
import compose from 'ramda/src/compose';
import React from 'react';

import $L from '../internal/$L';
import {ProgressBarTooltip} from '../ProgressBar';
import Skinnable from '../Skinnable';

import Bar from './Bar';
import Knob from './Knob';
import {
	calcPercent,
	handleDecrement,
	handleIncrement
} from './utils';

import componentCss from './Slider.less';



/* ***************************************************
 * Still need to reconcile current API
 * * consider multiple knob and bar support
 * * integration with IncrementSlider
 * * integration with MediaSlider
 *
 * ***************************************************/

const SliderBase = kind({
	name: 'Slider',

	propTypes: {

		/**
		 * When `true`, the component may be manipulated via the directional input keys upon
		 * receiving focus.
		 *
		 * @type {Boolean}
		 * @public
		 */
		activateOnFocus: PropTypes.bool,

		/**
		 * When `true`, the knob displays selected and can be moved using 5-way controls.
		 *
		 * @type {Boolean}
		 * @public
		 */
		active: PropTypes.bool,

		/**
		 * Background progress, as a proportion between `0` and `1`.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundProgress: PropTypes.number,

		/**
		 * Customizes the component by mapping the supplied collection of CSS class names to the
		 * corresponding internal Elements and states of this component.
		 *
		 * @type {Object}
		 * @private
		 */
		css: PropTypes.object,

		/**
		 * When `true`, the component is shown as disabled and does not generate events
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * When `true`, the tooltip, if present, is shown
		 * @type {Boolean}
		 * @public
		 */
		focused: PropTypes.bool,
		knob: PropTypes.node,

		/**
		 * The amount to increment or decrement the position of the knob via 5-way controls.
		 * When `detachedKnob` is false, the knob must first be activated by selecting it. When
		 * `detachedKnob` is true, the knob will respond to direction key presses without
		 * activation.
		 *
		 * If not specified, `step` is used for the default value.
		 *
		 * @type {Number}
		 * @public
		 */
		knobStep: PropTypes.number,

		/**
		 * The maximum value of the slider.
		 *
		 * @type {Number}
		 * @default 100
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * The minimum value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		min: PropTypes.number,

		/**
		 * When `true`, the slider bar doesn't show a fill and doesn't highlight when spotted
		 *
		 * @type {Boolean}
		 * @public
		 */
		noFill: PropTypes.bool,

		/**
		 * The handler when the knob is activated or deactivated by selecting it via 5-way
		 *
		 * @type {Function}
		 * @public
		 */
		onActivate: PropTypes.func,

		/**
		 * The handler to run when the value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.value Value of the slider
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * The handler to run when the value is decremented.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onDecrement: PropTypes.func,

		/**
		 * The handler to run when the value is incremented.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onIncrement: PropTypes.func,

		/**
		 * If `true` the slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		orientation: PropTypes.string,

		/**
		 * When `true`, a pressed visual effect is applied
		 *
		 * @type {Boolean}
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * The amount to increment or decrement the value.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * Enables the built-in tooltip, whose behavior can be modified by the other tooltip
		 * properties.
		 *
		 * @type {Boolean}
		 * @public
		 */
		tooltip: PropTypes.bool,

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number
	},

	defaultProps: {
		activateOnFocus: false,
		active: false,
		disabled: false,
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
		onBlur: handle(
			forward('onBlur'),
			forProp('active', true),
			forward('onActivate')
		),
		onKeyDown: handle(
			forwardWithPrevent('onKeyDown'),
			anyPass([
				handleIncrement,
				handleDecrement
			])
		),
		onKeyUp: handle(
			forwardWithPrevent('onKeyUp'),
			forProp('activateOnFocus', false),
			forKey('enter'),
			forward('onActivate')
		)
	},

	computed: {
		className: ({activateOnFocus, active, disabled, noFill, orientation, pressed, styler}) => {
			return styler.append(
				orientation,
				{
					activateOnFocus,
					active,
					disabled,
					noFill,
					pressed
				}
			);
		},
		tooltip: ({tooltip}) => tooltip === true ? ProgressBarTooltip : tooltip,
		x: ({max, min, orientation, value}) => {
			return orientation === 'horizontal' ? calcPercent(min, max, value) : 0;
		},
		y: ({max, min, orientation, value}) => {
			return orientation === 'vertical' ? calcPercent(min, max, value) : 0;
		}
	},

	render: ({backgroundProgress, css, disabled, focused, knob, orientation, tooltip, value, x, y, ...rest}) => {
		delete rest.active;
		delete rest.max;
		delete rest.min;
		delete rest.pressed;

		const percent = orientation === 'horizontal' ? x : y;

		return (
			<div {...rest} disabled={disabled}>
				<div className={css.bars}>
					<Bar className={css.load} orientation={orientation} value={backgroundProgress} />
					<Bar className={css.fill} orientation={orientation} value={percent} />
				</div>
				<ComponentOverride
					component={knob}
					disabled={disabled}
					x={x}
					y={y}
				>
					<ComponentOverride
						component={tooltip}
						orientation={orientation}
						proportion={percent}
						visible={focused}
					>
						{value}
					</ComponentOverride>
				</ComponentOverride>
			</div>
		);
	}
});


// ARIA
// * use aria-valuetext when set
// * defaults to value
// * onActivate, set to hint text
// * on value change, reset to value or valuetext

const useHintOnActivate = ({active}) => {
	return {
		useHintText: active
	};
};

const toggleActivate = ({active}) => {
	return {
		active: !active
	};
};

const PositionDecorator = (Wrapped) => class extends React.Component {
	static displayName = 'PositionDecorator'

	static propTypes = {
		'aria-valuetext': PropTypes.oneOf([PropTypes.string, PropTypes.number]),
		max: PropTypes.number,
		min: PropTypes.number,
		onChange: PropTypes.func,
		orientation: PropTypes.string,
		step: PropTypes.number,
		value: PropTypes.number
	}

	static defaultProps = {
		orientation: 'horizontal',
		step: 1
	}

	constructor () {
		super();

		this.paused = new Pause();
		this.handleActivate = this.handleActivate.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
		this.handleDown = this.handleDown.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleFocus = this.handleFocus.bind(this);
		this.bounds = {};
		this.dragConfig = {
			global: true
		};

		this.state = {
			active: false,
			focused: false,
			useHintText: false
		};
	}

	componentWillReceiveProps (nextProps) {
		if (this.props.value !== nextProps.value) {
			this.setState({useHintText: false});
		}
	}

	componentWillUnmount () {
		this.paused.resume();
	}

	getValueText () {
		const {'aria-valuetext': ariaValueText, orientation, value} = this.props;
		const {useHintText} = this.state;

		const verticalHint = $L('change a value with up down button');
		const horizontalHint = $L('change a value with left right button');

		if (useHintText) {
			return orientation === 'horizontal' ? horizontalHint : verticalHint;
		}

		if (ariaValueText != null) {
			return ariaValueText;
		}

		return value;
	}

	emitChangeForPosition (position) {
		const {max, min, onChange, step} = this.props;

		const percent = calcPercent(this.bounds.min, this.bounds.max, position);
		let value = (max - min) * percent + min;

		// adjust value for stepping
		if (step) {
			const delta = (value - min) % step;
			if (delta < step / 2) {
				value -= delta;
			} else {
				value += step - delta;
			}
		}

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

	handleActivate () {
		this.setState(toggleActivate);
		this.setState(useHintOnActivate);
	}

	handleBlur (ev) {
		forward('onBlur', ev, this.props);
		this.setState({focused: false});
	}

	handleDown ({clientX, clientY, currentTarget}) {
		this.updateBounds(currentTarget);

		// bail early for emulated mousedown events from key presses
		if (typeof clientX === 'undefined' || typeof clientY === 'undefined') return;

		this.emitChangeForPosition(this.props.orientation === 'horizontal' ? clientX : clientY);
	}

	handleDragStart ({x, y}) {
		this.paused.pause();
		this.emitChangeForPosition(this.props.orientation === 'horizontal' ? x : y);
	}

	handleDrag ({x, y}) {
		this.emitChangeForPosition(this.props.orientation === 'horizontal' ? x : y);
	}

	handleDragEnd () {
		this.paused.resume();
	}

	handleFocus (ev) {
		forward('onFocus', ev, this.props);
		this.setState({focused: true});
	}

	render () {
		return (
			<Wrapped
				focused={this.state.focused}
				{...this.props}
				active={this.state.active}
				aria-valuetext={this.getValueText()}
				dragConfig={this.dragConfig}
				onActivate={this.handleActivate}
				onBlur={this.handleBlur}
				onDown={this.handleDown}
				onDragStart={this.handleDragStart}
				onDrag={this.handleDrag}
				onDragEnd={this.handleDragEnd}
				onFocus={this.handleFocus}
			/>
		);
	}
};

const SliderDecorator = compose(
	Changeable,
	PositionDecorator,
	Touchable({activeProp: 'pressed'}),
	Spottable,
	Slottable({slots: ['knob', 'tooltip']}),
	Skinnable
);

const Slider = SliderDecorator(SliderBase);

export default Slider;
export {
	Slider,
	SliderBase,
	ProgressBarTooltip as SliderTooltip
};
