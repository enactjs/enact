/**
 * Exports the {@link module:@enact/ui/Portal~Portal} component.
 *
 * @module @enact/ui/Portal
 */

import React from 'react';
import ReactDOM from 'react-dom';

import {ScrimLayer} from './Scrim';

// the current most highest z-index value for portals
let scrimZIndex = 120;

// array of z-indexes for visible layers
const viewingLayers = [];

/**
 * {@link module:@enact/ui/Portal~Portal} is a component that creates an entry point to the new
 * render tree. This is used for modal components such as popups.
 *
 * @class Portal
 * @ui
 * @public
 */
class Portal extends React.Component {
	static displayName = 'Portal'

	constructor (props) {
		super(props);
		this.node = null;
		this.portal = null;
	}

	static propTypes = {
		/**
		 * When `true`, Portal will hide when the user presses `ESC` key.
		 * @type {Boolean}
		 * @default false
		 */
		noAutoDismiss: React.PropTypes.bool,

		/**
		 * A function to run when `ESC` key is pressed. The function will only invoke if
		 * `noAutoDismiss` is set to false.
		 * @type {Function}
		 */
		onClose: React.PropTypes.func,

		/**
		 * When `true`, it renders components into portal.
		 * @type {Boolean}
		 * @default false
		 */
		open: React.PropTypes.bool,

		/**
		 * CSS classes for Portal.
		 * @type {String}
		 * @default `enact-fit enact-untouchable`
		 */
		portalClassName: React.PropTypes.string,

		/**
		 * Element id for portal.
		 * @type {String}
		 * @default `portal`
		 */
		portalId: React.PropTypes.string,

		/**
		 * Types of scrim. It can be either `transparent` or `translucent`.
		 * @type {String}
		 * @default `translucent`
		 */
		scrimType: React.PropTypes.oneOf(['transparent', 'translucent'])
	}

	static defaultProps = {
		noAutoDismiss: false,
		open: false,
		portalClassName: 'enact-fit enact-untouchable',
		portalId: 'portal',
		scrimType: 'translucent'
	}

	componentDidMount () {
		if (!this.props.noAutoDismiss) {
			document.addEventListener('keydown', this.handleKeydown);
		}

		if (this.props.open) {
			viewingLayers.push(scrimZIndex);
			this.renderPortal(this.props);
		}
	}

	componentWillReceiveProps (nextProps) {
		if (nextProps.open) {
			let preserveZIndex = false;
			if (nextProps.open === this.props.open) {
				// will not increase zIndex for already opened layer
				preserveZIndex = true;
			} else {
				// increase scrimZIndex by 2 for the new layer
				scrimZIndex = scrimZIndex + 2;
				this.prevZIndex = scrimZIndex;
				viewingLayers.push(scrimZIndex);
			}
			this.renderPortal(nextProps, preserveZIndex);
		} else {
			this.closePortal();
		}
	}

	componentWillUnmount () {
		if (!this.props.noAutoDismiss) {
			document.removeEventListener('keydown', this.handleKeydown);
		}
		this.closePortal();
	}

	handleKeydown = (ev) => {
		// handle `ESC` key
		if (ev.keyCode === 27) {
			ev.preventDefault();
			if (this.props.onClose) {
				this.props.onClose();
			}
		}
	}

	closePortal () {
		if (this.node) {
			ReactDOM.unmountComponentAtNode(this.node);
			document.getElementById(this.props.portalId).removeChild(this.node);

			const v = viewingLayers.indexOf(scrimZIndex);
			viewingLayers.splice(v, 1);
		}
		this.portal = null;
		this.node = null;
	}

	renderPortal ({portalClassName, portalId, scrimType, ...rest}, preserveZIndex = false) {
		delete rest.noAutoDismiss;
		delete rest.onClose;
		// don't delete `rest.open`

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
			zIndex: preserveZIndex ? this.prevZIndex : scrimZIndex
		};

		this.portal = ReactDOM.unstable_renderSubtreeIntoContainer(
			this,
			<ScrimLayer
				{...scrimProps}
				{...rest}
			/>,
			this.node
		);
	}

	render () {
		return null;
	}
}

export default Portal;
