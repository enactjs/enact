/**
 * Exports the {@link ui/Remeasurable.Remeasurable} Higher-order Component (HOC),
 * and its contextTypes. The default export is {@link ui/Remeasurable.Remeasurable}.
 *
 * @module ui/Remeasurable
 * @private
 */
import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';

/**
 * Context propTypes for Remeasurable
 *
 * @memberof ui/Remeasurable.Remeasurable
 * @private
 */
const contextTypes = {
	/**
	 * Notifies child of a change in size from a parent. This value type is set to
	 * `any`, because the value truly doesn't matter. The value is meant to be a trigger,
	 * to the wrapped component to remeasure it self. A boolean is typically the easiest
	 * to use as a trigger.
	 *
	 * @memberof ui/Remeasurable.Remeasurable.contextTypes
	 * @private
	 */
	remeasure: PropTypes.any
};

/**
 * {@link ui/Remeasurable.Remeasurable} is a Higher-order Component which
 * notifies a child of a change in size from parent. This can then be used to trigger
 * a new measurement. A `remeasure` prop will be passed down to the wrapped component.
 *
 * @class Remeasurable
 * @memberof ui/Remeasurable
 * @hoc
 * @private
 */

const Remeasurable = getContext(contextTypes);

export default Remeasurable;
export {Remeasurable, contextTypes};
