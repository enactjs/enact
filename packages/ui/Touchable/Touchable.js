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
const forwardDown = makeEvent('down', forward('onDown'));
const forwardUp = makeEvent('up', forwardWithPrevent('onUp'));
const forwardTap = makeEvent('tap', forward('onTap'));

const Touchable = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'Touchable'

		static propTypes = {
			cancelOnLeave: PropTypes.bool,
			onDown: PropTypes.func,
			onTap: PropTypes.func,
			onUp: PropTypes.func
		}

		static defaultProps: {
			cancelOnLeave: false
		}

		target = null
		node = null
		handle = handle.bind(this);

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

		setTarget = (ev) => {
			this.target = ev.target;
			this.targetBounds = this.target.getBoundingClientRect();

			return true;
		}

		clearTarget = () => {
			this.target = null;
		}

		shouldHandleUp = (ev) => {
			// verify we had a target and the up target is still within the current node
			return this.target && this.node.contains(ev.target);
		}

		touchLeftTarget = (ev) => Array.from(ev.targetTouches).reduce((left, touch) => {
			return left && (
				this.targetBounds.left > touch.pageX ||
				this.targetBounds.right < touch.pageX ||
				this.targetBounds.top > touch.pageY ||
				this.targetBounds.bottom < touch.pageY
			);
		}, true);

		handleDown = this.handle(
			this.setTarget,
			forwardDown
			// hold support
			// drag support
		)

		handleUp = this.handle(
			this.shouldHandleUp,
			forwardUp,
			forwardTap
		).finally(this.clearTarget)

		handleMouseDown = this.handle(
			forward('onMouseDown'),
			this.handleDown
		)

		handleMouseLeave = this.handle(
			forward('onMouseLeave'),
			forProp('cancelOnLeave', true),
			this.clearTarget
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
			forProp('cancelOnLeave', true),
			this.touchLeftTarget,
			this.clearTarget
		)

		handleTouchEnd = this.handle(
			forward('onTouchEnd'),
			this.handleUp
		)

		handleGlobalUp = this.clearTarget

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

			delete props.onDown;
			delete props.onUp;
			delete props.onTap;

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
