/**
 * Exports the {@link moonstone/CheckboxItem.CheckboxItem} component.
 *
 * @module moonstone/CheckboxItem
 */

import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';
import Toggleable from '@enact/ui/Toggleable';

import Skinnable from '../Skinnable';
import {ToggleItemBase} from '../ToggleItem';
import Checkbox from '../Checkbox';

import VoiceControl from '@enact/webos/VoiceControl';
import VoiceControlDecorator from '@enact/ui/VoiceControlDecorator';

/**
 * {@link moonstone/CheckboxItem.CheckboxItemBase} is a component that
 * is an Item that is Toggleable. It has two states: `true` (selected) & `false`
 * (unselected). It uses a check icon to represent its selected state.
 *
 * @class CheckboxItemBase
 * @memberof moonstone/CheckboxItem
 * @ui
 * @public
 */
const CheckboxItemBase = kind({
	name: 'CheckboxItem',

	propTypes: /** @lends moonstone/CheckboxItem.CheckboxItemBase.prototype */ {
		/**
		 * The string to be displayed as the main content of the checkbox item.
		 *
		 * @type {String}
		 * @public
		 */
		children: PropTypes.string.isRequired,

		/**
		 * When `true`, applies a disabled style and the control becomes non-interactive.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		disabled: PropTypes.bool,

		/**
		 * Specifies on which side (`before` or `after`) of the text the icon appears.
		 *
		 * @type {String}
		 * @default 'before'
		 * @public
		 */
		iconPosition: PropTypes.oneOf(['before', 'after']),

		/**
		 * When `true`, an inline visual effect is applied to the button.
		 *
		 * @type {Boolean}
		 * @default false
		 * @public
		 */
		inline: PropTypes.bool,

		/**
		 * The handler to run when the checkbox item is toggled.
		 *
		 * @type {Function}
		 * @param {Object} event
		 * @param {String} event.selected - Selected value of item.
		 * @param {*} event.value - Value passed from `value` prop.
		 * @public
		 */
		onToggle: PropTypes.func,

		/**
		 * When `true`, a check mark icon is applied to the button.
		 *
		 * @type {Boolean}
		 * @public
		 */
		selected: PropTypes.bool,

		/**
		 * The value that will be sent to the `onToggle` handler.
		 *
		 * @type {String|Number}
		 * @default ''
		 * @public
		 */
		value: PropTypes.any
	},

	defaultProps: {
		disabled: false,
		iconPosition: 'before',
		inline: false,
		value: ''
	},

	computed: {
		icon: ({selected, disabled}) => (
			<Checkbox selected={selected} disabled={disabled} />
		)
	},

	render: (props) => (
		<ToggleItemBase {...props} />
	)
});

/**
 * {@link moonstone/CheckboxItem.CheckboxItem} is a component that is an Item that is Toggleable. It
 * has two states: `true` (selected) & `false` (unselected). It uses a check icon to represent its
 * selected state.
 *
 * By default, `CheckboxItem` maintains the state of its `selected` property. Supply the
 * `defaultSelected` property to control its initial value. If you wish to directly control updates
 * to the component, supply a value to `selected` at creation time and update it in response to
 * `onToggle` events.
 *
 * @class CheckboxItem
 * @memberof moonstone/CheckboxItem
 * @ui
 * @public
 */
const CheckboxItem = Pure(
	VoiceControlDecorator({voiceIntent: 'check', voiceHandler: 'onToggle', voiceParams: {selected: true}},
		Toggleable(
			{prop: 'selected'},
			Skinnable(
				CheckboxItemBase
			)
		)
	)
);

class VoiceCheckboxItem extends React.Component {
	static propTypes = {
		onToggle: PropTypes.func,
		selected: PropTypes.bool,
		voiceDisabled: PropTypes.bool
	}

	static defaultProps = {
		voiceDisabled: false
	}

	constructor (props) {
		super(props);
		this.state = {
			selected: typeof this.props.selected === 'boolean' ? this.props.selected : false
		};
	}

	componentDidMount () {
		if (!this.props.voiceDisabled) {
			this.addVoice();
		}
	}

	componentWillUnmount () {
		this.removeVoice();
	}

	componentWillReceiveProps (nextProps) {
		if (!this.props.voiceDisabled && nextProps.voiceDisabled) {
			this.removeVoice();
		} else if (this.props.voiceDisabled && !nextProps.voiceDisabled) {
			this.addVoice();
		}

		if (!this.props.selected && nextProps.selected) {
			this.setState({selected: true});
		} else if (this.props.selected && !nextProps.selected) {
			this.setState({selected: false});
		}
	}

	addVoice = () => {
		const {children} = this.props;

		this.voiceList = VoiceControl.addList([
			{
				voiceIntent: 'check',
				voiceLabel: children,
				onVoice: () => {
					if (!this.state.selected) {
						this.setState({selected: true});
					}
				}
			},
			{
				voiceIntent: 'uncheck',
				voiceLabel: children,
				onVoice: () => {
					if (this.state.selected) {
						this.setState({selected: false});
					}
				}
			}
		]);
	}

	handleToggle = (e) => {
		this.setState({
			selected: e.selected
		});
	}

	removeVoice = () => {
		VoiceControl.removeList(this.voiceList);
	}

	render () {
		const props = {...this.props};
		delete props.onToggle;
		delete props.selected;
		delete props.voiceDisabled;

		return (
			<CheckboxItem {...props} selected={this.state.selected} onToggle={this.handleToggle} />
		);
	}
}

export default CheckboxItem;
export {CheckboxItem, CheckboxItemBase, VoiceCheckboxItem};
