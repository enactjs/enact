import {Spotlight, SpotlightContainerDecorator} from '@enact/spotlight';
import Transition from '@enact/ui/Transition';
import React from 'react';

/**
 * Changes spotlight focus to transition container when opening the container if the previously focused
 * component is contained.
 *
 * @class ExpandableTransitionContainer
 * @private
 */

const ExpandableTransitionContainerBase = class extends React.Component {
	static displayName = 'ExpandableTransitionContainer'

	static propTypes = {
		/**
		 * Set the spotlight container id of the Transition control.
		 *
		 * @type {String}
		 * @default ''
		 * @public
		 */
		'data-container-id': React.PropTypes.string,

		/**
		 * Whether the contents of the container should receive spotlight focus when becoming visible.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		autoFocus: React.PropTypes.bool,

		/**
		 * Set the visibility of the component, which determines whether it's on screen or off.
		 *
		 * @type {Boolean}
		 * @default true
		 * @public
		 */
		visible: React.PropTypes.bool
	}

	static defaultProps = {
		autoFocus: true
	}

	componentDidUpdate (prevProps) {
		if (this.props.visible && !prevProps.visible && this.props.autoFocus && !Spotlight.getPointerMode()) {
			Spotlight.focus(this.props['data-container-id']);
		}
	}

	render () {
		const props = Object.assign({}, this.props);
		delete props.autoFocus;
		return (
			<Transition {...props} />
		);
	}
};

const ExpandableTransitionContainer = SpotlightContainerDecorator(ExpandableTransitionContainerBase);

export default ExpandableTransitionContainer;
export {ExpandableTransitionContainer, ExpandableTransitionContainerBase};
