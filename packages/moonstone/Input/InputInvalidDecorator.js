import {contextTypes} from '@enact/i18n/I18nDecorator';
import FloatingLayer from '@enact/ui/FloatingLayer';
import hoc from '@enact/core/hoc';
import PropTypes from 'prop-types';
import React from 'react';
import ri from '@enact/ui/resolution';

import Tooltip from '../TooltipDecorator/Tooltip';

import css from './Input.less';

/**
 * {@link moonstone/Input.InputInvalidDecorator} is a Higher-order Component that manages the
 * invalid tooltip for an {@link moonstone/Input.Input}
 *
 * @class InputInvalidDecorator
 * @memberof moonstone/Input/InputInvalidDecorator
 * @hoc
 * @private
 */
const InputInvalidDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		displayName: 'InputInvalidDecorator'

		static propTypes = {
			/**
			 * When `true`, the message tooltip is shown if it exists.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			invalid: PropTypes.bool,

			/**
			 * The tooltip text to be displayed when the contents of the input are invalid. If this value is
			 * falsy, the tooltip will not be shown.
			 *
			 * @type {String}
			 * @default ''
			 * @public
			 */
			invalidMessage: PropTypes.string
		}

		static defaultProps ={
			invalid: false,
			invalidMessage: ''
		}

		static contextTypes = contextTypes

		constructor (props) {
			super(props);

			this.TOOLTIP_HEIGHT = ri.scale(18); // distance between client and tooltip's label

			this.state = {
				position: {top: 0, left: 0}
			};
		}

		setTooltipLayout () {
			const tooltipNode = this.tooltipRef.getBoundingClientRect(); // label bound
			const clientNode = this.clientRef.getBoundingClientRect(); // client bound

			let position = {};

			if (!this.context.rtl) { // tooltip direction defaults to 'right'
				position.left = clientNode.right + this.TOOLTIP_HEIGHT;
			} else {
				position.left = clientNode.left - tooltipNode.width - this.TOOLTIP_HEIGHT;
			}

			position.top = clientNode.top + clientNode.height / 2 - tooltipNode.height;

			this.setState({
				position
			});
		}

		getClient = (node) => {
			this.clientRef = node;
		}

		getTooltipRef = (node) => {
			this.tooltipRef = node;
			if (node) {
				this.setTooltipLayout();
			}
		}

		render () {
			const {invalid, invalidMessage, ...rest} = this.props;

			return (
				<div className={css.invalidDecorator} ref={this.getClient}>
					<Wrapped {...rest} invalid={invalid} />
					{invalidMessage ?
						<FloatingLayer open={invalid} scrimType="none">
							<Tooltip
								arrowAnchor="top"
								direction={this.context.rtl ? 'left' : 'right'}
								position={this.state.position}
								tooltipRef={this.getTooltipRef}
							>
								{invalidMessage}
							</Tooltip>
						</FloatingLayer> :
						null
					}
				</div>
			);
		}
	};
});

export default InputInvalidDecorator;
