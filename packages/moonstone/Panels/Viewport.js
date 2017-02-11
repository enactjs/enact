import {findDOMNode} from 'react-dom';
import {forward, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import ViewManager, {shape} from '@enact/ui/ViewManager';
import invariant from 'invariant';
import React from 'react';
import Spotlight, {spottableClass} from '@enact/spotlight';

import css from './Panels.less';

const initialFocusIndex = -1;

/**
 * The container for a set of Panels
 *
 * @class ViewportBase
 * @private
 */
const ViewportBase = kind({
	name: 'ViewportBase',

	propTypes: /** @lends ViewportBase.prototype */ {
		/**
		 * Set of functions that control how the panels are transitioned into and out of the
		 * viewport
		 *
		 * @type {Arranger}
		 */
		arranger: shape,

		/**
		 * Panels to be rendered
		 *
		 * @type {Panel}
		 */
		children: React.PropTypes.node,

		/**
		 * Index of the active panel
		 *
		 * @type {Number}
		 * @default 0
		 */
		index: React.PropTypes.number,

		/**
		 * Disable panel transitions
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noAnimation: React.PropTypes.bool
	},

	defaultProps: {
		index: 0,
		noAnimation: false
	},

	styles: {
		css,
		className: 'viewport'
	},

	handlers: {
		onTransition: handle(forward('onTransition'), Spotlight.resume),
		onWillTransition: handle(forward('onWillTransition'), Spotlight.pause)
	},

	computed: {
		children: ({children}) => React.Children.map(children, (child, index) => {
			return React.cloneElement(child, {'data-index': index});
		}),
		enteringProp: ({noAnimation}) => noAnimation ? null : 'showChildren'
	},

	render: ({arranger, children, enteringProp, index, noAnimation, ...rest}) => {
		const count = React.Children.count(children);
		invariant(
			index === 0 && count === 0 || index < count,
			`Panels index, ${index}, is invalid for number of children, ${count}`
		);

		return (
			<ViewManager
				{...rest}
				arranger={arranger}
				component="main"
				duration={250}
				enteringDelay={100}
				enteringProp={enteringProp}
				index={index}
				noAnimation={noAnimation}
			>
				{children}
			</ViewManager>
		);
	}
});

/**
 * A stateful container for a set of Panels, which manages the last-focused spottable component
 * for each view
 *
 * @class Viewport
 * @private
 */
class Viewport extends React.Component {
	static displayName = 'Viewport';

	static propTypes = /** @lends Viewport.prototype */ {
		/**
		 * Panels to be rendered
		 *
		 * @type {Panel}
		 */
		children: React.PropTypes.node,

		/**
		 * Index of the active panel
		 *
		 * @type {Number}
		 * @default 0
		 */
		index: React.PropTypes.number
	}

	static defaultProps = {
		index: 0
	}

	constructor (props) {
		super(props);
		this.state = {
			lastFocusIndices: React.Children.map(this.props.children, () => {
				return initialFocusIndex;
			})
		};
	}

	componentWillReceiveProps (nextProps) {
		const {index, children} = this.props;
		const {index: nextIndex, children: nextChildren} = nextProps;
		const childrenCount = React.Children.count(children);
		const nextChildrenCount = React.Children.count(nextChildren);
		const childrenChanged = childrenCount !== nextChildrenCount;
		const indexChanged = index !== nextIndex;

		if (childrenChanged || indexChanged) {
			let {lastFocusIndices} = this.state;

			if (childrenChanged) {
				lastFocusIndices = React.Children.map(nextChildren, (nextChild, nextChildIndex) => {
					return nextChildIndex < childrenCount ? lastFocusIndices[nextChildIndex] : initialFocusIndex;
				});
			}

			if (indexChanged) {
				// eslint-disable-next-line react/no-find-dom-node
				const node = findDOMNode(this);
				const current = Spotlight.getCurrent();
				const isIndexValid = index < nextChildrenCount - 1;

				if (node.contains(current)) {
					if (isIndexValid) {
						// we convert our NodeList to an Array in order to find the index of current
						lastFocusIndices[index] = [].slice.call(node.querySelectorAll(`.${spottableClass}`)).indexOf(current);
					}
				} else {
					if (isIndexValid) {
						lastFocusIndices[index] = initialFocusIndex;
					}
					if (!(!Spotlight.getPointerMode() && !current)) {
						lastFocusIndices[nextIndex] = false;
					}
				}
			}

			this.setState({lastFocusIndices});
		}
	}

	render () {
		const {children, index, ...rest} = this.props;
		const views = React.Children.map(children, (child) => {
			return React.cloneElement(child, {'data-focus-index': this.state.lastFocusIndices[index]});
		});

		return (
			<ViewportBase {...rest} index={index}>
				{views}
			</ViewportBase>
		);
	}
}

export default Viewport;
export {Viewport, ViewportBase};
