import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import PropTypes from 'prop-types';
import React from 'react';

import ComponentOverride from '../ComponentOverride';

import css from './Scrollbar.less';

const clamp = (min, max, value) => {
	if (value < min) return min;
	else if (value > max) return max;
	return value;
};

const forwardAdjusted = (name, fn) => (ev, props) => forward(name, fn(ev, props), props);

const adjustStep = (direction) => (ev, {max, size, step, value}) => ({
	direction,
	value: clamp(0, max, value + direction * step * size)
});

const ScrollbarBase = kind({
	name: 'ui/Scrollbar',

	propTypes: {
		/**
		 * Orientation of the scrollbar
		 *
		 * @type {String}
		 * @public
		 */
		orientation: PropTypes.oneOf(['vertical', 'horizontal']).isRequired,

		/**
		 * The component used to render the scroll buttons.
		 *
		 * When pressed, the scroll buttons will trigger the scroll bar's
		 * [onStep]{@link ui/Scroller.Scrollbar.onStep} event.
		 *
		 * @see {@link ui/Scroller.ScrollButton}
		 * @type {Function}
		 * @public
		 */
		buttonComponent: PropTypes.func,

		/**
		 * The upper bounds of the scrollbar.
		 *
		 * The lower bounds is always 0.
		 *
		 * @type {Number}
		 * @public
		 */
		max: PropTypes.number,

		/**
		 * Event fired when scrolling to an absolute position, typically when the scroll bar is
		 * pressed or the scroll thumb is dragged.
		 *
		 * @type {Function}
		 * @public
		 */
		onJump: PropTypes.func,

		/**
		 * Event fired when scrolling incrementally, typically when the scroll buttons are pressed.
		 *
		 * @type {Function}
		 * @public
		 */
		onStep: PropTypes.func,

		/**
		 * The available height and width of the scroll bar
		 *
		 * The `bounds` are used to calculate the size of the scroll thumb as a ratio to the
		 * available size of the scroll bar.
		 *
		 * @type {[type]}
		 */
		size: PropTypes.number,

		/**
		 * Amount to change for each `onStep`
		 *
		 * ??: Percentage or amount
		 *
		 * @type {Number}
		 * @default 0.05
		 * @public
		 */
		step: PropTypes.number,

		/**
		 * The component used to render the scroll thumb.
		 *
		 * The scroll thumb provides a visual cue to the current scroll position. It may, optionally,
		 * support dragging to update the current scroll position.
		 *
		 * @see {@link ui/Scroller.ScrollThumb}
		 * @type {Function}
		 * @public
		 */
		thumbComponent: PropTypes.func,

		/**
		 * Current scroll position between 0 and `max`
		 *
		 * @type {Number}
		 * @default 0
		 * @public
		 */
		value: PropTypes.number
	},

	defaultProps: {
		value: 0,
		step: 0.05
	},

	styles: {
		css,
		className: 'scrollbar',
		publicClassNames: true
	},

	handlers: {
		handleBackward: handle(
			(ev, {value}) => value > 0,
			forwardAdjusted('onStep', adjustStep(-1))
		),
		handleForward: handle(
			(ev, {max, value}) => value < max,
			forwardAdjusted('onStep', adjustStep(1))
		),
		onJump: handle(
			forward('onJump')
		)
	},

	computed: {
		className: ({orientation, styler}) => styler.append(orientation)
	},

	render: ({
		buttonComponent,
		handleBackward,
		handleForward,
		max,
		onJump,
		orientation,
		size,
		thumbComponent,
		value,
		...rest
	}) => {
		delete rest.onStep;
		delete rest.step;

		value = clamp(0, max, value);

		return (
			<div {...rest}>
				<ComponentOverride
					component={buttonComponent}
					className={css.scrollButton}
					direction="backward"
					disabled={value <= 0}
					onStep={handleBackward}
					orientation={orientation}
				/>
				<div className={css.bar}>
					<ComponentOverride
						component={thumbComponent}
						className={css.thumb}
						ratio={size / max}
						orientation={orientation}
						value={value / max}
						onJump={onJump}
					/>
				</div>
				<ComponentOverride
					component={buttonComponent}
					className={css.scrollButton}
					direction="forward"
					disabled={value >= max}
					onStep={handleForward}
					orientation={orientation}
				/>
			</div>
		);
	}
});

export default ScrollbarBase;
export {
	ScrollbarBase as Scrollbar,
	ScrollbarBase
};
