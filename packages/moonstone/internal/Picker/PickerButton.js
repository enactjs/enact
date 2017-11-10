import {forward, forProp, handle} from '@enact/core/handle';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';
import Pure from '@enact/ui/internal/Pure';

import {contextTypes} from '../../Marquee/MarqueeController';
import Holdable from '../Holdable';
import Icon from '../../Icon';
import IconButton from '../../IconButton';
import {withSkinnableProps} from '../../Skinnable';

import css from './Picker.less';

const PickerButtonBase = kind({
	name: 'PickerButton',

	propTypes: {
		disabled: PropTypes.bool,
		hidden: PropTypes.bool,
		icon: PropTypes.oneOfType([
			PropTypes.string,
			PropTypes.object
		]),
		joined: PropTypes.bool,
		onSpotlightDisappear: PropTypes.func,
		skin: PropTypes.string,
		spotlightDisabled: PropTypes.bool
	},

	defaultProps: {
		joined: false
	},

	contextTypes: contextTypes,

	styles: {
		css
	},

	handlers: {
		onMouseEnter: handle(
			forward('onMouseEnter'),
			forProp('joined', false),
			(ev, props, context) => {
				if (context.enter) {
					context.enter(null);
				}
			}
		),
		onMouseLeave: handle(
			forward('onMouseLeave'),
			forProp('joined', false),
			(ev, props, context) => {
				if (context.leave) {
					context.leave(null);
				}
			}
		)
	},

	computed: {
		className: ({hidden, styler}) => styler.append({
			hidden
		})
	},

	render: ({disabled, icon, joined, ...rest}) => {
		if (joined) {
			delete rest.hidden;
			delete rest.onSpotlightDisappear;
			delete rest.skin;
			delete rest.spotlightDisabled;

			return (
				<span {...rest} disabled={disabled}>
					<Icon className={css.icon} disabled={disabled} small>{icon}</Icon>
				</span>
			);
		} else {
			return (
				<IconButton {...rest} backgroundOpacity="transparent" disabled={disabled} small>
					{icon}
				</IconButton>
			);
		}
	}
});

const PickerButton = Pure(
	Holdable(
		{resume: true, endHold: 'onLeave'},
		withSkinnableProps(
			PickerButtonBase
		)
	)
);

export default PickerButton;
export {
	PickerButton,
	PickerButtonBase
};
