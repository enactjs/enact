import kind from '@enact/core/kind';
import {throttleJob} from '@enact/core/jobs';
import {Spotlight, Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import React, {PropTypes} from 'react';

import css from './Slider.less';

const changeDelayMS = 20;

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
		vertical: PropTypes.bool
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
		percentProgress: ({value, max}) => {
			const percentage = (value / max) * 100;
			return percentage + '%';
		},
		verticalHeight: ({vertical, height}) => (vertical ? {height} : null),
		verticalWidth: ({vertical, height}) => (vertical ? {width: height} : null),
		loadedValue: ({backgroundPercent}) => (backgroundPercent + '%')
	},

	render: ({percentProgress, loadedValue, max, min, onChange, value, step, vertical, verticalHeight, verticalWidth, sliderRef, ...rest}) => {
		delete rest.backgroundPercent;
		delete rest.pressed;

		return (
			<div {...rest} ref={sliderRef}>
				<div className={css.visibleBar} style={verticalHeight}>
					<div className={css.load} style={{[vertical ? 'height' : 'width']: loadedValue}} />
					<div className={css.fill} style={{[vertical ? 'height' : 'width']: percentProgress}} />
					<div className={css.knob} style={{[vertical ? 'bottom' : 'left']: percentProgress}} />
				</div>
				<input
					className={css.sliderBar}
					type="range"
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
		vertical: PropTypes.bool
	};

	static defaultProps = {
		value: 0
	};

	constructor (props) {
		super(props);
		this.state = {
			value: this.props.value
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
			this.setState({value: Number.parseInt(event.target.value, 10)}, this.onChange);
		}, changeDelayMS);
	}

	getSliderNode = (node) => {
		this.sliderNode = node;
	}

	handleClick = () => Spotlight.focus(this.sliderNode);

	render () {
		return (
			<SliderBase
				{...this.props}
				value={this.state.value}
				onChange={this.updateValue}
				sliderRef={this.getSliderNode}
				onClick={this.handleClick}
			/>
		);
	}
}

const SpottableSlider = Pressable(Spottable(Slider));

export default SpottableSlider;
export {SpottableSlider as Slider, SliderBase};
