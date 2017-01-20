/*
 * Exports the {@link moonstone/VirtualFlexList.Positionable} component.
 */

import clamp from 'ramda/src/clamp';
import hoc from '@enact/core/hoc';
import React, {Component, PropTypes} from 'react';

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
 * @private
 */
const Positionable = hoc((config, Wrapped) => {
	return class extends Component {
		static propTypes = /** @lends moonstone/VirtualFlexList.Positionable.prototype */ {
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
			handlesNavigation: PropTypes.bool,

			/**
			 * Called when position updates internally
			 *
			 * The object including `x`, `y` properties for position,
			 * are passed as the parameters of the `onPositionChange` callback function.
			 *
			 * @type {Function}
			 * @public
			 */
			onPositionChange: PropTypes.func
		}

		static defaultProps = {
			handlesNavigation: false,
			onPositionChange: nop,
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
					this.props.onPositionChange({
						x: clamp(0, this.bounds.maxLeft, pos.left),
						y: clamp(0, this.bounds.maxTop, pos.top)
					});
				}
				this.lastFocusedItem = item;
			}
		}

		onKeyDown = (e) => {
			if (this.childRef.setSpotlightContainerRestrict) {
				const index = e.target.getAttribute(dataIndexAttribute);
				this.childRef.setSpotlightContainerRestrict(e.keyCode, index);
			}
		}

		onWheel = (e) => {
			if (e.deltaY) {
				e.preventDefault();
				this.props.onPositionChange({x: this.props.x, y: clamp(0, this.bounds.maxTop, this.props.y + this.bounds.clientHeight * Math.sign(e.deltaY))});
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
				{onFocus, onKeyDown, onWheel} = this,
				props = Object.assign({}, this.props, (this.props.handlesNavigation) ? {
					onFocus,
					onKeyDown,
					onWheel
				} : {});

			delete props.handlesNavigation;
			delete props.onPositionChange;
			delete props.x;
			delete props.y;

			return (<Wrapped {...props} ref={this.initChildRef} />);
		}
	};
});

export default Positionable;
export {Positionable};
