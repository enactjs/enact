import {on, off} from '@enact/core/dispatcher';
import React from 'react';
import ReactDOM from 'react-dom';
import Cancelable from '../Cancelable';

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

	static propTypes = /** @lends ui/FloatingLayer.FloatingLayerBase.prototype */ {
		/**
		 * CSS classes for FloatingLayer.
		 *
		 * @type {String}
		 * @default 'enact-fit enact-clip enact-untouchable'
		 * @public
		 */
		floatLayerClassName: React.PropTypes.string,

		/**
		 * Element id for floating layer.
		 *
		 * @type {String}
		 * @default 'floatLayer'
		 * @public
		 */
		floatLayerId: React.PropTypes.string,

		/**
		 * When `true`, FloatingLayer will not hide when the user presses `ESC` key.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: React.PropTypes.bool,

		/**
		 * A function to be run when floating layer is closed.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: React.PropTypes.func,

		/**
		 * A function to be run when `ESC` key is pressed. The function will only invoke if
		 * `noAutoDismiss` is set to `false`.
		 *
		 * @type {Function}
		 * @public
		 */
		onDismiss: React.PropTypes.func,

		/**
		 * A function to be run when floating layer is opened. It will only be invoked for the first render.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: React.PropTypes.func,

		/**
		 * When `true`, the floating layer and its components will be rendered.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: React.PropTypes.bool,

		/**
		 * The scrim type. It can be either `'transparent'`, `'translucent'`, or `'none'`.
		 *
		 * @type {String}
		 * @default 'translucent'
		 * @public
		 */
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent', 'none'])
	}

	static defaultProps = {
		floatLayerClassName: 'enact-fit enact-clip enact-untouchable',
		floatLayerId: 'floatLayer',
		noAutoDismiss: false,
		open: false,
		scrimType: 'translucent'
	}

	constructor (props) {
		super(props);
		this.node = null;
		this.floatLayer = null;
	}

	componentDidMount () {
		if (this.props.open) {
			this.renderFloatingLayer(this.props);
		}
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.open) {
			this.renderFloatingLayer(nextProps, this.props.open);
		} else {
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
		if (this.node) {
			ReactDOM.unmountComponentAtNode(this.node);
			document.getElementById(this.props.floatLayerId).removeChild(this.node);

			if (this.props.onClose) {
				this.props.onClose();
			}
		}
		this.floatLayer = null;
		this.node = null;

		off('click', this.handleClick);
	}

	renderNode () {
		const {floatLayerClassName, floatLayerId} = this.props;

		if (!this.node) {
			this.node = document.createElement('div');
			document.getElementById(floatLayerId).appendChild(this.node);
		}

		this.node.className = floatLayerClassName;
		this.node.style.zIndex = 100;

		return this.node;
	}

	renderFloatingLayer ({children, onOpen, scrimType, ...rest}, isOpened = false) {
		delete rest.floatLayerClassName;
		delete rest.floatLayerId;
		delete rest.noAutoDismiss;
		delete rest.onClose;
		delete rest.onDismiss;
		delete rest.open;

		const node = this.renderNode();
		this.floatLayer = ReactDOM.unstable_renderSubtreeIntoContainer(
			this,
			<div {...rest}>
				{scrimType !== 'none' ? <Scrim type={scrimType} onClick={this.handleClick} /> : null}
				{React.cloneElement(children, {onClick: this.stopPropagation})}
			</div>,
			node
		);

		if (!isOpened) {
			if (onOpen) {
				onOpen();
			}

			if (scrimType === 'none') {
				// Attach click event handler asynchronously to make sure the event responsible for opening
				// won't be closed by other click event listeners attached to the dispatcher.
				setTimeout(() => on('click', this.handleClick));
			}
		}
	}

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
