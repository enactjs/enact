/**
 * Exports the {@link module:@enact/ui/Portal.Portal} and  {@link module:@enact/ui/Portal.PortalBase}
 * component. The default export is {@link module:@enact/ui/Portal.Portal}.
 *
 * @module @enact/ui/Portal
 */

import React from 'react';
import ReactDOM from 'react-dom';
import Cancelable from '../Cancelable';

import {ScrimLayer} from './Scrim';

// the current most highest z-index value for portals
let scrimZIndex = 120;

// array of z-indexes for visible layers
const viewingLayers = [];

/**
 * {@link module:@enact/ui/Portal.PortalBase} is a component that creates an entry point to the new
 * render tree. This is used for modal components such as popups.
 *
 * @class Portal
 * @ui
 * @public
 */
class PortalBase extends React.Component {
	static displayName = 'Portal'

	constructor (props) {
		super(props);
		this.node = null;
		this.portal = null;
	}

	static propTypes = {
		/**
		 * When `true`, Portal will not hide when the user presses `ESC` key.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: React.PropTypes.bool,

		/**
		 * A function to run when portal is closed.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: React.PropTypes.func,

		/**
		 * A function to run when `ESC` key is pressed. The function will only invoke if
		 * `noAutoDismiss` is set to false.
		 * @type {Function}
		 * @public
		 */
		onDismiss: React.PropTypes.func,

		/**
		 * A function to run when portal is opened. It will only be invoked for the first render.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: React.PropTypes.func,

		/**
		 * When `true`, it renders components into portal.
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: React.PropTypes.bool,

		/**
		 * CSS classes for Portal.
		 *
		 * @type {String}
		 * @default `enact-fit enact-untouchable`
		 * @public
		 */
		portalClassName: React.PropTypes.string,

		/**
		 * Element id for portal.
		 *
		 * @type {String}
		 * @default `portal`
		 * @public
		 */
		portalId: React.PropTypes.string,

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
		portalClassName: 'enact-fit enact-clip enact-untouchable',
		portalId: 'portal',
		scrimType: 'translucent'
	}

	componentDidMount () {
		if (this.props.open) {
			viewingLayers.push(scrimZIndex);
			this.prevZIndex = scrimZIndex;
			this.renderPortal(this.props);
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
			this.renderPortal(nextProps, isOpened);
		} else {
			this.closePortal();
		}
	}

	componentWillUnmount () {
		this.closePortal();
	}

	closePortal () {
		if (this.node) {
			ReactDOM.unmountComponentAtNode(this.node);
			document.getElementById(this.props.portalId).removeChild(this.node);

			const v = viewingLayers.indexOf(scrimZIndex);
			viewingLayers.splice(v, 1);

			if (this.props.onClose) {
				this.props.onClose();
			}
		}
		this.portal = null;
		this.node = null;
	}

	renderPortal ({portalClassName, portalId, scrimType, ...rest}, isOpened = false) {
		delete rest.noAutoDismiss;
		delete rest.onClose;
		delete rest.onDismiss;
		delete rest.onOpen;
		delete rest.open;

		if (!this.node) {
			this.node = document.createElement('div');
			this.node.className = portalClassName;
			document.getElementById(portalId).appendChild(this.node);
		} else {
			this.node.className = portalClassName;
		}

		const scrimProps = {
			type: scrimType,
			visible: this.prevZIndex === viewingLayers[viewingLayers.length - 1],
			zIndex: isOpened ? this.prevZIndex : scrimZIndex
		};
		this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
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
 * {@link module:@enact/ui/Portal.Portal} is a component that creates an entry point to the new
 * render tree. This is used for modal components such as popups.
 *
 * @class Portal
 * @memberof ui/Portal
 * @ui
 * @mixes ui/Cancelable.Cancelable
 * @public
 */
const Portal = Cancelable({modal: true, onCancel: handleCancel}, PortalBase);

export default Portal;
export {Portal, PortalBase};
