/**
 * Exports the {@link moonstone/Slider.Slider} component.
 *
 * @module moonstone/Slider
 */

import anyPass from 'ramda/src/anyPass';
import Changeable from '@enact/ui/Changeable';
import factory from '@enact/core/factory';
import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import Pressable from '@enact/ui/Pressable';
import Toggleable from '@enact/ui/Toggleable';
import React from 'react';
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


const SliderBaseFactory = factory({css: componentCss}, ({css}) => {
	const Base = kind({
		name: 'Slider',

		propTypes: {
			active: React.PropTypes.bool,
			backgroundPercent: React.PropTypes.number,
			disabled: React.PropTypes.bool,
			knob: React.PropTypes.node,
			knobStep: React.PropTypes.number,
			max: React.PropTypes.number,
			min: React.PropTypes.number,
			onActivate: React.PropTypes.func,
			onChange: React.PropTypes.func,
			onRelease: React.PropTypes.func,
			pressed: React.PropTypes.bool,
			step: React.PropTypes.number,
			value: React.PropTypes.number,

			/**
			 * If `true` the slider will be oriented vertically.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			vertical: React.PropTypes.bool
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
			onDrag: (ev, {min, max, onChange, vertical}) => {
				if (onChange) {
					const percent = vertical ? 1 - ev.percentY : ev.percentX;
					const value = (max - min) * percent + min;
					onChange({value});
				}
			},
			onDragEnd: handle(
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
			css,
			className: 'slider'
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
			knob: ({disabled, knob, knobStep, max, min, onDrag, onDragEnd, step, value, vertical}) => {
				const dragStep = calcStep([knobStep, step]) / (max - min);
				const percent = calcPercent(min, max, value);
				const props = {
					constrain: 'container',
					constrainBoxSizing: 'content-box',
					disabled: disabled,
					horizontal: !vertical,
					onDrag: onDrag,
					onDragEnd: onDragEnd,
					onDragStart: Spotlight.pause,
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

		render: ({backgroundPercent, disabled, knob, max, min, onRelease, value, vertical, ...rest}) => {
			delete rest.active;
			delete rest.onActivate;
			delete rest.onDrag;
			delete rest.onDragEnd;
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

	return Base;
});

const SliderFactory = factory(css => {
	const Base = SliderBaseFactory(css);

	return Changeable(
		Toggleable(
			{prop: 'active', toggle: 'onActivate'},
			Pressable(
				{leave: false, release: 'onRelease'},
				Spottable(
					Slottable(
						{slots: ['knob']},
						Base
					)
				)
			)
		)
	);
});

const SliderBase = SliderBaseFactory();
const Slider = SliderFactory();

export default Slider;
export {
	Slider,
	SliderBase,
	SliderBaseFactory,
	SliderFactory
};

export OldSlider from './OldSlider';
