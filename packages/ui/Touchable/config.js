import {defaultDragConfig} from './Drag.js';
import {defaultFlickConfig} from './Flick.js';
import {defaultHoldConfig} from './Hold.js';

const allowedDragKeys = Object.keys(defaultDragConfig);
const allowedFlickKeys = Object.keys(defaultFlickConfig);
const allowedHoldKeys = Object.keys(defaultHoldConfig);

/**
 * The Global Gesture Configuration Object
 *
 * @private
 * @memberof ui/Touchable
 */
let config = {};

// map-friendly clone method
const clone = o => Object.assign({}, o);

// Merges two configuation objects while retaining only the allowed keys
const mergeGestureConfig = (current, update, allowed) => {
	const cfg = {...current, ...update};

	Object.keys(cfg).forEach(key => {
		if (allowed.indexOf(key) === -1) {
			delete cfg[key];
		}
	});

	return cfg;
};

// Merges the current global config with the provided `cfg` and returns the result
const mergeConfig = (cfg) => {
	const merged = {
		drag: mergeGestureConfig(config.drag, cfg.drag, allowedDragKeys),
		flick: mergeGestureConfig(config.flick, cfg.flick, allowedFlickKeys),
		hold: mergeGestureConfig(config.hold, cfg.hold, allowedHoldKeys)
	};

	merged.hold.events = merged.hold.events.map(clone);

	return merged;
};

/**
 * Configures the global gesture configuration for the application.
 *
 * Example:
 * ```
 * // Updates the `maxMoves`, `moveTolerance`, and `frequency` configurations while retaining the
 * // current value of all other configurations
 * configure({
 *     flick: {
 *         maxMoves: 10
 *     },
 *     hold: {
 *         moveTolerance: 32,
 *         frequency: 400
 *     }
 * });
 * ```
 *
 * Each type of gesture has its own set of configuration properties grouped within a separate object
 * keyed by the name of the gesture. Partial configurations may be passed and will be merged with
 * the current configuration.
 *
 * `drag`
 *
 *   * `boxSizing` - The part of the component's box model is used as the bounds of the constraint.
 *     Only applies when `global` is `false`.
 *     * `'border-box'` - the default, includes the padding and border but excludes the margin.
 *     * `'content-box'` - excludes the padding, border, and margin.
 *   * `global` - When `true`, drag gestures will continue when leaving the bounds of the component
 *      or blurring the component.
 *   * `moveTolerance` - The number of pixels from the start position of the drag that the pointer
 *     may move before cancelling the drag. Defaults to `16`.
 *
 * `flick`
 *
 *   * `maxDuration` - The amount of time, in milliseconds, to complete a flick gesture before it
 *     is cancelled. Defaults to 250.
 *   * `maxMoves` - The number of moves tracked to determine if a flick occurred. Defaults to `5`.
 *   * `minVelocity` - The minimum threshold, measured as the change in pixels over the change in
 *     time per move, that must be exceeded to generate a `onFlick` event.
 *
 * `hold`
 *
 *   * `cancelOnMove` - When `true`, the hold is cancelled when moving beyond the `moveTolerance`.
 *     Defaults to `false`
 *   * `global` - When `true`, hold gestures will continue when leaving the bounds of the component
 *      or blurring the component.
 *   * `moveTolerance` - The number of pixels from the start position of the hold that the pointer
 *     may move before cancelling the hold. Ignored when `cancelOnMove` is `false`. Defaults to
 *     `16`.
 *   * `frequency` - The time, in milliseconds, to poll for hold events. Defaults to `200`.
 *   * `events` - An array of `onHold` events which each contain a `name` and `time`. The `time`
 *     controls the amount of time that must pass before this `onHold` event is fired and should
 *     be a multiple of `frequency`.
 *
 * @function
 * @param   {Object}     cfg  A partial or complete configuration object
 *
 * @returns {undefined}
 * @public
 * @memberof ui/Touchable
 */
const configure = (cfg) => {
	config = mergeConfig(cfg);
};

const getConfig = () => config;

const resetDefaultConfig = () => configure({
	drag: defaultDragConfig,
	hold: defaultHoldConfig,
	flick: defaultFlickConfig
});

resetDefaultConfig();

export default configure;
export {
	configure,
	getConfig,
	mergeConfig,
	resetDefaultConfig
};
