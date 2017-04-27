import {contextTypes} from '@enact/i18n/I18nDecorator';
import hoc from '@enact/core/hoc';
import kind from '@enact/core/kind';
import React from 'react';
import PropTypes from 'prop-types';

import Tooltip from '../TooltipDecorator/Tooltip';

import css from './Input.less';

const InputInvalidDecorator = hoc((config, Wrapped) => {
	return kind({
		name:'InputInvalidDecorator',

		propTypes: {
			invalid: PropTypes.bool,
			invalidMessage: PropTypes.string
		},

		contextTypes,

		computed: {
			direction: (props, {rtl}) => rtl ? 'left' : 'right',
			invalidInputClassName: ({invalid}) => invalid ? css.invalidInput : null
		},

		render: ({direction, invalid, invalidInputClassName, invalidMessage, ...rest}) => {
			return (
				<div className={css.tooltipDecorator}>
					<Wrapped {...rest} className={invalidInputClassName} />
					{invalid && invalidMessage ?
						<Tooltip className={css.invalidTooltip} arrowAnchor="top" direction={direction}>
							{invalidMessage}
						</Tooltip> :
						null
					}
				</div>
			);
		}
	});
});

export default InputInvalidDecorator;
