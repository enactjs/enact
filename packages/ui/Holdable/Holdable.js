/**
 * Exports the {@link ui/Holdable.Holdable} Higher-order Component (HOC).
 *
 * @module ui/Holdable
 */

import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import Spotlight from '@enact/spotlight';
import R from 'ramda';
import React, {PropTypes} from 'react';

const eventProps = ['target', 'currentTarget', 'clientX', 'clientY', 'pageX', 'pageY',
	'screenX', 'screenY', 'altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'detail'];

const makeEventObject = (ev) => {
	const e = {};
	for (let i = 0, p; (p = eventProps[i]); i++) {
		e[p] = ev[p];
	}
	return e;
};

const makeEvent = (type, ev) => {
	return Object.assign({}, ev, {type});
};

const perfNow = () => {
	return window.performance.now();
};

const outOfRange = (start, end, tolerance) => {
	return Math.abs(start - end) >= tolerance;
};

const keyDepress = 'onKeyDown';
const keyRelease = 'onKeyUp';
const pointerDepress = 'onMouseDown';
const pointerRelease = 'onMouseUp';
const pointerEnter = 'onMouseEnter';
const pointerLeave = 'onMouseLeave';
const pointerMove = 'onMouseMove';

/**
 * Default config for {@link ui/Holdable.Holdable}
 *
 * @memberof ui/Holdable
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * You can use the `endHold` property to specify the circumstances under which a
	 * hold is considered to end. Set `endHold` to `onMove` (the default) if you want
	 * the hold to end as soon as the user's finger or pointer moves. Set `endHold`
	 * to `onLeave` if you want the hold to end only when the finger or pointer
	 * leaves the element altogether. When specifying `onMove`, you can also provide
	 * a `moveTolerance` value (default: `16`) that determines how tolerant you want
	 * to be of small movements when deciding whether a hold has ended. The higher
	 * the value, the further a user's finger or pointer may move without causing
	 * the hold to end.
	 *
	 * @type {String}
	 * @default 'onMove'
	 * @memberof ui/Holdable.defaultConfig
	 */
	endHold: 'onMove',

	/**
	 * You can specify a set of custom hold events by setting the `events` property
	 * to an array containing one or more objects. Each object specifies a custom
	 * hold event, in the form of a `name` / `time` pair. Notes:
	 *
	 *  * Times should be specified in milliseconds.
	 *
	 *  * Your `events` array overrides the framework defaults entirely, so if you
	 *    want the standard `hold` event to fire at 200 ms (in addition to whatever
	 *    custom events you define), you'll need to redefine it yourself as part of
	 *    your `events` array.
	 *
	 * Regardless of how many custom hold events you define, `onholdpulse` events
	 * will start firing after the first custom hold event fires, and continue until
	 * the user stops holding. Likewise, only one `onrelease` event will fire,
	 * regardless of how many custom hold events you define.
	 *
	 * @type {Array}
	 * @default [{name: 'hold', time: 2000}]
	 * @memberof ui/Holdable.defaultConfig
	 */
	events: [
		{name: 'hold', time: 200}
	],

	/**
	 * Determines not only how often `holdpulse` events are
	 * sent, but the frequency with which the hold duration is measured. This means
	 * that the value you set for `frequency` should always be a common factor of the
	 * times you set for your custom hold events, to ensure accurate event timing.
	 *
	 * @type {Number}
	 * @default 200
	 * @memberof ui/Holdable.defaultConfig
	 */
	frequency: 200,

	/**
	 * Determines how tolerant you want to be of small movements when deciding
	 * whether a hold has ended (in the case of `endHold: onMove`). The higher
	 * the value, the further a user's finger or pointer may move without
	 * causing the hold to end.
	 *
	 * @type {Number}
	 * @default 16
	 * @memberof ui/Holdable.defaultConfig
	 */
	moveTolerance: 16,

	/**
	 * Specifies whether a hold that has ended due to finger / pointer movement
	 * should be resumed if the user's finger or pointer moves back inside the
	 * tolerance threshold (in the case of `endHold: onMove`) or back over the
	 * element (in the case of `endHold: onLeave`).
	 *
	 * @type {Boolean}
	 * @default false
	 * @memberof ui/Holdable.defaultConfig
	 */
	resume: false
};

/**
 * {@link ui/Holdable.Holdable} is a Higher-order Component that applies a 'Holdable' behavior
 * to its wrapped component, providing methods that fire when a hold behavior is detected.
 *
 * @class Holdable
 * @memberof ui/Holdable
 * @ui
 * @public
 */
const HoldableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const {frequency, events, endHold, moveTolerance, resume} = config;
	const forwardKeyDepress = forward(keyDepress);
	const forwardKeyRelease = forward(keyRelease);
	const forwardPointerDepress = forward(pointerDepress);
	const forwardPointerRelease = forward(pointerRelease);
	const forwardPointerEnter = forward(pointerEnter);
	const forwardPointerLeave = forward(pointerLeave);
	const forwardPointerMove = forward(pointerMove);

	return class Holdable extends React.Component {
		static propTypes = /** @lends ui/Holdable.Holdable */ {
			/**
			 * Whether or not the component is in a disabled state.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * An array of valid selector keyCodes
			 *
			 * @type {Array}
			 * @default [13, 16777221]
			 * @public
			 */
			keyCodes: PropTypes.array,

			/**
			 * The event that fires when a hold is detected.
			 *
			 * @type {Function}
			 * @public
			 */
			onHold: React.PropTypes.func,

			/**
			 * The event that regularly fires when a hold persists.
			 *
			 * @type {Function}
			 * @public
			 */
			onHoldPulse: React.PropTypes.func
		}

		static defaultProps = {
			disabled: false,
			keyCodes: [13, 16777221]
		}

		componentDidMount () {
			this.downEvent = null;
			this.holdJob = null;
			this.holdStart = null;
			this.pulsing = false;
			this.unsent = null;
			this.next = null;
			this.keyEvent = false;
		}

		onKeyDepress = (ev) => {
			if (!this.props.disabled) {
				if (R.contains(ev.keyCode, this.props.keyCodes) && !Spotlight.getSelectionKeyHold()) {
					this.keyEvent = true;
					this.beginHold(makeEventObject(ev));
				}
			}
			forwardKeyDepress(ev, this.props);
		}

		onKeyRelease = (ev) => {
			if (R.contains(ev.keyCode, this.props.keyCodes)) {
				this.keyEvent = false;
				this.endHold();
			}
			forwardKeyRelease(ev, this.props);
		}

		onPointerDown = (ev) => {
			if (!this.props.disabled && !this.keyEvent) {
				this.beginHold(makeEventObject(ev));
			}
			forwardPointerDepress(ev, this.props);
		}

		onPointerUp = (ev) => {
			this.endHold();
			forwardPointerRelease(ev, this.props);
		}

		onPointerEnter = (ev) => {
			if (!this.props.disabled) {
				if (resume && endHold === 'onLeave') {
					this.resumeHold();
				}
			}
			forwardPointerEnter(ev, this.props);
		}

		onPointerMove = (ev) => {
			if (!this.props.disabled) {
				if (endHold === 'onMove' && this.downEvent) {
					if (outOfRange(ev.clientY, this.downEvent.clientY, moveTolerance) || outOfRange(ev.clientX, this.downEvent.clientX, moveTolerance)) {
						if (this.holdJob) {
							if (resume) {
								this.suspendHold();
							} else {
								this.endHold();
							}
						}
					} else if (resume && !this.holdJob) {
						this.resumeHold();
					}
				}
			}
			forwardPointerMove(ev, this.props);
		}

		onPointerLeave = (ev) => {
			if (endHold === 'onLeave') {
				if (resume) {
					this.suspendHold();
				} else {
					this.endHold();
				}
			}
			forwardPointerLeave(ev, this.props);
		}

		beginHold = (ev) => {
			this.endHold();
			this.holdStart = perfNow();
			this.downEvent = ev;
			this.pulsing = false;
			this.unsent = events.slice();
			this.unsent.sort(this.sortEvents);
			this.next = this.unsent.shift();
			if (this.next) {
				this.holdJob = setInterval(this.handleHoldPulse, frequency);
			}
		}

		endHold = () => {
			this.suspendHold();
			this.downEvent = null;
			this.pulsing = false;
			this.unsent = null;
			this.next = null;
		}

		suspendHold = () => {
			clearInterval(this.holdJob);
			this.holdJob = null;
		}

		resumeHold = () => {
			this.handleHoldPulse();
			this.holdJob = setInterval(this.handleHoldPulse, frequency);
		}

		handleHoldPulse = () => {
			const {onHoldPulse} = this.props;
			const e = this.downEvent;
			const holdTime = perfNow() - this.holdStart;
			this.shouldSendHold(e, holdTime);
			if (this.pulsing) {
				const ev = makeEvent('holdpulse', e);
				ev.holdTime = holdTime;
				if (onHoldPulse) onHoldPulse(ev);
			}
		}

		shouldSendHold = (ev, holdTime) => {
			const {onHold} = this.props;
			let n = this.next;
			let e;
			while (n && n.time <= holdTime) {
				e = makeEvent(n.name, ev);
				this.pulsing = true;
				if (onHold) onHold(e);
				n = this.next = this.unsent && this.unsent.shift();
			}
		}

		sortEvents = (a, b) => {
			if (a.time < b.time) return -1;
			if (a.time > b.time) return 1;
			return 0;
		}

		render () {
			const props = Object.assign({}, this.props);
			props[keyDepress] = this.onKeyDepress;
			props[keyRelease] = this.onKeyRelease;
			props[pointerDepress] = this.onPointerDown;
			props[pointerRelease] = this.onPointerUp;
			props[pointerEnter] = this.onPointerEnter;
			props[pointerLeave] = this.onPointerLeave;
			props[pointerMove] = this.onPointerMove;

			delete props.onHold;
			delete props.onHoldPulse;
			delete props.keyCodes;

			return <Wrapped {...props} />;
		}
	};
});

export default HoldableHOC;
export {HoldableHOC as Holdable};
