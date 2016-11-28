import kind from '@enact/core/kind';
import {throttleJob} from '@enact/core/jobs';
import {Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';
import rClamp from 'ramda/src/clamp';
import React, {PropTypes} from 'react';


import IconButton from '../IconButton';
import {SliderBase} from '../Slider';

import css from './IncrementSlider.less';

const IncrementSliderBase = kind({
	name: 'IncrementSlider',

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
		 * Height, in standard CSS units, of the vertical increment slider. Only takes
		 * effect on a vertical oriented slider.
		 *
		 * @type {String}
		 * @default '300px'
		 * @public
		 */
		height: PropTypes.string,

		/**
		 * The maximum value of the increment slider.
		 *
		 * @type {Number}
		 * @default 100
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * The minimum value of the increment slider.
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
		 * @param {Number} event.value The current value
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * The handler to run when the value is incremented.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onDecrement: PropTypes.func,

		/**
		 * The handler to run when the value is decremented.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onIncrement: PropTypes.func,

		/**
		* The amount to increment or decrement the value.
		*
		* @type {Number}
		* @default 1
		* @public
		*/
		step: PropTypes.number,

		/**
		* The value of the increment slider.
		*
		* @type {Number}
		* @default 0
		* @public
		*/
		value: checkDefaultBounds,

		/**
		* If `true` the increment slider will be oriented vertically.
		*
		* @type {Boolean}
		* @default false
		* @public
		*/
		vertical: PropTypes.bool
	},

	defaultProps: {
		vertical: false
	},

	styles: {
		css: css,
		className: 'incrementSlider'
	},

	computed: {
		incrementSliderClasses: ({vertical, styler}) => styler.append({vertical})
	},

	render: ({onIncrement, onDecrement, incrementSliderClasses, ...rest}) => (
		<div className={incrementSliderClasses}>
			<IconButton className={css.decrementButton} small onClick={onDecrement}>arrowlargeleft</IconButton>
			<SliderBase {...rest} className={css.slider} />
			<IconButton className={css.incrementButton} small onClick={onIncrement}>arrowlargeright</IconButton>
		</div>
	)
});

class IncrementSlider extends React.Component {

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
		 * The initial value of the increment slider.
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		defaultValue: checkDefaultBounds,

		/**
		 * Height, in standard CSS units, of the vertical increment slider. Only takes
		 * effect on a vertical oriented slider.
		 *
		 * @type {String}
		 * @default '300px'
		 * @public
		 */
		height: PropTypes.string,

		/**
		 * The maximum value of the increment slider.
		 *
		 * @type {Number}
		 * @default 100
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * The minimum value of the increment slider.
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
		 * @param {Number} value - The current value
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * The amount to increment or decrement the value.
		 *
		 * @type {Number}
		 * @default 1
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * If `true` the increment slider will be oriented vertically.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		vertical: PropTypes.bool
	};

	static defaultProps = {
		defaultValue: 0,
		max: 100,
		min: 0,
		step: 1
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

	changeDelayMS = 20

	updateValue = (event) => {
		throttleJob('sliderChange', () => {
			this.setState({value: parseInt(event.target.value)}, this.onChange);
		}, this.changeDelayMS);
	}

	incrementHandler = () => {
		const {min, max, step} = this.props;
		let increaseAmt = this.state.value + step;

		increaseAmt = rClamp(min, max, increaseAmt);
		this.setState({value: increaseAmt}, this.onChange);
	}

	decrementHandler = () => {
		const {min, max, step} = this.props;
		let decreaseAmt = this.state.value - step;

		decreaseAmt = rClamp(min, max, decreaseAmt);
		this.setState({value: decreaseAmt}, this.onChange);
	}

	render () {
		return (
			<IncrementSliderBase
				{...this.props}
				value={this.state.value}
				onChange={this.updateValue}
				onDecrement={this.decrementHandler}
				onIncrement={this.incrementHandler}
			/>
		);
	}
}

const SpottableSlider = Pressable(Spottable(IncrementSlider));

export default SpottableSlider;
export {SpottableSlider as IncrementSlider, IncrementSliderBase};
