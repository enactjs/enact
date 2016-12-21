/**
 * Exports the {@link moonstone/VirtualFlexList/Positionable.Positionable} component.
 *
 * @module moonstone/VirtualFlexList/Positionable
 */

import React, {Component, PropTypes} from 'react';

import hoc from '@enact/core/hoc';

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
			x: PropTypes.number,

			/**
			 * Position y.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			y: PropTypes.number
		}

		static defaultProps = {
			x: 0,
			y: 0
		}

		// eslint-disabled-next-line no-return-assign
		initVirtualListRef = (ref) => (this.virtualListRef = ref)

		componentWillReceiveProps (nextProps) {
			const {x, y} = this.props;

			if (x !== nextProps.x || y !== nextProps.y) {
				this.virtualListRef.setScrollPosition(
					nextProps.x,
					nextProps.y,
					Math.sign(nextProps.x - x),
					Math.sign(nextProps.y - y)
				);
			}
		}

		render () {
			const props = Object.assign({}, this.props);

			delete props.x;
			delete props.y;

			return (<Wrapped {...props} ref={this.initVirtualListRef} />);
		}
	};
});

export default Positionable;
export {Positionable};
