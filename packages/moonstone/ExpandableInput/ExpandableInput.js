/**
 * Exports the {@link moonstone/ExpandableInput.ExpandableInput} and
 * {@link moonstone/ExpandableInput.ExpandableInputBase} components.
 * The default export is {@link moonstone/ExpandableInput.ExpandableInput}.
 *
 * @module moonstone/ExpandableInput
 */

import Changeable from '@enact/ui/Changeable';
import {forKey, forward, oneOf, preventDefault, stopImmediate} from '@enact/core/handle';
import deprecate from '@enact/core/internal/deprecate';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Pause from '@enact/spotlight/Pause';

import {calcAriaLabel, extractInputProps, Input} from '../Input';
import {Expandable, ExpandableItemBase} from '../ExpandableItem';

import css from './ExpandableInput.less';

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
		 * @deprecated replaced by `onChange`
		 * @public
		 */
		onInputChange: PropTypes.func,

		/**
		 * The handler to run when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * The handler to run prior to focus leaving the expandable when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

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

		this.paused = new Pause('ExpandableInput');
		this.pointer = false;
		this.state = {
			initialValue: props.value
		};

		if (props.onInputChange) {
			deprecate({name: 'onInputChange', since: '1.0.0', message: 'Use `onChange` instead', until: '2.0.0'});
		}
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

	resetValue = () => {
		this.paused.resume();
		forward('onChange', {
			value: this.state.initialValue
		}, this.props);
	}

	handleInputKeyDown = oneOf(
		// prevent Enter onKeyPress which would re-open the expandable when the label
		// receives focus
		[forKey('enter'), preventDefault],
		// prevent Spotlight handling up/down since closing the expandable will spot the label
		[forKey('up'), stopImmediate],
		[forKey('down'), stopImmediate],
		[forKey('left'), forward('onSpotlightLeft')],
		[forKey('right'), forward('onSpotlightRight')],
		[forKey('cancel'), this.resetValue]
	).bind(this)

	handleActivate = () => {
		this.paused.pause();
	}

	handleDeactivate = () => {
		if (this.paused.resume() && !this.pointer) {
			this.fireCloseEvent();
		}
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

	handleDown = () => {
		this.pointer = true;
	}

	handleUp = () => {
		this.pointer = false;
	}

	calcClassName = (className) => (className ? `${css.expandableInput} ${className}` : css.expandableInput)

	render () {
		const {
			className,
			disabled,
			iconAfter,
			iconBefore,
			open,
			placeholder,
			spotlightDisabled,
			type,
			value,
			...rest
		} = this.props;

		const inputProps = extractInputProps(rest);
		delete rest.onChange;
		delete rest.onInputChange;

		return (
			<ExpandableItemBase
				{...rest}
				aria-label={this.calcAriaLabel()}
				className={this.calcClassName(className)}
				disabled={disabled}
				label={this.calcLabel()}
				onMouseDown={this.handleDown}
				onMouseLeave={this.handleUp}
				onMouseUp={this.handleUp}
				open={open}
				showLabel={type === 'password' ? 'never' : 'auto'}
				spotlightDisabled={spotlightDisabled}
			>
				<Input
					{...inputProps}
					autoFocus
					className={css.decorator}
					disabled={disabled}
					dismissOnEnter
					iconAfter={iconAfter}
					iconBefore={iconBefore}
					onActivate={this.handleActivate}
					onChange={this.handleChange}
					onDeactivate={this.handleDeactivate}
					onKeyDown={this.handleInputKeyDown}
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
const ExpandableInput = Pure(
	Expandable(
		{noPointerMode: true},
		Changeable(
			ExpandableInputBase
		)
	)
);

export default ExpandableInput;
export {ExpandableInput, ExpandableInputBase};
