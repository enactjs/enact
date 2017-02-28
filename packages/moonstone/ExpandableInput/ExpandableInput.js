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
import React from 'react';

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
		title: React.PropTypes.string.isRequired,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @public
		 */
		disabled: React.PropTypes.bool,

		/**
		 * The icon to be placed at the end of the input.
		 *
		 * @see {@link moonstone/Icon.Icon}
		 * @type {String}
		 * @public
		 */
		iconAfter: React.PropTypes.string,

		/**
		 * The icon to be placed at the beginning of the input.
		 *
		 * @see {@link moonstone/Icon.Icon}
		 * @type {String}
		 * @public
		 */
		iconBefore: React.PropTypes.string,

		/**
		 * Text to display when no `value` is set.
		 *
		 * @type {String}
		 * @public
		 */
		noneText: React.PropTypes.string,

		/**
		 * The handler to run when the expandable value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: React.PropTypes.func,

		/**
		 * Callback to be called when a condition occurs which should cause the expandable to close
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onClose: React.PropTypes.func,

		/**
		 * The handler to run when the input value is changed.
		 *
		 * @type {Function}
		 * @public
		 */
		onInputChange: React.PropTypes.func,

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: React.PropTypes.func,

		/**
		 * When `true`, the control is rendered in the expanded state, with the contents visible
		 *
		 * @type {Boolean}
		 * @public
		 */
		open: React.PropTypes.bool,

		/**
		 * The placeholder text to display.
		 *
		 * @type {String}
		 * @see moonstone/Input.Input#placeholder
		 * @public
		 */
		placeholder: React.PropTypes.string,

		/**
		 * When `true`, the component cannot be navigated using spotlight.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		spotlightDisabled: React.PropTypes.bool,

		/**
		 * The type of input. Accepted values correspond to the standard HTML5 input types.
		 *
		 * @type {String}
		 * @see moonstone/Input.Input#type
		 * @public
		 */
		type: React.PropTypes.string,

		/**
		 * The value of the input.
		 *
		 * @type {String|Number}
		 * @see moonstone/Input.Input#value
		 * @public
		 */
		value: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number])
	}

	static defaultProps = {
		spotlightDisabled: false
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

	fireChangeEvent = () => {
		const {onChange, onClose, value} = this.props;

		if (onClose) {
			onClose();
		}

		if (onChange) {
			onChange({value});
		}
	}

	handleInputKeyDown = (ev) => {
		const keyCode = ev.keyCode;

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

		if (isEnter || isUpDown) {
			this.fireChangeEvent();
		}
	}

	handleInputBlur = () => {
		// if `open` is `false`, the contained <input> has lost focus due to 5-way navigation
		// in `handleInputKeyDown`, where the `fireChangeEvent` method has already been called
		// verify the expandable is open before calling that method again.
		if (this.props.open) {
			this.fireChangeEvent();
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
		this.fireChangeEvent();
		// not forwarding event because this is being done in fireChangeEvent
	}

	render () {
		const {disabled, iconAfter, iconBefore, onInputChange, onSpotlightDisappear, placeholder, spotlightDisabled, type, value, ...rest} = this.props;
		delete rest.onChange;

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
					onChange={onInputChange}
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
 * @class ExpandableInput
 * @memberof moonstone/ExpandableInput
 * @ui
 * @mixes moonstone/ExpandableItem.Expandable
 * @mixes ui/Changeable.Changeable
 * @public
 */
const ExpandableInput = Expandable(
	Changeable(
		{mutable: true, change: 'onInputChange'},
		ExpandableInputBase
	)
);

export default ExpandableInput;
export {ExpandableInput, ExpandableInputBase};
