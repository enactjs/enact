/**
 * Default configuration for {@link spotlight/Spottable.Spottable}.
 */
export interface SpottableConfig {
	/**
	 * Whether or not the component should emulate mouse events as a response
	 * to Spotlight 5-way events.
	 */
	emulateMouse: boolean;
}

/**
 * Configuration passed to {@link spotlight/Spottable.SpottableCore}.
 */
export interface SpottableCoreConfig {
	emulateMouse?: boolean;
}
