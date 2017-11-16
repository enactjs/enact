import {on, off} from '@enact/core/dispatcher';
import {Job} from '@enact/core/util';
import invariant from 'invariant';
import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

import Cancelable from '../Cancelable';

import {contextTypes} from './FloatingLayerDecorator';
import Scrim from './Scrim';

/**
 * {@link ui/FloatingLayer.FloatingLayerBase} is a component that creates an entry point to the new
 * render tree. This is used for modal components such as popups.
 *
 * @class FloatingLayerBase
 * @memberof ui/FloatingLayer
 * @ui
 * @public
 */
class FloatingLayerBase extends React.Component {
	static displayName = 'FloatingLayer'

	static contextTypes = contextTypes

	static propTypes = /** @lends ui/FloatingLayer.FloatingLayerBase.prototype */ {
		/**
		 * When `true`, FloatingLayer will not hide when the user presses `ESC` key.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: PropTypes.bool,

		/**
		 * A function to be run when floating layer is closed.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * A function to be run when `ESC` key is pressed. The function will only invoke if
		 * `noAutoDismiss` is set to `false`.
		 *
		 * @type {Function}
		 * @public
		 */
		onDismiss: PropTypes.func,

		/**
		 * A function to be run when floating layer is opened. It will only be invoked for the first render.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * When `true`, the floating layer and its components will be rendered.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * The scrim type. It can be either `'transparent'`, `'translucent'`, or `'none'`.
		 *
		 * @type {String}
		 * @default 'translucent'
		 * @public
		 */
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none'])
	}

	static defaultProps = {
		noAutoDismiss: false,
		open: false,
		scrimType: 'translucent'
	}

	componentDidMount () {
		if (this.props.open) {
			this.renderFloatingLayer(this.props);
		}
	}

	componentWillReceiveProps (nextProps) {
		if (!this.props.open && nextProps.open) {
			this.renderFloatingLayer(nextProps, this.props.open);
		} else if (this.props.open && !nextProps.open) {
			this.closeFloatingLayer();
		}
	}

	componentWillUnmount () {
		this.closeFloatingLayer();
	}

	handleClick = () => {
		if (!this.props.noAutoDismiss && this.props.open && this.props.onDismiss) {
			this.props.onDismiss();
		}
	}

	stopPropagation = (ev) => {
		ev.nativeEvent.stopImmediatePropagation();

		if (this.props.children.props.onClick) {
			this.props.children.props.onClick();
		}
	}

	closeFloatingLayer () {
		if (this.context.unmountFromFloatingLayer) {
			this.context.unmountFromFloatingLayer(this);

			if (this.props.onClose) {
				this.props.onClose();
			}
		}

		this.attachClickHandlerJob.stop();
		off('click', this.handleClick);
	}

	renderFloatingLayer (props, isOpened = false) {
		if (!this.context.renderIntoFloatingLayer) {
			return;
		}

		const {children, onOpen, scrimType, ...rest} = props;

		delete rest.noAutoDismiss;
		delete rest.onClose;
		delete rest.onDismiss;
		delete rest.open;

		this.context.renderIntoFloatingLayer(
			this,
			<div {...rest}>
				{scrimType !== 'none' ? <Scrim type={scrimType} onClick={this.handleClick} /> : null}
				{React.cloneElement(children, {onClick: this.stopPropagation})}
			</div>
		);

		if (!isOpened) {
			if (onOpen) {
				onOpen();
			}

			if (scrimType === 'none') {
				// Attach click event handler asynchronously to make sure the event responsible for opening
				// won't be closed by other click event listeners attached to the dispatcher.
				this.attachClickHandlerJob.start();
			}
		}
	}

	attachClickHandlerJob = new Job(() => on('click', this.handleClick))

	render () {
		return null;
	}
}

const handleCancel = (props) => {
	if (props.open && !props.noAutoDismiss && props.onDismiss) {
		props.onDismiss();
		return true;
	}
};

/**
 * {@link ui/FloatingLayer.FloatingLayer} is a component that creates an entry point to the new
 * render tree. This is used for modal components such as popups.
 *
 * @class FloatingLayer
 * @memberof ui/FloatingLayer
 * @ui
 * @mixes ui/Cancelable.Cancelable
 * @public
 */
const FloatingLayer = Cancelable({modal: true, onCancel: handleCancel}, FloatingLayerBase);

export default FloatingLayer;
export {FloatingLayer, FloatingLayerBase};
