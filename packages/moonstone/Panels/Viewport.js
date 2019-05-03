import classnames from 'classnames';
import {forward, handle} from '@enact/core/handle';
import Spotlight from '@enact/spotlight';
import Pause from '@enact/spotlight/Pause';
import ViewManager, {shape} from '@enact/ui/ViewManager';
import invariant from 'invariant';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import css from './Panels.module.less';

/**
 * The container for a set of Panels
 *
 * @class Viewport
 * @memberof moonstone/Panels
 * @private
 */
const ViewportBase = class extends React.Component {
	static displayName = 'Viewport'

	static propTypes = /** @lends moonstone/Panels.Viewport.prototype */ {

		/**
		 * A function that generates a globally-unique identifier for a panel index
		 *
		 * @type {Function}
		 * @required
		 */
		generateId: PropTypes.func.isRequired,

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
		children: PropTypes.node,

		/**
		 * Index of the active panel
		 *
		 * @type {Number}
		 * @default 0
		 */
		index: PropTypes.number,

		/**
		 * Disable panel transitions
		 *
		 * @type {Boolean}
		 * @default false
		 */
		noAnimation: PropTypes.bool
	}

	static defaultProps = {
		index: 0,
		noAnimation: false
	}

	constructor () {
		super();

		this.paused = new Pause('Viewport');
		this.state = {
			prevIndex: -1,
			direction: 'forward'
		};
	}

	static getDerivedStateFromProps (props, state) {
		return {
			prevIndex: props.index,
			direction: state.prevIndex > props.index ? 'backward' : 'forward'
		};
	}

	componentDidMount () {
		// eslint-disable-next-line react/no-find-dom-node
		this.node = ReactDOM.findDOMNode(this);
	}

	componentWillUnmount () {
		this.paused.resume();
	}

	addTransitioningClass = () => {
		if (this.node) {
			this.node.classList.add(css.transitioning);
		}

		return true;
	}

	removeTransitioningClass = () => {
		if (this.node) {
			this.node.classList.remove(css.transitioning);
		}

		return true;
	}

	pause = () => this.paused.pause()

	resume = () => this.paused.resume()

	handle = handle.bind(this)

	handleTransition = this.handle(
		forward('onTransition'),
		this.removeTransitioningClass,
		this.resume
	)

	handleWillTransition = this.handle(
		forward('onWillTransition'),
		this.addTransitioningClass,
		this.pause
	)

	mapChildren = (children, generateId) => React.Children.map(children, (child, index) => {
		if (child) {
			const {spotlightId = generateId(index, 'panel-container', Spotlight.remove)} = child.props;
			const props = {
				spotlightId,
				'data-index': index
			};

			if (child.props.autoFocus == null && this.state.direction === 'forward') {
				props.autoFocus = 'default-element';
			}

			return React.cloneElement(child, props);
		} else {
			return null;
		}
	})

	getEnteringProp = (noAnimation) => noAnimation ? null : 'hideChildren'

	render () {
		const {arranger, children, generateId, index, noAnimation, ...rest} = this.props;
		const enteringProp = this.getEnteringProp(noAnimation);
		const mappedChildren = this.mapChildren(children, generateId);
		const className = classnames(css.viewport, rest.className);

		const count = React.Children.count(mappedChildren);
		invariant(
			index === 0 && count === 0 || index < count,
			`Panels index, ${index}, is invalid for number of children, ${count}`
		);

		return (
			<ViewManager
				{...rest}
				arranger={arranger}
				className={className}
				component="main"
				duration={250}
				enteringDelay={100} // TODO: Can we remove this?
				enteringProp={enteringProp}
				index={index}
				noAnimation={noAnimation}
				onTransition={this.handleTransition}
				onWillTransition={this.handleWillTransition}
			>
				{mappedChildren}
			</ViewManager>
		);
	}
};

export default ViewportBase;
export {
	ViewportBase as Viewport,
	ViewportBase
};
