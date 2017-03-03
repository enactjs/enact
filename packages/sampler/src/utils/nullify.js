/*
 *
 * Use for props that can take null value so that Storybook doesn't complain.
 * example use:
 * `nullify(select('propName', [null, 'value', 'two']))`
 * `nullify(select('propName', ['', 'value', 'two']))`
 *
*/

const nullify = (v) => v === '' ? null : v;

export default nullify;
