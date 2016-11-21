/**
 * Exports the {@link ui/FloatLayer.FloatLayer} and  {@link ui/FloatLayer.FloatLayerBase}
 * components. The default export is {@link ui/FloatLayer.FloatLayer}.
 *
 * @module ui/FloatLayer
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Cancelable from '../Cancelable';

import {ScrimLayer} from './Scrim';

// the current most highest z-index value for FloatLayers
let scrimZIndex = 120;

// array of z-indexes for visible layers
const viewingLayers = [];

/**
 * {@link ui/FloatLayer.FloatLayerBase} is a component that creates an entry point to the new
 * render tree. This is used for modal components such as popups.
 *
 * @class FloatLayer
 * @memberOf ui/FloatLayer
 * @ui
 * @public
 */
class FloatLayerBase extends React.Component {
	static displayName = 'FloatLayer'

	constructor (props) {
		super(props);
		this.node = null;
		this.FloatLayer = null;
	}

	static propTypes = /** @lends ui/FloatLayer.FloatLayerBase.prototype */ {
		/**
		 * CSS classes for FloatLayer.
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
		 * When `true`, FloatLayer will not hide when the user presses `ESC` key.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: React.PropTypes.bool,

		/**
		 * A function to run when floating layer is closed.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: React.PropTypes.func,

		/**
		 * A function to run when `ESC` key is pressed. The function will only invoke if
		 * `noAutoDismiss` is set to `false`.
		 *
		 * @type {Function}
		 * @public
		 */
		onDismiss: React.PropTypes.func,

		/**
		 * A function to run when floating layer is opened. It will only be invoked for the first render.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: React.PropTypes.func,

		/**
		 * When `true`, it renders components into floating layer.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: React.PropTypes.bool,

		/**
		 * Types of scrim. It can be either `transparent` or `translucent`.
		 *
		 * @type {String}
		 * @default `translucent`
		 * @public
		 */
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent'])
	}

	static defaultProps = {
		noAutoDismiss: false,
		open: false,
		floatLayerClassName: 'enact-fit enact-clip enact-untouchable',
		floatLayerId: 'floatLayer',
		scrimType: 'translucent'
	}

	componentDidMount () {
		if (this.props.open) {
			viewingLayers.push(scrimZIndex);
			this.prevZIndex = scrimZIndex;
			this.renderFloatLayer(this.props);
		}
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.open) {
			let isOpened = false;
			if (nextProps.open === this.props.open) {
				// will not increase zIndex for already opened layer
				isOpened = true;
			} else {
				// increase scrimZIndex by 2 for the new layer
				scrimZIndex = scrimZIndex + 2;
				this.prevZIndex = scrimZIndex;
				viewingLayers.push(scrimZIndex);
			}
			this.renderFloatLayer(nextProps, isOpened);
		} else {
			this.closeFloatLayer();
		}
	}

	componentWillUnmount () {
		this.closeFloatLayer();
	}

	closeFloatLayer () {
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

	renderFloatLayer ({floatLayerClassName, floatLayerId, scrimType, ...rest}, isOpened = false) {
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
			<ScrimLayer
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

const handleCancel = function (props) {
	if (props.open && !props.noAutoDismiss && props.onDismiss) {
		props.onDismiss();
	} else {
		// Return `true` to allow event to propagate to containers for unhandled cancel
		return true;
	}
};

/**
 * {@link ui/FloatLayer.FloatLayer} is a component that creates an entry point to the new
 * render tree. This is used for modal components such as popups.
 *
 * @class FloatLayer
 * @memberof ui/FloatLayer
 * @ui
 * @mixes ui/Cancelable.Cancelable
 * @public
 */
const FloatLayer = Cancelable({modal: true, onCancel: handleCancel}, FloatLayerBase);

export default FloatLayer;
export {FloatLayer, FloatLayerBase};
