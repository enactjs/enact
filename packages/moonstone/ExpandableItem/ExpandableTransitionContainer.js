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
		'data-container-id': React.PropTypes.string,
		autoFocus: React.PropTypes.bool
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
