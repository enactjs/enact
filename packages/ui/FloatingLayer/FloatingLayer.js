import {on, off} from '@enact/core/dispatcher';
import {forwardCustom, forProp, handle, oneOf, stop, forEventProp, call} from '@enact/core/handle';
import classNames from 'classnames';
import invariant from 'invariant';
import PropTypes from 'prop-types';
import {cloneElement, Component} from 'react';
import ReactDOM from 'react-dom';

import Cancelable from '../Cancelable';

import {FloatingLayerContext} from './FloatingLayerDecorator';
import Scrim from './Scrim';

import css from './FloatingLayer.module.less';

/**
 * A component that creates an entry point to the new render tree.
 *
 * This is used for modal components such as popups.
 *
 * @class FloatingLayerBase
 * @memberof ui/FloatingLayer
 * @ui
 * @public
 */
class FloatingLayerBase extends Component {
	static displayName = 'FloatingLayer';

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
		 * Prevents FloatingLayer from hiding when the user presses cancel/back (e.g. `ESC`) key or
		 * clicks outside the floating layer.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		noAutoDismiss: PropTypes.bool,

		/**
		 * Called when floating layer is closed.
		 *
		 * @type {Function}
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when a closing action is invoked.
		 *
		 * These actions may include pressing cancel/back (e.g. `ESC`) key or programmatically closing
		 * by `FloatingLayerDecorator`. When cancel key is pressed, the function will only invoke if
		 * `noAutoDismiss` is set to `false`.
		 *
		 * When pressing `ESC` key, event payload carries `detail` property containing `inputType`
		 * value of `'key'`.
		 * When clicking outside the boundary of the popup, event payload carries `detail` property
		 * containing `inputType` value of `'click'`.
		 *
		 * @type {Function}
		 * @public
		 */
		onDismiss: PropTypes.func,

		/**
		 * Called when floating layer is opened. It will only be invoked for the first render.
		 *
		 * @type {Function}
		 * @public
		 */
		onOpen: PropTypes.func,

		/**
		 * Renders the floating layer and its components.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * The scrim type that overlays FloatingLayer.
		 *
		 * It can be either `'transparent'`, `'translucent'`, or `'none'`.
		 *
		 * @type {String}
		 * @default 'translucent'
		 * @public
		 */
		scrimType: PropTypes.oneOf(['transparent', 'translucent', 'none'])
	};

	static contextType = FloatingLayerContext;

	static defaultProps = {
		floatLayerClassName: 'enact-fit enact-clip enact-untouchable',
		floatLayerId: 'floatLayer',
		noAutoDismiss: false,
		open: false,
		scrimType: 'translucent'
	};

	constructor (props) {
		super(props);
		this.node = null;
		this.state = {
			readyToRender: false
		};
	}

	componentDidMount () {
		// Must register first in order to obtain the floating layer node reference before trying
		// to render into it
		if (this.context && typeof this.context === 'function') {
			this.controller = this.context(this.handleNotify.bind(this));
		}

		if (this.props.scrimType === 'none' && this.props.open) {
			on('click', this.handleClick);
		}
	}

	componentDidUpdate (prevProps, prevState) {
		const {open, scrimType} = this.props;

		if (prevProps.open && !open) {
			// when open changes to false, forward close
			forwardCustom('onClose')(null, this.props);
		} else if (!prevProps.open && open && !this.state.readyToRender) {
			// when open changes to true and node hasn't rendered, render it
			this.readyToRender();
		} else if (this.state.readyToRender &&
			(!prevState.readyToRender || (prevState.readyToRender && open && !prevProps.open))
		) {
			// when node has been rendered and either it was just rendered in this update cycle or
			// the open prop changed in this cycle, forward open
			forwardCustom('onOpen')(null, this.props);
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
		if (this.floatingLayer) {
			off('scroll', this.handleScroll, this.floatingLayer);
			this.floatingLayer = null;
		}

		off('click', this.handleClick);

		if (this.controller) {
			this.controller.unregister();
		}
	}

	handleNotify = oneOf(
		[forEventProp('action', 'close'), call('handleClose')],
		[forEventProp('action', 'mount'), call('setFloatingLayer')]
	).bind(this);

	setFloatingLayer ({floatingLayer}) {
		const isNewLayer = !this.floatingLayer && floatingLayer;
		this.floatingLayer = floatingLayer;

		// the first time we have a valid floating layer container and this instance is set to open,
		// we need to render the layer.
		if (isNewLayer && this.props.open && !this.state.readyToRender) {
			this.readyToRender();
		}
	}

	handleClose = handle(
		forProp('open', true),
		forwardCustom('onDismiss')
	).bind(this);

	handleClick = handle(
		forProp('noAutoDismiss', false),
		forProp('open', true),
		forwardCustom('onDismiss', () => ({detail: {inputType: 'click'}}))
	).bind(this);

	handleScroll = (ev) => {
		const {currentTarget} = ev;
		currentTarget.scrollTop = 0;
		currentTarget.scrollLeft = 0;
	};

	stopPropagation = (ev) => {
		ev.nativeEvent.stopImmediatePropagation();

		if (this.props.children.props.onClick) {
			this.props.children.props.onClick();
		}
	};

	readyToRender () {
		if (this.state.readyToRender) return;

		invariant(
			this.floatingLayer,
			'FloatingLayer cannot be used outside the subtree of a FloatingLayerDecorator'
		);

		on('scroll', this.handleScroll, this.floatingLayer);

		this.setState({readyToRender: true});
	}

	render () {
		const {children, className, floatLayerClassName, open, scrimType, ...rest} = this.props;
		const mergedClassName = classNames(floatLayerClassName, css.floatingLayer, className);

		delete rest.floatLayerId;
		delete rest.noAutoDismiss;
		delete rest.onClose;
		delete rest.onDismiss;
		delete rest.onOpen;

		if (open && this.state.readyToRender) {
			return ReactDOM.createPortal(
				<div className={mergedClassName} {...rest}>
					{scrimType !== 'none' ? <Scrim type={scrimType} onClick={this.handleClick} /> : null}
					{cloneElement(children, {onClick: this.stopPropagation})}
				</div>,
				this.floatingLayer
			);
		}

		return null;
	}
}

const handleCancel = handle(
	// can't use forProp safely since either could be undefined ~= false
	(ev, {open, noAutoDismiss, onDismiss}) => open && !noAutoDismiss && onDismiss,
	forwardCustom('onDismiss', () => ({detail: {inputType: 'key'}})),
	stop
);

/**
 * FloatingLayer that mixes {@link ui/Cancelable.Cancelable} to handle FloatingLayer dismissal.
 *
 * This is used for modal components such as popups.
 *
 * @class FloatingLayer
 * @memberof ui/FloatingLayer
 * @ui
 * @extends ui/FloatingLayer.FloatingLayerBase
 * @mixes ui/Cancelable.Cancelable
 * @public
 */
const FloatingLayer = Cancelable({modal: true, onCancel: handleCancel}, FloatingLayerBase);

export default FloatingLayer;
export {FloatingLayer, FloatingLayerBase};
