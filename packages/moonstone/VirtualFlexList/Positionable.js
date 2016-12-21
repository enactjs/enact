/**
 * Exports the {@link moonstone/VirtualFlexList.Positionable} component.
 *
 * @module moonstone/Positionable
 */

import clamp from 'ramda/src/clamp';
import React, {Component, PropTypes} from 'react';

import hoc from '@enact/core/hoc';

const
	dataIndexAttribute = 'data-index',
	doc = (typeof window === 'object') ? window.document : {},
	nop = () => {};

/**
 * {@link moonstone/VirtualFlexList.Positionable} is a Higher-order Component
 * to move its wrapped component.
 *
 * @class Positionable
 * @memberof moonstone/VirtualFlexList
 * @hoc
 * @public
 */
const Positionable = hoc((config, Wrapped) => {
	return class extends Component {
		static propTypes = {
			/**
			 * Position x.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			x: PropTypes.number.isRequired,

			/**
			 * Position y.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			y: PropTypes.number.isRequired,

			/**
			 * Support 5 way navigation and wheel event handling with spotlight
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			navigation: PropTypes.bool,

			/**
			 * Called when position updates internally
			 *
			 * @type {Function}
			 * @public
			 */
			setPosition: PropTypes.func
		}

		static defaultProps = {
			navigation: false,
			setPosition: nop,
			x: 0,
			y: 0
		}

		/*
		 * Class private variables
		 */

		// status
		childRef = null

		// spotlight
		lastFocusedItem = null

		/*
		 * Event handling
		 */

		onFocus = (e) => {
			if (this.props.navigation) {
				const
					item = e.target,
					index = item.getAttribute(dataIndexAttribute),
					key = item.getAttribute('key');
				let pos;

				// For VirtualList
				if (this.childRef.calculatePositionOnFocus) {
					if (index && item !== this.lastFocusedItem && item === doc.activeElement) {
						pos = this.childRef.calculatePositionOnFocus(index);
					}
				// For VirtualFlexList
				} else if (this.childRef.calculateFlexPositionOnFocus && typeof index === 'string') {
					pos = this.childRef.calculateFlexPositionOnFocus(index, key);
				}

				if (pos) {
					if (pos.left !== this.props.x || pos.top !== this.props.y) {
						this.props.setPosition({x: pos.left, y: pos.top});
					}
					this.lastFocusedItem = item;
				}
			}
		}

		onKeyDown = (e) => {
			if (this.props.navigation && this.childRef.setSpotlightContainerRestrict) {
				const index = e.target.getAttribute(dataIndexAttribute);
				this.childRef.setSpotlightContainerRestrict(e.keyCode, index);
			}
		}

		onWheel = (e) => {
			if (this.props.navigation && e.deltaY) {
				e.preventDefault();
				this.props.setPosition({x: this.props.x, y: clamp(0, this.bounds.maxTop, this.props.y + this.bounds.clientHeight * Math.sign(e.deltaY))});
			}
		}

		/*
		 * Life cycle methods
		 */

		componentDidMount () {
			this.bounds = this.childRef.getScrollBounds();
		}

		componentWillReceiveProps (nextProps) {
			const {x, y} = this.props;

			if (x !== nextProps.x || y !== nextProps.y) {
				this.childRef.setScrollPosition(
					clamp(0, this.bounds.maxLeft, nextProps.x),
					clamp(0, this.bounds.maxTop, nextProps.y),
					Math.sign(nextProps.x - x),
					Math.sign(nextProps.y - y)
				);
			}
		}

		initChildRef = (ref) => {
			this.childRef = ref;
		}

		render () {
			const
				{onFocus, onKeyDown, onKeyUp, onWheel} = this,
				props = Object.assign({}, this.props, (this.props.navigation) ? {
					onFocus,
					onKeyDown,
					onKeyUp,
					onWheel
				} : {});

			delete props.navigation;
			delete props.setPosition;
			delete props.x;
			delete props.y;

			return (<Wrapped {...props} ref={this.initChildRef} />);
		}
	};
});

export default Positionable;
export {Positionable};
