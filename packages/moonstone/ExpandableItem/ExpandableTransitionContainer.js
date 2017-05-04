import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Resizable from '@enact/ui/Resizable';
import SpotlightContainerDecorator from '@enact/spotlight/SpotlightContainerDecorator';
import Transition from '@enact/ui/Transition';
import {contextTypes} from './ExpandableContainer';

/**
 * Changes spotlight focus to transition container when opening the container if the previously focused
 * component is contained.
 *
 * @class ExpandableTransitionContainer
 * @private
 */

const ExpandableTransitionContainerBase = kind({
	name: 'ExpandableTransitionContainer',

	contextTypes: contextTypes,

	propTypes: {
		/**
		 * Set the visibility of the component, which determines whether it's on screen or off.
		 *
		 * @type {Boolean}
		 * @default true
		 * @private
		 */
		visible: PropTypes.bool
	},

	render (props, context) {
		return (
			<Transition
				{...props}
				onHide={context.onTransitionEnd}
				onShow={context.onTransitionEnd}
			/>
		);
	}
});

const ExpandableTransitionContainer = SpotlightContainerDecorator(
	Resizable(
		{resize: 'onTransitionEnd', filter: (ev) => ev.propertyName === 'height'},
		ExpandableTransitionContainerBase
	)
);

export default ExpandableTransitionContainer;
export {ExpandableTransitionContainer, ExpandableTransitionContainerBase};
