import kind from '@enact/core/kind';
import React from 'react';
import Resizable from '@enact/ui/Resizable';
import {SpotlightContainerDecorator} from '@enact/spotlight';
import Transition from '@enact/ui/Transition';

/**
 * Changes spotlight focus to transition container when opening the container if the previously focused
 * component is contained.
 *
 * @class ExpandableTransitionContainer
 * @private
 */

const ExpandableTransitionContainerBase = kind({
	name: 'ExpandableTransitionContainer',

	propTypes: {
		/**
		 * Set the visibility of the component, which determines whether it's on screen or off.
		 *
		 * @type {Boolean}
		 * @default true
		 * @private
		 */
		visible: React.PropTypes.bool
	},

	render (props) {
		return (
			<Transition {...props} />
		);
	}
});

const ExpandableTransitionContainer = SpotlightContainerDecorator(
	Resizable(
		{resize: 'onTransitionEnd', filter: (ev) => ev.propertyName !== 'height'},
		ExpandableTransitionContainerBase
	)
);

export default ExpandableTransitionContainer;
export {ExpandableTransitionContainer, ExpandableTransitionContainerBase};
