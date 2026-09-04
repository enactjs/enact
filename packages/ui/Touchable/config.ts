import {defaultDragConfig, dragConfigPropType} from './Drag';
import {defaultFlickConfig, flickConfigPropType} from './Flick';
import {defaultHoldConfig, holdConfigPropType} from './Hold';
import {defaultPinchConfig, pinchConfigPropType} from './Pinch';

export interface TouchableConfig {
	drag: dragConfigPropType;
	flick: flickConfigPropType;
	hold: holdConfigPropType;
	pinch: pinchConfigPropType;
}

const allowedDragKeys = Object.keys(defaultDragConfig);
const allowedFlickKeys = Object.keys(defaultFlickConfig);
const allowedHoldKeys = Object.keys(defaultHoldConfig);
const allowedPinchKeys = Object.keys(defaultPinchConfig);

/**
 * The Global Gesture Configuration Object
 *
 * @private
 * @memberof ui/Touchable
 */
let config: TouchableConfig = {} as TouchableConfig;

// map-friendly clone method
const clone = <T>(o: T) => Object.assign({}, o);

// Merges two configuration objects while retaining only the allowed keys
const mergeGestureConfig = <T>(current: T, update: T, allowed: string[]) => {
	const cfg = {...current, ...update} as Record<string, any>;

	Object.keys(cfg).forEach(key => {
		if (allowed.indexOf(key) === -1) {
			delete cfg[key];
		}
	});

	return cfg as T;
};

// Merges the current global config with the provided `cfg` and returns the result
const mergeConfig = (cfg: TouchableConfig) => {
	const merged = {
		drag: mergeGestureConfig(config.drag, cfg.drag, allowedDragKeys),
		flick: mergeGestureConfig(config.flick, cfg.flick, allowedFlickKeys),
		hold: mergeGestureConfig(config.hold, cfg.hold, allowedHoldKeys),
		pinch: mergeGestureConfig(config.pinch, cfg.pinch, allowedPinchKeys)
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
 *   * `events` - An array of `onHoldStart` events which each contain a `name` and `time`. The `time`
 *     controls the amount of time that must pass before this `onHoldStart` event is fired and should
 *     be a multiple of `frequency`.
 *
 * `pinch`
 *
 *   * `boxSizing` - The part of the component's box model is used as the bounds of the constraint.
 *     Only applies when `global` is `false`.
 *     * `'border-box'` - the default, includes the padding and border but excludes the margin.
 *     * `'content-box'` - excludes the padding, border, and margin.
 *   * `global` - When `true`, pinch gestures will continue when leaving the bounds of the component
 *      or blurring the component.
 *   * `maxScale` - The maximum scale value. Defaults to `4`.
 *   * `minScale` - The minimum scale value. Defaults to `0.5`.
 *   * `moveTolerance` - The distance difference from the previous distance that the pointer may move
 *     before cancelling the scaling. Defaults to `16`.
 *
 * @function
 * @param   {Object}     cfg  A partial or complete configuration object
 *
 * @returns {undefined}
 * @public
 * @memberof ui/Touchable
 */
const configure = (cfg: TouchableConfig) => {
	config = mergeConfig(cfg);
};

const getConfig = () => config;

const resetDefaultConfig = () => configure({
	drag: defaultDragConfig,
	flick: defaultFlickConfig,
	hold: defaultHoldConfig,
	pinch: defaultPinchConfig
});

resetDefaultConfig();

export default configure;
export {
	configure,
	getConfig,
	mergeConfig,
	resetDefaultConfig
};
