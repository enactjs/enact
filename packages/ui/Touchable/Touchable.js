import {forward, forwardWithPrevent, forProp, handle} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import {on, off} from '@enact/core/dispatcher';
import platform from '@enact/core/platform';
import PropTypes from 'prop-types';
import React from 'react';
import ReactDOM from 'react-dom';

const makeEvent = (type, fn) => (ev, ...args) => {
	const {target, currentTarget} = ev;
	const payload = {type, target, currentTarget};

	return fn(payload, ...args);
};
const forwardDown = makeEvent('down', forwardWithPrevent('onDown'));
const forwardUp = makeEvent('up', forwardWithPrevent('onUp'));
const forwardTap = makeEvent('tap', forward('onTap'));

const activate = ({active}) => active ? null : {active: true};
const deactivate = ({active}) => active ? {active: false} : null;

const defaultConfig = {
	activeProp: null
};

const Touchable = hoc(defaultConfig, (config, Wrapped) => {
	const {activeProp} = config;

	return class extends React.Component {
		static displayName = 'Touchable'

		static propTypes = {
			cancelOnLeave: PropTypes.bool,
			disabled: PropTypes.bool,
			onDown: PropTypes.func,
			onTap: PropTypes.func,
			onUp: PropTypes.func
		}

		static defaultProps = {
			cancelOnLeave: false,
			disabled: false
		}

		target = null
		node = null
		handle = handle.bind(this);

		constructor () {
			super();

			this.state = {
				active: false
			};
		}

		componentDidMount () {
			// eslint-disable-next-line react/no-find-dom-node
			this.node = ReactDOM.findDOMNode(this);

			if (platform.touch) {
				on('touchend', this.handleGlobalUp, document);
			}
			on('mouseup', this.handleGlobalUp, document);
		}

		componentWillUnmount () {
			this.clearTarget();
			this.node = null;

			if (platform.touch) {
				off('touchend', this.handleGlobalUp, document);
			}
			off('mouseup', this.handleGlobalUp, document);
		}

		setTarget = (target) => {
			this.target = target;

			if (platform.touch && this.props.cancelOnLeave) {
				this.targetBounds = this.target.getBoundingClientRect();
			}
		}

		clearTarget = () => {
			this.target = null;
			this.targetBounds = null;
		}

		activate = (ev) => {
			this.setTarget(ev.target);
			if (activeProp) {
				this.setState(activate);
			}

			return true;
		}

		deactivate = () => {
			this.clearTarget();
			if (activeProp) {
				this.setState(deactivate);
			}

			return true;
		}

		shouldHandleUp = (ev) => {
			// verify we had a target and the up target is still within the current node
			return this.target && this.node.contains(ev.target);
		}

		touchLeftTarget = (ev) => Array.from(ev.targetTouches).reduce((hasLeft, {pageX, pageY}) => {
			const {left, right, top, bottom} = this.targetBounds;
			return hasLeft && left > pageX || right < pageX || top > pageY || bottom < pageY;
		}, true);

		handleDown = this.handle(
			forProp('disabled', false),
			forwardDown,
			this.activate
			// hold support
			// drag support
		)

		handleUp = this.handle(
			forProp('disabled', false),
			this.shouldHandleUp,
			forwardUp,
			forwardTap
		).finally(this.deactivate)

		handleMouseDown = this.handle(
			forward('onMouseDown'),
			this.handleDown
		)

		handleMouseLeave = this.handle(
			forward('onMouseLeave'),
			forProp('disabled', false),
			forProp('cancelOnLeave', true),
			this.deactivate
		)

		handleMouseUp = this.handle(
			forward('onMouseUp'),
			this.handleUp
		)

		handleTouchStart = this.handle(
			forward('onTouchStart'),
			this.handleDown
		)

		handleTouchMove = this.handle(
			forward('onTouchMove'),
			forProp('disabled', false),
			forProp('cancelOnLeave', true),
			this.touchLeftTarget,
			this.deactivate
		)

		handleTouchEnd = this.handle(
			forward('onTouchEnd'),
			this.handleUp
		)

		handleGlobalUp = this.deactivate

		addDownHandlers (props) {
			if (this.props.onDown) {
				props.onMouseDown = this.handleMouseDown;
				if (platform.touch) {
					props.onTouchStart = this.handleTouchStart;
				}
			}
		}

		addUpHandlers (props) {
			if (this.props.onUp || this.props.onTap) {
				props.onMouseUp = this.handleMouseUp;
				props.onMouseLeave = this.handleMouseLeave;
				if (platform.touch) {
					props.onTouchMove = this.handleTouchMove;
					props.onTouchEnd = this.handleTouchEnd;
				}
			}
		}

		render () {
			const props = Object.assign({}, this.props);

			this.addDownHandlers(props);
			this.addUpHandlers(props);

			delete props.cancelOnLeave;
			delete props.onDown;
			delete props.onUp;
			delete props.onTap;

			if (activeProp) {
				props[activeProp] = this.state.active;
			}

			return (
				<Wrapped {...props} />
			);
		}
	};
});

export default Touchable;
export {
	Touchable
};
