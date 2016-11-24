import {forward} from '@enact/core/handle';
import hoc from '@enact/core/hoc';
import R from 'ramda';
import React, {PropTypes} from 'react';

import Spotlight from './spotlight';

const defaultConfig = {
	/**
	 * Configures the prop name to pass the callback to request a focus change
	 *
	 * @type {String}
	 * @default 'onKeyDown'
	 */
	keyDown: 'onKeyDown',

	/**
	 * Configures the pointer prop name to pass the callback to request a focus change
	 *
	 * @type {String}
	 * @default 'onMouseDown'
	 */
	mouseDown: 'onMouseDown',

	/**
	 * Configures the prop name to pass the callback due to gaining focus
	 *
	 * @type {String}
	 * @default 'onFocus'
	 */
	focus: 'onFocus',

	/**
	 * Configures the prop name to pass the callback due to losing focus
	 *
	 * @type {String}
	 * @default 'onBlur'
	 */
	blur: 'onBlur',

	/**
	 * Whether or not the component should respond to "enter" keypresses and update the
	 * focus state accordingly.
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	useEnterKey: false,

	/**
	 * Whether or not the component should pause Spotlight due to a focus change
	 *
	 * @type {Boolean}
	 * @default false
	 * @public
	 */
	pauseSpotlightOnFocus: false
};

const focusableClass = 'focused';

/**
 * Constructs a Higher-order Component that allows Spotlight to to change the style
 * of an outer-control based on the focus state of a spottable inner-control.
 *
 * @example
 *	const DefaultFocusComponent = SpotlightFocusableDecorator(Component);
 *	const PausableFocusComponent = SpotlightFocusableDecorator(
 *		{pauseSpotlightOnFocus: true},
 *		Component
 *	);
 *
 * @param  {Object} defaultConfig Set of default configuration parameters
 * @param  {Function} Higher-order component
 *
 * @returns {Function} SpotlightFocusableDecoratorHoC
 */
const SpotlightFocusableDecoratorHoC = hoc(defaultConfig, (config, Wrapped) => {
	const {blur, focus, keyDown, mouseDown, pauseSpotlightOnFocus, useEnterKey} = config;
	const forwardBlur = forward('onBlur');
	const forwardFocus = forward('onFocus');
	const forwardKeyDown = forward('onKeyDown');
	const forwardMouseDown = forward(mouseDown);

	return class SpotlightFocusableDecorator extends React.Component {
		static propTypes = {
			disabled: PropTypes.bool,
			keyCodes: PropTypes.array
		}

		static defaultProps = {
			keyCodes: [13, 16777221]
		}

		constructor (props) {
			super(props);
			this.state = {
				innerElementFocused: false,
				forceFocusChange: false
			};
		}

		componentDidUpdate () {
			if (this.state.forceFocusChange) {
				Spotlight.focus(this.state.innerElementFocused ? this.wrappedInstance.decoratedNode : this.wrappedInstance.decoratorNode);
				this.setState({forceFocusChange: false}); // eslint-disable-line react/no-did-update-set-state
			}
		}

		shouldComponentUpdate (nextProps, nextState) {
			return !(this.state.forceFocusChange && !nextState.forceFocusChange);
		}

		onKeyDown = (e) => {
			const keyCode = e.nativeEvent.keyCode;
			if (!this.props.disabled && R.contains(keyCode, this.props.keyCodes) && e.target === this.wrappedInstance.decoratorNode) {
				this.setState({innerElementFocused: true, forceFocusChange: true});
			}
			forwardKeyDown(e, this.props);
		}

		onMouseDown = (e) => {
			if (!this.props.disabled) {
				if (e.target !== this.wrappedInstance.decoratedNode) {
					e.preventDefault(); // Prevent an immediate blur event that we can't manage explicitly
				}
				if (!this.state.innerElementFocused) {
					this.setState({innerElementFocused: true});
				}
			}
			forwardMouseDown(e, this.props);
		}

		onFocus = (e) => {
			if (e.target === this.wrappedInstance.decoratorNode) {
				if (this.state.forceFocusChange) {
					return;
				}
				if (!useEnterKey) {
					this.setState({innerElementFocused: true, forceFocusChange: true});
				}
			} else if (e.target === this.wrappedInstance.decoratedNode) {
				this.setState({innerElementFocused: true});

				if (pauseSpotlightOnFocus) {
					Spotlight.pause();
				}
			}
			forwardFocus(e, this.props);
		}

		onBlur = (e) => {
			if (e.target === this.wrappedInstance.decoratorNode && this.state.innerElementFocused) {
				return;
			}
			if (e.target === this.wrappedInstance.decoratedNode) {
				const activeElement = document.activeElement;
				this.setState({innerElementFocused: false, forceFocusChange: activeElement && activeElement === document.body});

				if (pauseSpotlightOnFocus) {
					Spotlight.resume();
				}
			}
			forwardBlur(e, this.props);
		}

		getWrappedInstance = (instance) => {
			this.wrappedInstance = instance;
		}

		render () {
			const props = Object.assign({}, this.props, {
				spotlightDisabled: this.state.innerElementFocused
			});
			delete props.keyCodes;
			props[focus] = this.onFocus;
			props[blur] = this.onBlur;
			props[mouseDown] = this.onMouseDown;

			if (useEnterKey) {
				props[keyDown] = this.onKeyDown;
			}

			if (this.state.innerElementFocused) {
				if (props.className) {
					props.className += ' ' + focusableClass;
				} else {
					props.className = focusableClass;
				}
			}

			return <Wrapped {...props} ref={this.getWrappedInstance} />;
		}
	};
});

export default SpotlightFocusableDecoratorHoC;
export {SpotlightFocusableDecoratorHoC as SpotlightFocusableDecorator};
