/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import anyPass from 'ramda/src/anyPass';
import Changeable from '@enact/ui/Changeable';
import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Touchable from '@enact/ui/Touchable';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';
import PropTypes from 'prop-types';
import Slottable from '@enact/ui/Slottable';
import Spotlight from '@enact/spotlight';
import Spottable from '@enact/spotlight/Spottable';

import Bar from './Bar';
import Knob from './Knob';
import {
	calcPercent,
	calcStep,
	handleDecrement,
	handleIncrement,
	isActive,
	toggleActive
} from './utils';

import componentCss from './Slider.less';


const Base = kind({
	name: 'Slider',

	propTypes: {
		active: PropTypes.bool,
		backgroundPercent: PropTypes.number,
		disabled: PropTypes.bool,
		knob: PropTypes.node,
		knobStep: PropTypes.number,
		knobValue: PropTypes.number,
		max: PropTypes.number,
		min: PropTypes.number,
		onActivate: PropTypes.func,
		onChange: PropTypes.func,
		onRelease: PropTypes.func,
		pressed: PropTypes.bool,
		step: PropTypes.number,
		value: PropTypes.number,

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
		min: 0,
		max: 100,
		value: 0
	},

	handlers: {
		onBlur: handle(
			isActive,
			forward('onActivate')
		),
		onTrack: (ev, {min, max, onChange, vertical}) => {
			if (onChange) {
				const percent = vertical ? 1 - ev.percentY : ev.percentX;
				const value = (max - min) * percent + min;
				onChange({value});
			}
		},
		onTrackEnd: handle(
			forward('onKeyUp'),
			forward('onRelease'),
			Spotlight.resume
		),
		onKeyDown: anyPass([
			toggleActive,
			handleIncrement,
			handleDecrement
		])
	},

	styles: {
		css: componentCss,
		className: 'slider',
		publicClassNames: true
	},

	computed: {
		// children: ({children, max, min, tooltip, tooltipAsPercent, value}) => {
		// 	// If there's no tooltip, or custom children present, supply those.
		// 	if (!tooltip || children) return children;
		// 	return tooltipAsPercent ? Math.floor(computeProportionProgress({value, max, min}) * 100) + '%' : value;
		// },
		className: ({active, pressed, vertical, styler}) => styler.append({
			active,
			pressed,
			vertical,
			horizontal: !vertical
		}),
		knob: ({disabled, knob, knobStep, knobValue, max, min, onTrack, onTrackEnd, step, value, vertical}) => {
			const v = typeof knobValue === 'number' ? knobValue : value;
			const dragStep = calcStep([knobStep, step]) / (max - min);
			const percent = calcPercent(min, max, v);

			const props = {
				constrain: 'container',
				constrainBoxSizing: 'content-box',
				disabled: disabled,
				horizontal: !vertical,
				onTrack: onTrack,
				onTrackEnd: onTrackEnd,
				onTrackStart: Spotlight.pause,
				step: dragStep,
				value: vertical ? 1 - percent : percent,
				vertical: vertical
			};

			if (knob) {
				return React.cloneElement(knob, props);
			} else {
				return (
					<Knob {...props} />
				);
			}
		}
	},

	render: ({backgroundPercent, css, disabled, knob, max, min, onRelease, value, vertical, ...rest}) => {
		delete rest.active;
		delete rest.onActivate;
		delete rest.onTrack;
		delete rest.onTrackEnd;
		delete rest.pressed;

		const percent = calcPercent(min, max, value);

		return (
			<div {...rest} disabled={disabled} onMouseUp={onRelease}>
				<div className={css.bars}>
					<Bar className={componentCss.load} vertical={vertical} value={backgroundPercent} />
					<Bar className={componentCss.fill} vertical={vertical} value={percent} />
				</div>
				{knob}
			</div>
		);
	}
});


const Slider = Changeable(
	Toggleable(
		{prop: 'active', toggle: 'onActivate'},
		Touchable(
			Spottable(
				Slottable(
					{slots: ['knob']},
					Base
				)
			)
		)
	)
);

const SliderBase = Base;

export default Slider;
export {
	Slider,
	SliderBase
};

export OldSlider from './OldSlider';
