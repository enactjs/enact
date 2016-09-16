import kind from 'enact-core/kind';
import {throttleJob} from 'enact-core/jobs';
import {Spottable} from 'enact-spotlight';
import Pressable from 'enact-ui/Pressable';
import R from 'ramda';
import React, {PropTypes} from 'react';


import IconButton from '../IconButton';
import {SliderBase} from '../Slider';

import css from './IncrementSlider.less';

const IncrementSliderBase = kind({
	name: 'IncrementSlider',

	propTypes : {
		...SliderBase.propTypes,
		onDecrement: PropTypes.func,
		onIncrement: PropTypes.func
	},

	defaultProps: SliderBase.defaultProps,

	styles: {
		css: css,
		className: 'incrementSlider'
	},

	computed: {
		incrementSliderClasses: ({vertical, styler}) => styler.append({vertical})
	},

	render: ({value, onIncrement, onDecrement, incrementSliderClasses, ...rest}) => (
		<div className={incrementSliderClasses}>
			<IconButton className={css.decrementButton} small onClick={onDecrement}>arrowlargeleft</IconButton>
			<SliderBase {...rest} className={css.slider} value={value} />
			<IconButton className={css.incrementButton} small onClick={onIncrement}>arrowlargeright</IconButton>
		</div>
	)
});

class IncrementSlider extends React.Component {

	static propTypes = SliderBase.propTypes;

	static defaultProps = IncrementSliderBase.defaultProps;

	constructor (props) {
		super(props);
		this.state = {
			value: this.props.value
		};
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.value !== this.props.value) {
			this.setState({
				value: nextProps.value
			});
		}
	}

	onChange = () => this.props.onChange(this.state.value)

	changeDelayMS = 20

	updateValue = (event) => {
		throttleJob('sliderChange', () => {
			this.setState({value: parseInt(event.target.value, 10)}, this.onChange);
		}, this.changeDelayMS);
	}

	incrementHandler = () => {
		const {min, max, step} = this.props;
		let increaseAmt = this.state.value + step;

		increaseAmt = R.clamp(min, max, increaseAmt);
		this.setState({value: increaseAmt}, this.onChange);
	}

	decrementHandler = () => {
		const {min, max, step} = this.props;
		let decreaseAmt = this.state.value - step;

		decreaseAmt = R.clamp(min, max, decreaseAmt);
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
