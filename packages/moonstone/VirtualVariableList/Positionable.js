/**
 * Exports the {@link moonstone/VirtualVariableList/Positionable.Positionable} component.
 *
 * @module moonstone/VirtualVariableList/Positionable
 */

import React, {Component, PropTypes} from 'react';

import hoc from '@enact/core/hoc';

const PositionableHoc = hoc((config, Wrapped) => {
	return class Positionable extends Component {
		static propTypes = {
			/**
			 * Position x.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			posX: PropTypes.number,

			/**
			 * Position y.
			 *
			 * @type {Number}
			 * @default 0
			 * @public
			 */
			posY: PropTypes.number
		}

		static defaultProps = {
			posX: 0,
			posY: 0
		}

		constructor (props) {
			super(props);

			this.initVirtualListRef = this.initRef('virtualListRef');
		}

		initRef (prop) {
			return (ref) => {
				this[prop] = ref;
			};
		}

		componentWillReceiveProps (nextProps) {
			const {posX, posY} = this.props;

			if (posX !== nextProps.posX || posY !== nextProps.posY) {
				this.virtualListRef.setScrollPosition(
					nextProps.posX,
					nextProps.posY,
					Math.sign(nextProps.posX - posX),
					Math.sign(nextProps.posY - posY)
				);
			}
		}

		render () {
			const props = Object.assign({}, this.props);

			delete props.posX;
			delete props.posY;

			return (<Wrapped {...props} ref={this.initVirtualListRef} />);
		}
	};
});

export default PositionableHoc;
export {PositionableHoc};
