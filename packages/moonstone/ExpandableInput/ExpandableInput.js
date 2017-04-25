/**
 * Exports the {@link moonstone/ExpandableInput.ExpandableInput} and
 * {@link moonstone/ExpandableInput.ExpandableInputBase} components.
 * The default export is {@link moonstone/ExpandableInput.ExpandableInput}.
 *
 * @module moonstone/ExpandableInput
 */

import Changeable from '@enact/ui/Changeable';
import {forward} from '@enact/core/handle';
import {is} from '@enact/core/keymap';
import deprecate from '@enact/core/internal/deprecate';
import React from 'react';
import PropTypes from 'prop-types';

import {calcAriaLabel, Input} from '../Input';
import {Expandable, ExpandableItemBase} from '../ExpandableItem';

const forwardMouseDown = forward('onMouseDown');

/**
 * {@link moonstone/ExpandableInput.ExpandableInputBase} is a stateless component that
 * expands to render a {@link moonstone/Input.Input}.
 *
 * @class ExpandableInputBase
 * @memberof moonstone/ExpandableInput
 * @ui
 * @public
 */
class ExpandableInputBase extends React.Component {
	static displayName = 'ExpandableInput'

	static propTypes = /** @lends moonstone/ExpandableInput.ExpandableInputBase.prototype */ {
		/**
		 * The primary text of the item.
		 *
		 * @type {String}
		 * @required
		 * @public
		 */
		title: PropTypes.string.isRequired,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * The icon to be placed at the end of the input.
		 *
		 * @see {@link moonstone/Icon.Icon}
		 * @type {String}
		 * @public
		 */
		iconAfter: PropTypes.string,

		/**
		 * The icon to be placed at the beginning of the input.
		 *
		 * @see {@link moonstone/Icon.Icon}
		 * @type {String}
		 * @public
		 */
		iconBefore: PropTypes.string,

		/**
		 * Text to display when no `value` is set.
		 *
		 * @type {String}
		 * @public
		 */
		noneText: PropTypes.string,

		/**
		 * The handler to run when the expandable value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to close
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * This handler will be fired as `onChange`. `onInputChange` is deprecated and will be removed
		 * in a future update.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onInputChange: deprecate(PropTypes.func, {name: 'onInputChange', since: '1.0.0', message: 'Use `onChange` instead', until: '2.0.0'}),

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * When `true`, the control is rendered in the expanded state, with the contents visible
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: PropTypes.bool,

		/**
		 * The placeholder text to display.
		 *
		 * @type {String}
		 * @see moonstone/Input.Input#placeholder
		 * @public
		 */
		placeholder: PropTypes.string,

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: PropTypes.bool,

		/**
		 * The type of input. Accepted values correspond to the standard HTML5 input types.
		 *
		 * @type {String}
		 * @see moonstone/Input.Input#type
		 * @public
		 */
		type: PropTypes.string,

		/**
		 * The value of the input.
		 *
		 * @type {String|Number}
		 * @see moonstone/Input.Input#value
		 * @public
		 */
		value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
	}

	static defaultProps = {
		spotlightDisabled: false
	}

	constructor (props) {
		super();

		this.state = {
			initialValue: props.value
		};
	}

	componentWillReceiveProps (nextProps) {
		let {initialValue} = this.state;
		if (!this.props.open && nextProps.open) {
			initialValue = nextProps.value;
		} else if (this.props.open && !nextProps.open) {
			initialValue = null;
		}

		this.setState({initialValue});
	}

	calcAriaLabel () {
		const {noneText, title, type, value} = this.props;
		const returnVal = (type === 'password') ? value : (value || noneText);
		return calcAriaLabel(title, type, returnVal);
	}

	calcLabel () {
		const {noneText, type, value} = this.props;
		if (type === 'password') {
			return null;
		} else {
			return value || noneText;
		}
	}

	fireCloseEvent = () => {
		const {onClose} = this.props;

		if (onClose) {
			onClose();
		}
	}

	handleInputKeyDown = (ev) => {
		const keyCode = ev.keyCode;

		const isCancel = is('cancel', keyCode);
		const isEnter = is('enter', keyCode);
		const isUpDown = is('up', keyCode) || is('down', keyCode);

		if (isEnter) {
			// prevent Enter onKeyPress which would re-open the expandable when the label
			// receives focus
			ev.preventDefault();
		} else if (isUpDown) {
			// prevent Spotlight handling up/down since closing the expandable will spot the label
			ev.nativeEvent.stopImmediatePropagation();
		}

		if (isCancel) {
			forward('onChange', {
				value: this.state.initialValue
			}, this.props);
		} else if (isEnter || isUpDown) {
			this.fireCloseEvent();
		}
	}

	handleInputBlur = () => {
		// if `open` is `false`, the contained <input> has lost focus due to 5-way navigation
		// in `handleInputKeyDown`, where the `fireCloseEvent` method has already been called
		// verify the expandable is open before calling that method again.
		if (this.props.open) {
			this.fireCloseEvent();
		}
	}

	handleMouseDown = (ev) => {
		// if the contained <input> has focus, prevent onClicks so that clicking on the LabeledItem
		// doesn't open the expandable immediately after blurring the <input> closed it.
		if (ev.currentTarget.contains(document.activeElement)) {
			ev.preventDefault();
		}

		forwardMouseDown(ev);
	}

	handleInputMouseDown = (ev) => {
		// prevent onMouseDown events from the <input> itself from bubbling up to be prevented by
		// handleMouseDown
		ev.stopPropagation();
	}

	handleClose = () => {
		this.fireCloseEvent();
		// not forwarding event because this is being done in fireCloseEvent
	}

	handleChange = (val) => {
		const {onChange, onInputChange} = this.props;

		// handler that fires `onChange` and `onInputChange` in `Input`'s' `onChange`.
		if (onChange) {
			onChange(val);
		}

		if (onInputChange) {
			onInputChange(val);
		}
	}

	render () {
		const {disabled, iconAfter, iconBefore, onSpotlightDisappear, placeholder, spotlightDisabled, type, value, ...rest} = this.props;
		delete rest.onChange;
		delete rest.onInputChange;

		return (
			<ExpandableItemBase
				{...rest}
				aria-label={this.calcAriaLabel()}
				disabled={disabled}
				label={this.calcLabel()}
				noPointerMode
				onClose={this.handleClose}
				onMouseDown={this.handleMouseDown}
				onSpotlightDisappear={onSpotlightDisappear}
				showLabel={type === 'password' ? 'never' : 'auto'}
				spotlightDisabled={spotlightDisabled}
			>
				<Input
					disabled={disabled}
					dismissOnEnter
					iconAfter={iconAfter}
					iconBefore={iconBefore}
					noDecorator
					onBlur={this.handleInputBlur}
					onChange={this.handleChange}
					onKeyDown={this.handleInputKeyDown}
					onMouseDown={this.handleInputMouseDown}
					onSpotlightDisappear={onSpotlightDisappear}
					placeholder={placeholder}
					spotlightDisabled={spotlightDisabled}
					type={type}
					value={value}
				/>
			</ExpandableItemBase>
		);
	}
}

/**
 * {@link moonstone/ExpandableInput.ExpandableInputBase} is a stateful component that
 * expands to render a {@link moonstone/Input.Input}.
 *
 * By default, `ExpandableInput` maintains the state of its `value` property. Supply the
 * `defaultValue` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `value` at creation time and update it in response to
 * `onChange` events.
 *
 * `ExpandableInput` is an expandable component and it maintains its open/closed state by default.
 * The initial state can be supplied using `defaultOpen`. In order to directly control the
 * open/closed state, supply a value for `open` at creation time and update its value in response to
 * `onClose`/`onOpen` events.
 *
 * @class ExpandableInput
 * @memberof moonstone/ExpandableInput
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @ui
 * @public
 */
const ExpandableInput = Expandable(
	Changeable(
		ExpandableInputBase
	)
);

export default ExpandableInput;
export {ExpandableInput, ExpandableInputBase};
