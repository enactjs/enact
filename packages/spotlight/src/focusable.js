import hoc from '@enact/core/hoc';
import R from 'ramda';
import React, {PropTypes} from 'react';

import Spotlight from './spotlight';
import {decoratedProp} from './spottable';

const defaultConfig = {
	/**
	 * Configures the prop name to pass the callback to request a focus change
	 *
	 * @type {String}
	 * @default 'onKeyDown'
	 */
	keyDown: 'onKeyDown',

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
				Spotlight.focus(this.state.innerElementFocused ? this.props['data-container-id'] : void 0);
				this.setState({forceFocusChange: false}); // eslint-disable-line react/no-did-update-set-state
			}
		}

		shouldComponentUpdate (nextProps, nextState) {
			if (this.state.forceFocusChange && !nextState.forceFocusChange) {
				return false;
			}
			return true;
		}

		onKeyDown = (e) => {
			const keyCode = e.nativeEvent.keyCode;
			if (!this.props.disabled && !this.state.keyCode && R.contains(keyCode, this.props.keyCodes)) {
				this.setState({innerElementFocused: true, forceFocusChange: true});
			}
		}

		onFocus = (e) => {
			if (e.target.getAttribute(decoratedProp)) {
				this.setState({innerElementFocused: true});

				if (config.pauseSpotlightOnFocus) {
					Spotlight.pause();
				}
			} else if (!config.useEnterKey) {
				this.setState({innerElementFocused: true, forceFocusChange: true});
			}
		}

		onBlur = (e) => {
			if (e.target.getAttribute(decoratedProp)) {
				const activeElement = document.activeElement;
				this.setState({innerElementFocused: false, forceFocusChange: activeElement && activeElement === document.body});

				if (config.pauseSpotlightOnFocus) {
					Spotlight.resume();
				}
			}
		}

		render () {
			const props = Object.assign({}, this.props, {
				spotlightDisabled: this.state.innerElementFocused
			});
			delete props.keyCodes;
			props[config.focus] = this.onFocus;
			props[config.blur] = this.onBlur;

			if (config.useEnterKey) {
				props[config.keyDown] = this.onKeyDown;
			}

			if (this.state.innerElementFocused) {
				if (props.className) {
					props.className += ' ' + focusableClass;
				} else {
					props.className = focusableClass;
				}
			}

			return <Wrapped {...props} />;
		}
	};
});

export default SpotlightFocusableDecoratorHoC;
export {SpotlightFocusableDecoratorHoC as SpotlightFocusableDecorator};
