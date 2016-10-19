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
	toggle: null
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
			 * When `true`, applies a disabled style and the control becomes non-interactive.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * The initial value of the contents of the expandable. Setting this enables
			 * the initial render of the child component to be pre-selected.
			 *
			 * @type {String}
			 * @default null
			 * @public
			 */
			label: PropTypes.string,

			/**
			 * Text to display when no `label` is set. Leave blank to have the initial
			 * control not display a label when no option is selected.
			 *
			 * @type {String}
			 */
			noneText: PropTypes.string,

			/**
			 * Callback to be called when a condition occurs which should cause the expandable to close
			 *
			 * @type {Function}
			 * @default null
			 * @public
			 */
			onClose: PropTypes.func,

			/**
			 * Callback to be called when a condition occurs which should cause the expandable to open
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
			 * Called to request to toggle the expandable's open state. If `onToggle` is specified along
			 * with `onOpen` or `onClose`, `onToggle` will be called first, followed by either `onOpen` or `onClose`.
			 *
			 * @type {Function}
			 * @default null
			 * @public
			 */
			onToggle: PropTypes.func,

			/**
			 * When `true`, the control in rendered in the expanded state, with the contents visible?
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			open: PropTypes.bool
		},

		defaultProps: {
			disabled: false,
			open: false
		},

		computed: {
			determinedLabel: ({label, noneText, open}) => {
				if (open) return null;
				if (label != null && label !== '') return label;

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
		} else {
			// Return `true` to allow event to propagate to containers for unhandled cancel
			return true;
		}
	};

	return Toggleable(
		{activate: 'onOpen', deactivate: 'onClose', mutable: true, prop: 'open'},
		Cancelable(
			{component: 'span', onCancel: handleCancel},
			ExpandableBase
		)
	);
});

export default Expandable;
export {Expandable};
