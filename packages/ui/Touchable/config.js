
/*
 * Configures the behavior of the flick gesture. It accepts the following parameters
 *
 * * `maxDuration` - The amount of time, in milliseconds, to complete a flick gesture before it
 *   is cancelled. Defaults to 250.
 * * `maxMoves` - The number of moves tracked to determine if a flick occurred. Defaults to `5`.
 * * `minVelocity` - The minimum threshold, measured as the change in pixels over the change in
 *   time per move, that must be exceeded to generate a `onFlick` event.
 *
 * @type {Object}
 */
const defaultFlickConfig = {
	maxDuration: 250,
	maxMoves: 5,
	minVelocity: 0.1
};

/*
 * Configures the behavior of the hold gesture. It accepts the following parameters
 *
 * * `cancelOnMove` - When `true`, the hold is cancelled when moving beyond the `moveTolerance`.
 *   Defaults to `false`
 * * `moveTolerance` - The number of pixels from the start position of the hold that the pointer
 *   may move before cancelling the hold. Ignored when `cancelOnMove` is `false`. Defaults to
 *   `16`.
 * * `frequency` - The time, in milliseconds, to poll for hold events. Defaults to `200`.
 * * `events` - An array of `onHold` events which each contain a `name` and `time`. The `time`
 *   controls the amount of time that must pass before this `onHold` event is fired and should
 *   be a multiple of `frequency`.
 *
 * @type {Object}
 */
const defaultHoldConfig = {
	cancelOnMove: false,
	moveTolerance: 16,
	frequency: 200,
	events: [
		{name: 'hold', time: 200}
	]
};

let config = {
	hold: {},
	flick: {}
};

const configure = (cfg) => {
	if (cfg.flick) {
		Object.assign(config.flick, cfg.flick);
	}

	if (cfg.hold) {
		Object.assign(config.hold, cfg.hold);

		// deeply clone the array to avoid mutating the config directly
		if (cfg.hold.events) {
			config.hold.events = config.hold.events.map(o => Object.assign({}, o));
		}
	}
};

const getConfig  = () => config;

configure({
	hold: defaultHoldConfig,
	flick: defaultFlickConfig
});

export default configure;
export {
	configure,
	getConfig
};
