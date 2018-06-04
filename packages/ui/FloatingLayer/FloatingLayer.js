import {on, off} from '@enact/core/dispatcher';
import {adaptEvent, forward, forProp, handle, stop} from '@enact/core/handle';
import invariant from 'invariant';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

import Cancelable from '../Cancelable';

import {contextTypes} from './FloatingLayerDecorator';
import Scrim from './Scrim';

const forwardWithType = type => adaptEvent(
	() => ({type}),
	forward(type)
);

const forwardDismiss = forwardWithType('onDismiss');
const forwardClose = forwardWithType('onClose');
const forwardOpen = forwardWithType('onOpen');

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
		 * CSS classes for FloatingLayer.
		 *
		 * @type {String}
		 * @default 'enact-fit enact-clip enact-untouchable'
		 * @public
		 */
		floatLayerClassName: PropTypes.string,

		/**
		 * Element id for floating layer.
		 *
		 * @type {String}
		 * @default 'floatLayer'
		 * @public
		 */
		floatLayerId: PropTypes.string,

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
		 * A function to be run when a closing action is invoked. These actions may include pressing
		 * cancel/back (e.g. `ESC`) key or programmatically closing by `FloatingLayerDecorator`. When
		 * cancel key is pressed, the function will only invoke if `noAutoDismiss` is set to `false`.
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
		floatLayerClassName: 'enact-fit enact-clip enact-untouchable',
		floatLayerId: 'floatLayer',
		noAutoDismiss: false,
		open: false,
		scrimType: 'translucent'
	}

	constructor (props) {
		super(props);
		this.node = null;
		this.state = {
			nodeRendered: false
		};
	}

	componentDidMount () {
		if (this.props.open) {
			forwardOpen(null, this.props);
			this.renderNode();
		}

		if (this.context.registerFloatingLayer) {
			this.context.registerFloatingLayer(this, {close: this.handleClose});
		}
	}

	componentWillReceiveProps (nextProps) {
		if (!this.props.open && nextProps.open && !this.state.nodeRendered) {
			this.renderNode();
		}
	}

	componentDidUpdate (prevProps) {
		const {open, scrimType} = this.props;

		if (prevProps.open && !open) {
			forwardClose(null, this.props);
		} else if (!prevProps.open && open) {
			forwardOpen(null, this.props);
		}

		if (scrimType === 'none') {
			if (!prevProps.open && open) {
				on('click', this.handleClick);
			} else if (prevProps.open && !open) {
				off('click', this.handleClick);
			}
		}
	}

	componentWillUnmount () {
		if (this.node) {
			const floatingLayer = this.context.getFloatingLayer();
			floatingLayer.removeChild(this.node);
			this.node = null;
		}

		off('click', this.handleClick);

		if (this.context.unregisterFloatingLayer) {
			this.context.unregisterFloatingLayer(this);
		}
	}

	handleClose = handle(
		forProp('open', true),
		forwardDismiss
	).bind(this)

	handleClick = () => {
		if (!this.props.noAutoDismiss && this.props.open) {
			forwardDismiss(null, this.props);
		}
	}

	handleScroll = (ev) => {
		const {currentTarget} = ev;
		currentTarget.scrollTop = 0;
		currentTarget.scrollLeft = 0;
	}

	stopPropagation = (ev) => {
		ev.nativeEvent.stopImmediatePropagation();

		if (this.props.children.props.onClick) {
			this.props.children.props.onClick();
		}
	}

	renderNode () {
		const {floatLayerClassName} = this.props;
		const floatingLayer = this.context.getFloatingLayer();

		if (this.node || !floatingLayer) return;

		invariant(
			this.context.getFloatingLayer,
			'FloatingLayer cannot be used outside the subtree of a FloatingLayerDecorator'
		);

		this.node = document.createElement('div');
		this.node.className = floatLayerClassName;
		this.node.style.zIndex = 100;

		floatingLayer.appendChild(this.node);
		on('scroll', this.handleScroll, this.node);

		// render children when this.node is inserted in the DOM tree.
		this.setState({nodeRendered: true});
	}

	render () {
		const {children, open, scrimType, ...rest} = this.props;

		if (!open || !this.state.nodeRendered) {
			return null;
		}

		delete rest.floatLayerClassName;
		delete rest.floatLayerId;
		delete rest.noAutoDismiss;
		delete rest.onClose;
		delete rest.onDismiss;
		delete rest.onOpen;

		return ReactDOM.createPortal(
			<div {...rest}>
				{scrimType !== 'none' ? <Scrim type={scrimType} onClick={this.handleClick} /> : null}
				{React.cloneElement(children, {onClick: this.stopPropagation})}
			</div>,
			this.node
		);
	}
}

const handleCancel = handle(
	// can't use forProp safely since either could be undefined ~= false
	(ev, {open, noAutoDismiss, onDismiss}) => open && !noAutoDismiss && onDismiss,
	forwardDismiss,
	stop
);

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
