/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import {forKey, forProp, forward, forwardWithPrevent, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import {memoize} from '@enact/core/util';
import ilib from '@enact/i18n';
import NumFmt from '@enact/i18n/ilib/lib/NumFmt';
import Changeable from '@enact/ui/Changeable';
import ComponentOverride from '@enact/ui/ComponentOverride';
import Spottable from '@enact/spotlight/Spottable';
import Pause from '@enact/spotlight/Pause';
import Slottable from '@enact/ui/Slottable';
import Toggleable from '@enact/ui/Toggleable';
import Touchable from '@enact/ui/Touchable';
import PropTypes from 'prop-types';
import anyPass from 'ramda/src/anyPass';
import compose from 'ramda/src/compose';
import React from 'react';

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

const computeProportionProgress = ({value, max, min}) => (value - min) / (max - min);
const memoizedPercentFormatter = memoize((/* locale */) => {
	return new NumFmt({type: 'percentage', useNative: false});
});


/* ***************************************************
 * Still need to reconcile current API
 * * consider multiple knob and bar support
 * * integration with IncrementSlider
 * * integration with MediaSlider
 * * ARIA parity
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
		 * Converts the contents of the built-in tooltip to a percentage of the bar.
		 * The percentage respects the min and max value props.
		 *
		 * @type {Boolean}
		 * @public
		 */
		tooltipAsPercent: PropTypes.bool,

		/**
		 * Specify where the tooltip should appear in relation to the Slider bar. Options are
		 * `'before'` and `'after'`. `before` renders above a `horizontal` slider and to the
		 * left of a `vertical` Slider. `after` renders below a `horizontal` slider and to the
		 * right of a `vertical` Slider. In the `vertical` case, the rendering position is
		 * automatically reversed when rendering in an RTL locale. This can be overridden by
		 * using the [tooltipForceSide]{@link moonstone/Slider.Slider.tooltipForceSide} prop.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		tooltipSide: PropTypes.string,

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
		children: ({children, max, min, tooltip, tooltipAsPercent, value}) => {
			if (!tooltip || children) return children;

			if (tooltipAsPercent) {
				const formatter = memoizedPercentFormatter(ilib.getLocale());
				const percent = Math.floor(computeProportionProgress({value, max, min}) * 100);

				return formatter.format(percent);
			}

			return value;
		},
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
		x: ({max, min, orientation, value}) => {
			return orientation === 'horizontal' ? calcPercent(min, max, value) : 0;
		},
		y: ({max, min, orientation, value}) => {
			return orientation === 'vertical' ? calcPercent(min, max, value) : 0;
		}
	},

	render: ({backgroundProgress, children, css, disabled, focused, knob, orientation, tooltip, tooltipSide, x, y, ...rest}) => {
		delete rest.active;
		delete rest.max;
		delete rest.min;
		delete rest.pressed;
		delete rest.value;

		const percent = orientation === 'horizontal' ? x : y;
		let tooltipComponent;

		// when `tooltip` is `false`, use custom tooltip provided in `children`
		if (!tooltip) {
			tooltipComponent = children;
		} else if (focused) {
			// only display tooltip when `focused`
			tooltipComponent = <ProgressBarTooltip
				knobAfterMidpoint={percent > 0.5}
				orientation={orientation}
				proportion={percent}
				side={tooltipSide}
			>
				{children}
			</ProgressBarTooltip>;
		}

		return (
			<div {...rest} disabled={disabled}>
				<div className={css.bars}>
					<Bar className={css.load} orientation={orientation} value={backgroundProgress} />
					<Bar className={css.fill} orientation={orientation} value={percent} />
				</div>
				<ComponentOverride
					component={knob}
					data-knob-after-midpoint={percent > 0.5}
					disabled={disabled}
					x={x}
					y={y}
				>
					{tooltipComponent}
				</ComponentOverride>
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
		orientation: PropTypes.string,
		step: PropTypes.number
	}

	static defaultProps = {
		orientation: 'horizontal',
		step: 1
	}

	constructor () {
		super();

		this.paused = new Pause();
		this.handleDown = this.handleDown.bind(this);
		this.handleDrag = this.handleDrag.bind(this);
		this.handleDragStart = this.handleDragStart.bind(this);
		this.handleDragEnd = this.handleDragEnd.bind(this);
		this.bounds = {};
		this.dragConfig = {
			global: true
		};
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

	render () {
		return (
			<Wrapped
				{...this.props}
				dragConfig={this.dragConfig}
				onDown={this.handleDown}
				onDragStart={this.handleDragStart}
				onDrag={this.handleDrag}
				onDragEnd={this.handleDragEnd}
			/>
		);
	}
};

const SliderDecorator = compose(
	Changeable,
	PositionDecorator,
	Toggleable({prop: 'focused', toggle: null, activate: 'onFocus', deactivate: 'onBlur'}),
	Toggleable({prop: 'active', toggle: 'onActivate'}),
	Touchable({
		activeProp: 'pressed'
	}),
	Spottable,
	Slottable({slots: ['knob']}),
	Skinnable
);

const Slider = SliderDecorator(SliderBase);

export default Slider;
export {
	Slider,
	SliderBase
};
