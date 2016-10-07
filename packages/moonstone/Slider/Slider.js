import React, {PropTypes} from 'react';
import kind from '@enact/core/kind';
import {throttleJob} from '@enact/core/jobs';
import {Spotlight, Spottable} from '@enact/spotlight';
import Pressable from '@enact/ui/Pressable';
import {checkDefaultBounds} from '@enact/ui/validators/PropTypeValidators';

import css from './Slider.less';

const SliderBase = kind({
	name: 'Slider',

	propTypes : {
		backgroundPercent: PropTypes.number,

		/**
		 * Set the height, in standard CSS units, of the vertical slider. Only takes effect on
		 * vertical oriented slider.
		 *
		 * @type {String}
		 * @default '300px'
		 * @public
		 */
		height: PropTypes.string,
		max: PropTypes.number,
		min: PropTypes.number,
		onChange: PropTypes.func,
		pressed: PropTypes.bool,
		step: PropTypes.number,
		value: checkDefaultBounds,
		vertical: PropTypes.bool
	},

	defaultProps: {
		backgroundPercent: 0,
		height: '300px',
		max: 100,
		min: 0,
		onChange: () => {},
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
	static propTypes = SliderBase.propTypes;
	static defaultProps = SliderBase.defaultProps;

	constructor (props) {
		super(props);
		this.state = {
			value: this.props.value
		};
	}

	onChange = () => this.props.onChange(this.state.value)

	changeDelayMS = 20

	updateValue = (event) => {
		event.preventDefault();
		throttleJob('sliderChange', () => {
			this.setState({value: Number.parseInt(event.target.value, 10)}, this.onChange);
		}, this.changeDelayMS);
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
