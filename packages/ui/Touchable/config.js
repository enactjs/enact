
const defaultFlickConfig = {
	maxDuration: 250,
	maxMoves: 5,
	minVelocity: 0.1
};

const allowedFlickKeys = Object.keys(defaultFlickConfig);

const defaultHoldConfig = {
	cancelOnMove: false,
	moveTolerance: 16,
	frequency: 200,
	events: [
		{name: 'hold', time: 200}
	]
};

const allowedHoldKeys = Object.keys(defaultHoldConfig);

/**
 * The Global Gesture Configuration Object
 *
 * @private
 * @memberof ui/Touchable
 */
const config = {};

// map-friendly clone method
const clone = o => Object.assign({}, o);

// Merges two configuation objects while retaining only the allowed keys
const mergeConfig = (current, update, allowed) => {
	const cfg = {...current, ...update};

	Object.keys(cfg).forEach(key => {
		if (allowed.indexOf(key) === -1) {
			delete cfg[key];
		}
	});

	return cfg;
};

/**
 * Configures the global gesture configuration for the application.
 *
 * ```
 * // Updates the maxMoves, moveTolerance, and frequency configurations while retaining the
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
 *   * `moveTolerance` - The number of pixels from the start position of the hold that the pointer
 *     may move before cancelling the hold. Ignored when `cancelOnMove` is `false`. Defaults to
 *     `16`.
 *   * `frequency` - The time, in milliseconds, to poll for hold events. Defaults to `200`.
 *   * `events` - An array of `onHold` events which each contain a `name` and `time`. The `time`
 *     controls the amount of time that must pass before this `onHold` event is fired and should
 *     be a multiple of `frequency`.
 *
 * @param   {Object}     config  A partial or complete configuration object
 *
 * @returns {undefined}
 * @public
 * @memberof ui/Touchable
 */
const configure = (cfg) => {
	if (cfg.flick) {
		config.flick = mergeConfig(config.flick, cfg.flick, allowedFlickKeys);
	}

	if (cfg.hold) {
		config.hold = mergeConfig(config.hold, cfg.hold, allowedHoldKeys);

		// deeply clone the array to avoid allowing the config to be mutated directly
		if (cfg.hold.events) {
			config.hold.events = config.hold.events.map(clone);
		}
	}
};

const getConfig  = () => config;

const resetDefaultConfig = () => configure({
	hold: defaultHoldConfig,
	flick: defaultFlickConfig
});

resetDefaultConfig();

export default configure;
export {
	configure,
	getConfig,
	resetDefaultConfig
};
