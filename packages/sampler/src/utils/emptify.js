/*
 *
 * Use for knobs that return undefined or null and convert it to an empty string.
 * example use:
 * `emptify(select('propName', [null, 'value', 'two']))`
 * `emptify(select('propName', [undefined, 'value', 'two']))`
 * `emptify(boolean('propName', false))`
 *
*/

const emptify = (v) => !v ? '' : v;

export default emptify;
export {
	emptify
};
