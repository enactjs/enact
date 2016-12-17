/**
 * Exports the {@link moonstone/VirtualFlexList/Positionable.Positionable} component.
 *
 * @module moonstone/VirtualFlexList/Positionable
 */

import clamp from 'ramda/src/clamp';
import React, {Component, PropTypes} from 'react';

import hoc from '@enact/core/hoc';

const
	dataIndexAttribute = 'data-index',
	doc = (typeof window === 'object') ? window.document : {},
	nop = () => {};

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
			 * Called whtn position updates internally
			 *
			 * @type {Function}
			 * @public
			 */
			doPosition: PropTypes.func,

			/**
			 * Support 5 way navigation and wheel event handling with spotlight
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			gesture: PropTypes.bool
		}

		static defaultProps = {
			gesture: false,
			doPosition: nop,
			x: 0,
			y: 0
		}

		// internal variables

		// status
		childRef = null

		// spotlight
		lastFocusedItem = null

		// event handling

		onFocus = (e) => {
			if (this.props.gesture) {
				const
					item = e.target,
					index = item.getAttribute(dataIndexAttribute),
					key = item.getAttribute('key');
				let pos;

				// For VirtualList
				if (this.childRef.calculatePositionOnFocus) {
					if (index && item !== this.lastFocusedItem && item === doc.activeElement) {
						pos = this.childRef.calculatePositionOnFocus(index, key);
					}
				// For VirtualFlexList
				} else if (this.childRef.calculateFlexPositionOnFocus) {
					pos = this.childRef.calculateFlexPositionOnFocus(index, key);
				}
				if (pos) {
					if (pos.left !== this.props.x || pos.top !== this.props.y) {
						this.props.doPosition({x: pos.left, y: pos.top});
					}
					this.lastFocusedItem = item;
				}
			}
		}

		onKeyDown = (e) => {
			if (this.props.gesture && this.childRef.setSpotlightContainerRestrict) {
				const index = e.target.getAttribute(dataIndexAttribute);
				this.childRef.setSpotlightContainerRestrict(e.keyCode, index);
			}
		}

		onWheel = (ev) => {
			if (this.props.gesture) {
				let y;

				ev.preventDefault();

				if (ev.deltaY > 0) {
					y = clamp(0, this.bounds.maxTop, this.props.y + this.bounds.clientHeight);
				} else if (ev.deltaY < 0) {
					y = clamp(0, this.bounds.maxTop, this.props.y - this.bounds.clientHeight);
				} else {
					y = this.props.y;
				}
				this.props.doPosition({x: null, y});
			}
		}

		// positioning

		doPosition () {
			this.props.doPosition({x: this.scrollLeft, y: this.scrollTop});
		}

		// life cycle methods

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

		// eslint-disabled-next-line no-return-assign
		initChildRef = (ref) => (this.childRef = ref)

		render () {
			const
				{onFocus, onKeyDown, onKeyUp, onWheel} = this,
				props = Object.assign({}, this.props, (this.props.gesture) ? {
					onFocus,
					onKeyDown,
					onKeyUp,
					onWheel
				} : {});

			delete props.doPosition;
			delete props.x;
			delete props.y;
			delete props.gesture;

			return (<Wrapped {...props} ref={this.initChildRef} />);
		}
	};
});

export default Positionable;
export {Positionable};
