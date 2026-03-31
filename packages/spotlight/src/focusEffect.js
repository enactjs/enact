/**
 * Manages the global spotlight focus effect configuration.
 *
 * App developers can set `focusEffectClass` once (e.g. in their app root) to apply a
 * custom CSS class to every focused spottable component.
 *
 * example: const App = SpotlightRootDecorator({ focusEffectClass: css.appFocusClass }, AppBase);
 *
 * @module spotlight/focusEffect
 * @private
 */

const focusEffect = {
	className: null
};

/**
 * Sets the global CSS class name to apply to any spottable component when it receives spotlight
 * focus. This acts as an app-wide default.
 *
 * Example:
 * ```js
 * import { setFocusEffectClass } from '@enact/spotlight';
 * setFocusEffectClass(css.appFocusClass);
 * ```
 *
 * @param {String|null} className  CSS class to apply when a component is focused. Pass `null` or an empty string to clear.
 * @memberof spotlight/focusEffect
 * @public
 */
const setFocusEffectClass = (className) => {
	focusEffect.className = className || null;
};

/**
 * Returns the currently configured global focus effect class, or `null` if none is set.
 *
 * @returns {String|null}
 * @memberof spotlight/focusEffect
 * @private
 */
const getFocusEffectClass = () => focusEffect.className;

export {
	getFocusEffectClass,
	setFocusEffectClass
};
