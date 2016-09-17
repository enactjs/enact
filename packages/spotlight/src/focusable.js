import hoc from 'enact-core/hoc';
import R from 'ramda';
import React, {PropTypes} from 'react';

import Spotlight from './spotlight';
import {decoratedProp} from './spottable';

const defaultConfig = {
	keyDown: 'onKeyDown',
	focus: 'onFocus',
	blur: 'onBlur',
	useEnterKey: false,
	pauseSpotlightOnFocus: false
};

const focusableClass = 'focused';

const SpotlightFocusableDecoratorHoC = hoc(defaultConfig, (config, Wrapped) => {
	return class SpotlightFocusableDecorator extends React.Component {
		static propTypes = {
			containerId: PropTypes.string,
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
				Spotlight.focus(this.state.innerElementFocused ? this.props.containerId : void 0);
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
