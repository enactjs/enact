import {kind, hoc} from '@enact/core';
import Cancelable from '@enact/ui/Cancelable';
import Toggleable from '@enact/ui/Toggleable';
import Transition from '@enact/ui/Transition';
import {SpotlightContainerDecorator} from '@enact/spotlight';
import React, {PropTypes} from 'react';

import LabeledItem from '../LabeledItem';

import ExpandableContainer from './ExpandableContainer';

const defaultConfig = {
	open: null,
	close: null,
	toggle: null,
	prop: 'value'
};

const wrapMethod = (method, handler, props) => {
	if (method && handler) {
		const origHandler = props[method];
		props[method] = (ev) => {
			if (origHandler) origHandler(ev);
			handler();
		};
	}
};

const TransitionContainer = SpotlightContainerDecorator(Transition);

const Expandable = hoc(defaultConfig, (config, Wrapped) => {
	const ExpandableBase = kind({
		name: 'Expandable',

		propTypes: {
			/**
			 * The primary text of the item.
			 *
			 * @type {String}
			 * @required
			 * @public
			 */
			title: PropTypes.string.isRequired,

			/**
			 * Is this control interactive (false), or not (true)?
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * The secondary, or supportive text. Typically under the title, a subtitle.
			 *
			 * @type {String|Number}
			 * @default null
			 * @public
			 */
			label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

			/**
			 * Text to display when no label or value is set. Leave blank to have the initial
			 * control not display a label when no option is selected.
			 *
			 * @type {String}
			 */
			noneText: PropTypes.string,

			/**
			 * Method to be called when a condition occurs which should cause the expandable to close
			 *
			 * @type {Function}
			 * @default null
			 * @public
			 */
			onClose: PropTypes.func,

			/**
			 * Method to be called when a condition occurs which should cause the expandable to open
			 *
			 * @type {Function}
			 * @default null
			 * @public
			 */
			onOpen: PropTypes.func,

			// NOTE: considering removing onToggle as I can't see a good use for it once the History API
			// is in place managing the state of `open`. It's adding complexity without a significant
			// value, imo.

			/**
			 * Called to request to toggle the expandables open state. If onToggle is specified along
			 * with onOpen or onClose, onToggle will be called first and then either onOpen or onClose.
			 *
			 * @type {Function}
			 * @default null
			 * @public
			 */
			onToggle: PropTypes.func,

			/**
			 * Is this control in the expanded state (true), opened, with the contents visible?
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			open: PropTypes.bool,

			/**
			 * The initial value or index of the contents of the expandable. Setting this enables
			 * the initial render of the child component to be pre-selected.
			 *
			 * @type {String|Number}
			 * @default null
			 * @public
			 */
			value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
		},

		defaultProps: {
			disabled: false,
			open: false
		},

		computed: {
			determinedLabel: ({[config.prop]: value, label, noneText}) => {
				if (label != null) return label;
				if (value != null) return value;
				return noneText;
			},
			handleOpen: ({disabled, onClose, onOpen, onToggle, open}) => {
				// When disabled, don't attach an event
				if (!disabled) {
					const handler = open ? onClose : onOpen;
					if (onToggle && handler) {
						// if we have both, we need to wrap them in a function so they can both be
						// called.
						return () => {
							onToggle({open: !open});
							handler();
						};
					} else if (onToggle) {
						return () => onToggle({open: !open});
					} else {
						return handler;
					}
				}
			}
		},

		render: ({determinedLabel, disabled, handleOpen, open, style, title, onClose, onOpen, onToggle, ...rest}) => {
			delete rest.noneText;
			delete rest.label;

			wrapMethod(config.close, onClose, rest);
			wrapMethod(config.open, onOpen, rest);
			wrapMethod(config.toggle, onToggle, rest);

			return (
				<ExpandableContainer style={style} disabled={disabled} open={open}>
					<LabeledItem
						disabled={disabled}
						label={determinedLabel}
						onClick={handleOpen}
					>{title}</LabeledItem>
					<TransitionContainer data-container-disabled={!open} visible={open} duration="short" type="clip">
						<Wrapped {...rest} disabled={disabled} />
					</TransitionContainer>
				</ExpandableContainer>
			);
		}
	});

	const handleCancel = (props) => {
		if (props.open) {
			props.onClose();
			return true;
		}
	};

	return Toggleable(
		{activate: 'onOpen', deactivate: 'onClose', prop: 'open'},
		Cancelable(
			{component: 'span', onCancel: handleCancel},
			ExpandableBase
		)
	);
});

export default Expandable;
export {Expandable};
