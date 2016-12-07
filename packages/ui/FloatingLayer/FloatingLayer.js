/**
 * Exports the {@link ui/FloatingLayer.FloatingLayer} and  {@link ui/FloatingLayer.FloatingLayerBase}
 * components. The default export is {@link ui/FloatingLayer.FloatingLayer}.
 *
 * @module ui/FloatingLayer
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Cancelable from '../Cancelable';

import Scrim from './Scrim';

// the current highest z-index value for FloatingLayers
let scrimZIndex = 120;

// array of z-indexes for visible layers
const viewingLayers = [];

/**
 * {@link ui/FloatingLayer.FloatingLayerBase} is a component that creates an entry point to the new
 * render tree. This is used for modal components such as popups.
 *
 * @class FloatingLayer
 * @memberof ui/FloatingLayer
 * @ui
 * @public
 */
class FloatingLayerBase extends React.Component {
	static displayName = 'FloatingLayer'

	constructor (props) {
		super(props);
		this.node = null;
		this.floatLayer = null;
	}

	static propTypes = /** @lends ui/FloatingLayer.FloatingLayerBase.prototype */ {
		/**
		 * CSS classes for FloatingLayer.
		 *
		 * @type {String}
		 * @default `enact-fit enact-clip enact-untouchable`
		 * @public
		 */
		floatLayerClassName: React.PropTypes.string,

		/**
		 * Element id for floating layer.
		 *
		 * @type {String}
		 * @default `floatLayer`
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
		 * The scrim type. It can be either `'transparent'` or `'translucent'`.
		 *
		 * @type {String}
		 * @default `translucent`
		 * @public
		 */
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent'])
	}

	static defaultProps = {
		floatLayerClassName: 'enact-fit enact-clip enact-untouchable',
		floatLayerId: 'floatLayer',
		noAutoDismiss: false,
		open: false,
		scrimType: 'translucent'
	}

	componentDidMount () {
		if (this.props.open) {
			viewingLayers.push(scrimZIndex);
			this.prevZIndex = scrimZIndex;
			this.renderFloatingLayer(this.props);
		}
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.open) {
			if (!this.props.open) {
				// increase scrimZIndex by 2 for the new layer
				scrimZIndex = scrimZIndex + 2;
				this.prevZIndex = scrimZIndex;
				viewingLayers.push(scrimZIndex);
			}
			this.renderFloatingLayer(nextProps, this.props.open);
		} else {
			this.closeFloatingLayer();
		}
	}

	componentWillUnmount () {
		this.closeFloatingLayer();
	}

	closeFloatingLayer () {
		if (this.node) {
			ReactDOM.unmountComponentAtNode(this.node);
			document.getElementById(this.props.floatLayerId).removeChild(this.node);

			const v = viewingLayers.indexOf(scrimZIndex);
			viewingLayers.splice(v, 1);

			if (this.props.onClose) {
				this.props.onClose();
			}
		}
		this.floatLayer = null;
		this.node = null;
	}

	renderFloatingLayer ({floatLayerClassName, floatLayerId, scrimType, ...rest}, isOpened = false) {
		delete rest.noAutoDismiss;
		delete rest.onClose;
		delete rest.onDismiss;
		delete rest.onOpen;
		delete rest.open;

		if (!this.node) {
			this.node = document.createElement('div');
			this.node.className = floatLayerClassName;
			document.getElementById(floatLayerId).appendChild(this.node);
		} else {
			this.node.className = floatLayerClassName;
		}

		const scrimProps = {
			type: scrimType,
			visible: this.prevZIndex === viewingLayers[viewingLayers.length - 1],
			zIndex: isOpened ? this.prevZIndex : scrimZIndex
		};
		this.floatLayer = ReactDOM.unstable_renderSubtreeIntoContainer(
			this,
			<Scrim
				{...scrimProps}
				{...rest}
			/>,
			this.node
		);

		if (!isOpened && this.props.onOpen) {
			this.props.onOpen();
		}
	}

	render () {
		return null;
	}
}

const handleCancel = (props) => {
	if (props.open && !props.noAutoDismiss && props.onDismiss) {
		props.onDismiss();
	} else {
		// Return `true` to allow event to propagate to containers for unhandled cancel
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
