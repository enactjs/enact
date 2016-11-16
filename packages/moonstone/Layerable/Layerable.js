/**
 * Exports the {@link module:@enact/ui/Layerable~Layerable} Higher-order Component (HOC).
 *
 * @module @enact/ui/Layerable
 */

import hoc from '@enact/core/hoc';
import React, {PropTypes} from 'react';

const defaultConfig = {
	/**
	 * Indicates where component should attach to.
	 *
	 * @type {String}
	 * @default 'window'
	 * @public
	 */
	target: 'window'
};

/**
 * {@link module:@enact/ui/Layerable~Layerable} is a Higher-order Component that applies a 'Layerable' behavior
 * to its wrapped component.
 *
 *
 * By default, Layerable applies applies positioning information to a component, whether it's a
 * floating layer or inline layer. Relative positions, anchored positions, orientations like
 * "up+right" from the anchor point are planned for future support to more easily handle scenarios
 * like Tooltip and ContextualPopup.
 *
 *
 * @class Layerable
 * @ui
 * @public
 */
const LayerableHOC = hoc(defaultConfig, (config, Wrapped) => {
	return class Layerable extends React.Component {
		static propTypes = {
			/**
			 * Coordinates object of the layer. Supports top, right, bottom, left anchoring measurements.
			 *
			 * More to be added later as things like FloatingLayer and more elaborate anchoring
			 * scenarios are discovered.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			anchor: PropTypes.object
		}

		static defaultProps = {
			anchor: {}
		}

		render () {
			const props = Object.assign({}, this.props);
			if (config.target == 'window') {
				props.style = {
					...props.style,
					'position': 'absolute'
				};
			} else {
				// TODO: need to handle activator case
			}

			// Insert styles from the user, from our defaults, and from our wrapped component defaults
			props.style = {...props.style, ...props.anchor, ...Wrapped.defaultProps.anchor};

			delete props.anchor;

			return <Wrapped {...props} />;
		}
	};
});

export default LayerableHOC;
export {LayerableHOC as Layerable};
