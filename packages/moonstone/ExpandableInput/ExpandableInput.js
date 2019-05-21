/**
 * Moonstone styled expandable input.
 *
 * @example
 * <ExpandableInput
 *   placeholder="Input here"
 *   title="Expandable Input"
 * />
 *
 * @module moonstone/ExpandableInput
 * @exports ExpandableInput
 * @exports ExpandableInputBase
 */

import Changeable from '@enact/ui/Changeable';
import {adaptEvent, call, forKey, forward, handle, oneOf, preventDefault, stopImmediate} from '@enact/core/handle';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Pause from '@enact/spotlight/Pause';

import {calcAriaLabel, extractInputProps, Input} from '../Input';
import {Expandable, ExpandableItemBase} from '../ExpandableItem';

import css from './ExpandableInput.module.less';

const handleDeactivate = handle(
	call('shouldClose'),
	adaptEvent(
		() => ({type: 'onClose'}),
		forward('onClose')
	)
);

// Special onKeyDown handle for up and down key events
const handleUpDown = handle(
	// prevent InputSpotlightDecorator from attempting to move focus up/down
	preventDefault,
	// prevent Spotlight handling up/down since closing the expandable will spot the label
	stopImmediate,
	// trigger close to resume spotlight and emit onClose
	handleDeactivate
);

/**
 * A stateless component that expands to render a {@link moonstone/Input.Input}.
 *
 * @class ExpandableInputBase
 * @memberof moonstone/ExpandableInput
 * @extends moonstone/ExpandableItem.ExpandableItemBase
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
		 * Disables ExpandableInput and the control becomes non-interactive.
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
		 * Called when the expandable value is changed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onChange: PropTypes.func,

		/**
		 * Called when a condition occurs which should cause the expandable to close.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onClose: PropTypes.func,

		/**
		 * Called when the component is removed while retaining focus.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightDisappear: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way left key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightLeft: PropTypes.func,

		/**
		 * Called prior to focus leaving the expandable when the 5-way right key is pressed.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @public
		 */
		onSpotlightRight: PropTypes.func,

		/**
		 * Opens the control, with the contents visible.
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
		 * Disables spotlight navigation in the component.
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
		super(props);

		this.paused = new Pause('ExpandableInput');
		this.pointer = false;
		this.state = {
			initialValue: props.value
		};

		this.handleUpDown = handleUpDown.bind(this);
		this.handleDeactivate = handleDeactivate.bind(this);
	}

	componentDidUpdate (prevProps) {
		if (prevProps.open && !this.props.open) {
			this.paused.resume();
		}
	}

	componentWillUnmount () {
		this.paused.resume();
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

	resetValue = () => {
		this.paused.resume();
		forward('onChange', {
			value: this.state.initialValue
		}, this.props);
	}

	shouldClose () {
		return this.paused.resume() && !this.pointer;
	}

	handleInputKeyDown = oneOf(
		[forKey('up'), handleUpDown],
		[forKey('down'), handleUpDown],
		[forKey('left'), forward('onSpotlightLeft')],
		[forKey('right'), forward('onSpotlightRight')],
		[forKey('cancel'), this.resetValue]
	).bind(this)

	handleActivate = () => {
		this.paused.pause();
	}

	handleChange = (val) => forward('onChange', val, this.props)

	handleDown = () => {
		this.pointer = true;
	}

	handleOpen = handle(
		forward('onOpen'),
		(ev, {value}) => this.setState({initialValue: value})
	).bind(this)

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
				onOpen={this.handleOpen}
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
 * A stateful component that expands to render a {@link moonstone/Input.Input}.
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
 * @extends moonstone/ExpandableInput.ExpandableInputBase
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
