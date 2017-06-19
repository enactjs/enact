import hoc from '@enact/core/hoc';
import Holdable from '@enact/ui/Holdable';

/**
 * Default config for {@link moonstone/internal/Holdable.Holdable}
 *
 * @memberof moonstone/internal/Holdable.Holdable
 * @hocconfig
 * @private
 */
const defaultConfig = {
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
	 * @default [{name: 'hold', time: 400}]
	 * @memberof moonstone/internal/Holdable.Holdable.defaultConfig
	 */
	events: [
		{name: 'hold', time: 400}
	]
};

/**
 * {@link moonstone/internal/Holdable.Holdable} is a Higher-order Component that applies a
 * 'Holdable' behavior to its wrapped component, providing methods that fire when a hold
 * behavior is detected.
 *
 * @class Holdable
 * @memberof moonstone/internal/Holdable
 * @hoc
 * @private
 */
const HoldableHOC = hoc(defaultConfig, Holdable);

export default HoldableHOC;
