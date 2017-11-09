/**
 * Exports the {@link ui/Holdable.Holdable} Higher-order Component (HOC).
 *
 * @module ui/Holdable
 */

import {off, on, once} from '@enact/core/dispatcher';
import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {is} from '@enact/core/keymap';
import pick from 'ramda/src/pick';
import React from 'react';
import PropTypes from 'prop-types';
import {perfNow} from '@enact/core/util';

const eventProps = ['clientX', 'clientY', 'currentTarget', 'pageX', 'pageY', 'screenX', 'screenY',
	'altKey', 'ctrlKey', 'metaKey', 'shiftKey', 'detail', 'type'];

const makeEvent = (type, ev) => {
	return {...ev, type};
};

const outOfRange = (start, end, tolerance) => {
	return Math.abs(start - end) >= tolerance;
};

const keyDepress = 'onKeyDown';
const keyRelease = 'onKeyUp';
const pointerDepress = 'onMouseDown';
const pointerRelease = 'mouseup';
const pointerEnter = 'onMouseEnter';

const isEnter = is('enter');

/**
 * Default config for {@link ui/Holdable.Holdable}
 *
 * @memberof ui/Holdable.Holdable
 * @hocconfig
 * @public
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
	 * @memberof ui/Holdable.Holdable.defaultConfig
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
	 * the user stops holding.
	 *
	 * @type {Array}
	 * @default [{name: 'hold', time: 200}]
	 * @memberof ui/Holdable.Holdable.defaultConfig
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
	 * @memberof ui/Holdable.Holdable.defaultConfig
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
	 * @memberof ui/Holdable.Holdable.defaultConfig
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
	 * @memberof ui/Holdable.Holdable.defaultConfig
	 */
	resume: false
};

/**
 * {@link ui/Holdable.Holdable} is a Higher-order Component that applies a 'Holdable' behavior
 * to its wrapped component, providing methods that fire when a hold behavior is detected.
 *
 * @class Holdable
 * @memberof ui/Holdable
 * @hoc
 * @public
 */
const HoldableHOC = hoc(defaultConfig, (config, Wrapped) => {
	const {frequency, events, endHold, moveTolerance, resume} = config;
	const forwardKeyDepress = forward(keyDepress);
	const forwardKeyRelease = forward(keyRelease);
	const forwardPointerDepress = forward(pointerDepress);
	const forwardPointerEnter = forward(pointerEnter);

	return class Holdable extends React.Component {
		static propTypes = /** @lends ui/Holdable.Holdable.prototype */ {
			/**
			 * Whether or not the component is in a disabled state.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * The event that fires when a hold is detected.
			 *
			 * @type {Function}
			 * @public
			 */
			onHold: PropTypes.func,

			/**
			 * The event that regularly fires when a hold persists.
			 *
			 * @type {Function}
			 * @public
			 */
			onHoldPulse: PropTypes.func
		}

		static defaultProps = {
			disabled: false
		}

		componentDidMount () {
			this.downEvent = null;
			this.holdJob = null;
			this.holdStart = null;
			this.pulsing = false;
			this.unsent = null;
			this.next = null;
		}

		componentWillReceiveProps (nextProps) {
			if (nextProps.disabled) {
				this.endHold();
			}
		}

		componentWillUnmount () {
			this.suspendHold();
			this.clearPointerRelease();
			this.clearMouseLeave();
		}

		clearPointerRelease = () => {
			if (this.onceOnPointerRelease) {
				off(pointerRelease, this.onceOnPointerRelease);
				this.onceOnPointerRelease = null;
			}
		}

		clearMouseLeave = () => {
			if (this.onceMouseLeave) {
				off('mouseleave', this.onceMouseLeave);
				this.onceMouseLeave = null;
			}
		}

		onDocumentPointerMove = (ev) => {
			if (!this.props.disabled && this.downEvent) {
				if (endHold === 'onMove' && this.downEvent.type === 'mousedown') {
					const out = outOfRange(ev.clientY, this.downEvent.clientY, moveTolerance) || outOfRange(ev.clientX, this.downEvent.clientX, moveTolerance);
					if (out && this.holdJob) {
						this.endOrSuspendHold();
					} else if (!out && resume && !this.holdJob) {
						this.resumeHold();
					}
				} else if (this.downEvent.type === 'keydown' && !this.downEvent.currentTarget.contains(ev.target)) {
					this.endHold();
				}
			}
		}

		handleKeyDepress = (ev) => {
			if (!this.props.disabled) {
				if (isEnter(ev.keyCode) && (!this.downEvent || this.downEvent.type !== 'keydown')) {
					this.beginHold(pick(eventProps, ev));
				} else if (!isEnter(ev.keyCode)) {
					this.endHold();
				}
			}
			forwardKeyDepress(ev, this.props);
		}

		handleKeyRelease = (ev) => {
			if (isEnter(ev.keyCode) && this.downEvent && this.downEvent.type === 'keydown') {
				this.endHold();
			}
			forwardKeyRelease(ev, this.props);
		}

		// NOTE: While holding enter key you cannot get a mousedown event on Chrome, for whatever
		// reason, so we can't switch back to a pointer-held hold.  This should not be an issue on
		// TV, where the same button is used for enter/click
		handlePointerDepress = (ev) => {
			if (!this.props.disabled && ev.type === 'mousedown') {	// Spotlight forwards keydown as pointer
				this.beginHold(pick(eventProps, ev));
			}
			forwardPointerDepress(ev, this.props);
		}

		handlePointerRelease = (ev) => {
			if (this.downEvent && this.downEvent.type === 'mousedown' && ev.type === 'mouseup') {
				this.onceOnPointerRelease = null;
				this.endHold();
			}
		}

		handlePointerEnter = (ev) => {
			// We track mouseleave here because the react `onMouseLeave` event does not fire
			this.onceMouseLeave = once('mouseleave', this.onPointerLeave, ev.currentTarget);
			if (!this.props.disabled) {
				if (resume && endHold === 'onLeave' && this.downEvent) {
					this.resumeHold();
				}
			}
			forwardPointerEnter(ev, this.props);
		}

		onPointerLeave = (ev) => {
			// Ensure we really moved out of the element as mouseleave fires even for
			if (ev.fromElement.contains(ev.toElement)) {
				this.onceMouseLeave = once('mouseleave', this.onPointerLeave, ev.target);
				return;
			}
			this.onceMouseLeave = null;
			if (endHold === 'onLeave') {
				this.endOrSuspendHold();
			}
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
			if (ev.type === 'mousedown') {
				this.onceOnPointerRelease = once(pointerRelease, this.handlePointerRelease);
			}

			// We are tracking document level because we need to allow for the 'slop' factor
			// even if the pointer moves slightly off the element. Also supports cancelling a hold
			// when the pointer moves while a key-based hold is active.
			on('mousemove', this.onDocumentPointerMove);
		}

		endHold = () => {
			this.suspendHold();
			this.downEvent = null;
			this.pulsing = false;
			this.unsent = null;
			this.next = null;
			off('mousemove', this.onDocumentPointerMove);
			this.clearPointerRelease();
			this.clearMouseLeave();
		}

		endOrSuspendHold = () => {
			if (resume) {
				this.suspendHold();
			} else {
				this.endHold();
			}
		}

		suspendHold = () => {
			clearInterval(this.holdJob);
			this.holdJob = null;
		}

		resumeHold = () => {
			this.handleHoldPulse();
			if (!this.holdJob) {
				this.holdJob = setInterval(this.handleHoldPulse, frequency);
			}
		}

		handleHoldPulse = () => {
			const {onHoldPulse} = this.props;
			const e = this.downEvent;
			const holdTime = perfNow() - this.holdStart;
			this.shouldSendHold(e, holdTime);
			if (this.pulsing) {
				const ev = makeEvent('holdpulse', e);
				ev.holdTime = holdTime;
				if (onHoldPulse) {
					onHoldPulse(ev);
				}
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
			props[keyDepress] = this.handleKeyDepress;
			props[keyRelease] = this.handleKeyRelease;
			props[pointerDepress] = this.handlePointerDepress;
			props[pointerEnter] = this.handlePointerEnter;

			delete props.onHold;
			delete props.onHoldPulse;
			delete props.keyCodes;

			return <Wrapped {...props} />;
		}
	};
});

export default HoldableHOC;
export {HoldableHOC as Holdable};
