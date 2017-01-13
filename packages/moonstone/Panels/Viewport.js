import {findDOMNode} from 'react-dom';
import {forward} from '@enact/core/handle';
import kind from '@enact/core/kind';
import ViewManager, {shape} from '@enact/ui/ViewManager';
import invariant from 'invariant';
import React from 'react';
import Spotlight, {spottableClass} from '@enact/spotlight';

import css from './Panels.less';

const findNode = (view) => {
	// eslint-disable-next-line react/no-find-dom-node
	return findDOMNode(view);
};

const spotPanel = ({view, lastFocusedIndex}) => {
	const node = findNode(view);

	if (node) {
		let lastFocusedSpottable;

		if (lastFocusedIndex >= 0) {
			const spottables = node.querySelectorAll(`.${spottableClass}`);
			if (lastFocusedIndex < spottables.length) {
				lastFocusedSpottable = spottables[lastFocusedIndex];
			}
		}

		const spottable = lastFocusedSpottable || node.querySelector(`section .${spottableClass}`) || node.querySelector(`header .${spottableClass}`);

		if (spottable) {
			Spotlight.focus(spottable);
		}
	}
};

const initialFocusedIndex = -1;
const forwardOnAppear = forward('onAppear');
const forwardOnEnter = forward('onEnter');
const forwardOnTransition = forward('onTransition');
const forwardOnWillTransition = forward('onWillTransition');

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
		noAnimation: React.PropTypes.bool,

		/**
		 * Called when each view is rendered during initial construction.
		 *
		 * @type {Function}
		 */
		onAppear: React.PropTypes.func,

		/**
		 * Called when each view completes its transition into the viewport.
		 *
		 * @type {Function}
		 */
		onEnter: React.PropTypes.func,

		/**
		 * Called once when all views have completed their transition.
		 *
		 * @type {Function}
		 */
		onTransition: React.PropTypes.func,

		/**
		 * Called once before views begin their transition.
		 *
		 * @type {Function}
		 */
		onWillTransition: React.PropTypes.func
	},

	defaultProps: {
		index: 0,
		noAnimation: false
	},

	styles: {
		css,
		className: 'viewport'
	},

	computed: {
		children: ({children}) => React.Children.map(children, (child, index) => {
			return React.cloneElement(child, {'data-index': index});
		})
	},

	render: ({arranger, children, index, noAnimation, onAppear, onEnter, onTransition, onWillTransition, ...rest}) => {
		const count = React.Children.count(children);
		invariant(
			index === 0 && count === 0 || index < count,
			`Panels index, ${index}, is invalid for number of children, ${count}`
		);

		return (
			<ViewManager
				{...rest}
				noAnimation={noAnimation}
				arranger={arranger}
				duration={200}
				index={index}
				component="main"
				onAppear={onAppear}
				onEnter={onEnter}
				onTransition={onTransition}
				onWillTransition={onWillTransition}
			>
				{children}
			</ViewManager>
		);
	}
});

/**
 * A stateful component that helps ViewportBase by handling life-cycle and focus management tasks.
 *
 * @class Viewport
 * @private
 */
class Viewport extends React.Component {
	static displayName = 'Viewport';

	static propTypes = /** @lends Viewport.prototype */ {
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
	}

	static defaultProps = {
		index: 0,
		noAnimation: false
	}

	constructor (props) {
		super(props);
		this.state = {
			lastFocusedIndices: React.Children.map(this.props.children, () => {
				return initialFocusedIndex;
			})
		};
	}

	componentWillReceiveProps (nextProps) {
		const {index} = this.props;
		const node = findNode(this);
		const current = Spotlight.getCurrent();

		if (index !== nextProps.index && node.contains(current)) {
			const {lastFocusedIndices} = this.state;
			// we must convert our NodeList to an Array in order to find the index of current
			lastFocusedIndices[index] = [].slice.call(node.querySelectorAll(`.${spottableClass}`)).indexOf(current);
			this.setState({lastFocusedIndices});
		}
	}

	handleAppear = ({view}) => {
		spotPanel({view, lastFocusedIndex: this.state.lastFocusedIndices[this.props.index]});
		forwardOnAppear(view, this.props);
	}

	handleEnter = ({view}) => {
		spotPanel({view, lastFocusedIndex: this.state.lastFocusedIndices[this.props.index]});
		forwardOnEnter(view, this.props);
	}

	handleTransition = () => {
		Spotlight.resume();
		forwardOnTransition(null, this.props);
	}

	handleWillTransition = () => {
		Spotlight.pause();
		forwardOnWillTransition(null, this.props);
	}

	render () {
		const {children, ...rest} = this.props;

		return (
			<ViewportBase {...rest} onAppear={this.handleAppear} onEnter={this.handleEnter} onTransition={this.handleTransition} onWillTransition={this.handleWillTransition}>
				{children}
			</ViewportBase>
		);
	}
}

export default Viewport;
export {Viewport, ViewportBase};
