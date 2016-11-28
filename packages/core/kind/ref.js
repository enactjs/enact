import rMerge from 'ramda/src/merge';

/*
 * Simplifies reference caching for stateless components by adding a function to props that can
 * store a named reference to rendered DOM node.
 *
 * ```
 * const Control = kind({
 *   computed: {
 *     handleSubmit: ({ref, onSubmit}) => {
 *       onSubmit(ref.input.value)
 *       ref.input.value = ''
 *     }
 *   },
 *   render: ({ ref, handleSubmit }) => {
 *     return (
 *       <div>
 *         <input ref={ref('input')} />
 *         <button onClick={handleSubmit}>Add</button>
 *       </div>
 *     )
 *   }
 * });
 * ```
 *
 * @returns {Function} Function accepting props which will be augmented with a `ref` property
 * @method propTypes
 * @public
 */
const ref = () => (props) => {
	const captureRef = (name) => (n) => (captureRef[name] = n);
	return rMerge(props, {ref: captureRef});
};

export default ref;
export {ref};
