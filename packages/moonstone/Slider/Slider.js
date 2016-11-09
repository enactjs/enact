import kind from '@enact/core/kind';
import {throttleJob} from '@enact/core/jobs';
import {Spotlight, Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import React, {PropTypes} from 'react';

import css from './Slider.less';

const changeDelayMS = 20;

const computeLoadedValue = ({backgroundPercent}) => `${backgroundPercent}%`;
const computePercentProgress = ({value, max}) => {
	const percentage = (value / max) * 100;
	return `${percentage}%`;
};
const computeLoaderStyleProp = (vertical) => vertical ? 'height' : 'width';
const computeFillStyleProp = (vertical) => vertical ? 'height' : 'width';
const computeKnobStyleProp = (vertical) => vertical ? 'top' : 'left';

class VisibleBar extends React.Component {
	getBarNode = (node) => {
		this.barNode = node;
	}

	getKnobNode = (node) => {
		this.knobNode = node;
	}

	getLoaderNode = (node) => {
		this.loaderNode = node;
	}

	render () {
		const {loadedValue, percentProgress, vertical, verticalHeight} = this.props;

		return (
			<div className={css.visibleBar} style={verticalHeight}>
				<div className={css.load} ref={this.getLoaderNode} style={{[computeLoaderStyleProp(vertical)]: loadedValue}} />
				<div className={css.fill} ref={this.getBarNode} style={{[computeFillStyleProp(vertical)]: percentProgress}} />
				<div className={css.knob} ref={this.getKnobNode} style={{[computeKnobStyleProp(vertical)]: percentProgress}} />
			</div>
		);
	}
}

const SliderBase = kind({
	name: 'Slider',

	propTypes : {
		/**
		 * Background progress, as a percentage.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundPercent: PropTypes.number,

		/**
		 * Height, in standard CSS units, of the vertical slider. Only takes
		 * effect on a vertical oriented slider.
		 *
		 * @type {String}
		 * @default '300px'
		 * @public
		 */
		height: PropTypes.string,

		/**
		 * The method to run when the input mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		inputRef: PropTypes.func,

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
		 * The handler to run when the value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {Number} event.value Value of the slider
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * When `true`, a pressed visual effect is applied
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		pressed: PropTypes.bool,

		/**
		 * The method to run when mounted, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		sliderRef: PropTypes.func,

		/**
		 * The amount to increment or decrement the value.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * The value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: checkDefaultBounds,

		/**
		 * If `true` the slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		vertical: PropTypes.bool,

		/**
		 * The method to run when the visible bar component mounts, giving a reference to the DOM.
		 *
		 * @type {Function}
		 * @private
		 */
		visibleBarRef: PropTypes.func
	},

	defaultProps: {
		backgroundPercent: 0,
		height: '300px',
		max: 100,
		min: 0,
		pressed: false,
		step: 1,
		value: 0,
		vertical: false
	},

	styles: {
		css: css,
		className: 'slider'
	},

	computed: {
		className: ({pressed, vertical, styler}) => styler.append({pressed, vertical, horizontal: !vertical}),
		loadedValue: computeLoadedValue,
		percentProgress: computePercentProgress,
		verticalHeight: ({vertical, height}) => (vertical ? {height} : null),
		verticalWidth: ({vertical, height}) => (vertical ? {width: height} : null)
	},

	render: ({inputRef, loadedValue, max, min, onChange, percentProgress, sliderRef, step, value, verticalHeight, verticalWidth, visibleBarRef, ...rest}) => {
		const sliderProps = {
			loadedValue,
			percentProgress,
			verticalHeight
		};

		delete rest.backgroundPercent;
		delete rest.pressed;
		delete rest.vertical;

		return (
			<div {...rest} ref={sliderRef}>
				<VisibleBar {...sliderProps} ref={visibleBarRef} />
				<input
					className={css.sliderBar}
					type="range"
					ref={inputRef}
					max={max}
					min={min}
					step={step}
					onChange={onChange}
					value={value}
					style={verticalWidth}
				/>
			</div>
		);
	}
});

class Slider extends React.Component {
	static propTypes = {
		/**
		 * Background progress, as a percentage.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		backgroundPercent: PropTypes.number,

		/**
		 * The initial value of the slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		defaultValue: checkDefaultBounds,

		/**
		 * Height, in standard CSS units, of the vertical slider. Only takes
		 * effect on a vertical oriented slider.
		 *
		 * @type {String}
		 * @default '300px'
		 * @public
		 */
		height: PropTypes.string,

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
		 * The handler to run when the value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * When `true`, a pressed visual effect is applied
		 *
		 * @type {Boolean}
		 * @default false
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
		 * If `true` the slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		vertical: PropTypes.bool
	};

	static defaultProps = {
		defaultValue: 0
	};

	constructor (props) {
		super(props);
		this.state = {
			value: this.props.defaultValue
		};
	}

	onChange = () => {
		if (this.props.onChange) {
			this.props.onChange({value: this.state.value});
		}
	}

	updateValue = (event) => {
		event.preventDefault();
		throttleJob('sliderChange', () => {
			const {barNode, knobNode, loaderNode} = this.visibleBarNode;
			const {backgroundPercent, max, vertical} = this.props;
			const value = Number.parseInt(event.target.value);
			const percentProgress = computePercentProgress({value, max: (max != null ? max : SliderBase.defaultProps.max)});
			const loadedValue = computeLoadedValue({backgroundPercent});

			loaderNode.style[computeLoaderStyleProp(vertical)] = loadedValue;
			barNode.style[computeFillStyleProp(vertical)] = percentProgress;
			knobNode.style[computeKnobStyleProp(vertical)] = percentProgress;
			this.inputNode.value = value;

			// yup, we're mutating state directly! :dealwithit:
			this.state.value = value; // eslint-disable-line react/no-direct-mutation-state
			this.onChange();
		}, changeDelayMS);
	}

	getInputNode = (node) => {
		this.inputNode = node;
	}

	getSliderNode = (node) => {
		this.sliderNode = node;
	}

	getVisibleBarNode = (node) => {
		this.visibleBarNode = node;
	}

	handleClick = () => Spotlight.focus(this.sliderNode);

	render () {
		return (
			<SliderBase
				{...this.props}
				onChange={this.updateValue}
				onClick={this.handleClick}
				inputRef={this.getInputNode}
				sliderRef={this.getSliderNode}
				visibleBarRef={this.getVisibleBarNode}
			/>
		);
	}
}

const SpottableSlider = Pressable(Spottable(Slider));

export default SpottableSlider;
export {SpottableSlider as Slider, SliderBase};
