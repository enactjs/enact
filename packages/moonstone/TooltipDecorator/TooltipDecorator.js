/**
 * Exports the {@link moonstone/TooltipDecorator.TooltipDecorator} Higher-order Component (HOC),
 * {@link moonstone/TooltipDecorator.Tooltip} and {@link moonstone/TooltipDecorator/TooltipBase}
 * components. The default export is {@link moonstone/TooltipDecorator.TooltipDecorator}.
 *
 * @module moonstone/TooltipDecorator
 */

import {hoc} from '@enact/core';
import {forward} from '@enact/core/handle';
import {startJob, stopJob} from '@enact/core/jobs';
import ri from '@enact/ui/resolution';
import FloatingLayer from '@enact/ui/FloatingLayer';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import React, {PropTypes} from 'react';

import {Tooltip, TooltipBase} from './Tooltip';

/**
 * {@link moonstone/TooltipDecorator.TooltipDecorator} is a Higher-order Component which
 * positions {@link moonstone/TooltipDecorator/Tooltip.Tooltip} in relation to the
 * Wrapped component.
 * The tooltip is automatically displayed when the user hovers over the decorator for
 * a given period of time. The tooltip is positioned around the decorator where there
 * is available window space.
 *
 * @class TooltipDecorator
 * @memberof moonstone/TooltipDecorator/TooltipDecorator
 * @ui
 * @public
 */
const TooltipDecorator = hoc((config, Wrapped) => {

	const forwardBlur = forward('onBlur');
	const forwardFocus = forward('onFocus');

	return class extends React.Component {
		static displayName = 'TooltipDecorator'

		static propTypes = /** @lends moonstone/TooltipDecorator.TooltipDecorator.prototype */ {
			/**
			 * Number of milliseconds to wait before showing tooltip when hover.
			 *
			 * @type {Number}
			 * @default 500
			 * @public
			 */
			showDelay: PropTypes.number,

			/**
			 * Position of the tooltip with respect to the activating control. Valid values are
			 * `'above'`, `'above center'`, `'above left'`, `'above right'`, `'below'`, `'below center'`,
			 * `'below left'`, `'below right'`, `'left bottom'`, `'left middle'`, `'left top'`,
			 * `'right bottom'`, `'right middle'`, `'right top'`.
			 * The values starting with `'left`' and `'right'` place the tooltip on the side
			 * (sideways tooltip) with two additional positions available, `'top'` and `'bottom'`, which
			 * places the tooltip content toward the top or bottom, with the tooltip pointer
			 * middle-aligned to the activator.
			 *
			 * @type {String}
			 * @default 'above'
			 * @public
			 */
			tooltipPosition: PropTypes.oneOf([
				'above', 'above center', 'above left', 'above right',
				'below', 'below center', 'below left', 'below right',
				'left bottom', 'left middle', 'left top',
				'right bottom', 'right middle', 'right top']),

			/**
			 * When true, the case of the [`tooltipText`]{@link moonstone/TooltipDecorator.TooltipDecorator#tooltipText}
			 * will remain unchanged.
			 * Uses [Uppercase HOC]{@link i18n/Uppercase.Uppercase} and mirrors the
			 * [preserveCase prop]{@link i18n/Uppercase.Uppercase#preserveCase}
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			tooltipPreserveCase: PropTypes.bool,

			/**
			 * The text to be displayed as the main content of the tooltip.
			 *
			 * @type {String}
			 * @public
			 */
			tooltipText: PropTypes.string,

			/**
			 * The width of tooltip content in pixels (px). If the content goes over the given width,
			 * then it will automatically wrap texts.
			 *
			 * @type {Number|null}
			 * @public
			 */
			tooltipWidth: PropTypes.number
		}

		static defaultProps = {
			showDelay: 500,
			tooltipPosition: 'above',
			tooltipPreserveCase: false
		}

		static contextTypes = contextTypes

		constructor (props) {
			super(props);

			this.overflow = {};
			this.TOOLTIP_HEIGHT = ri.scale(18); // distance between client and tooltip's label

			this.state = {
				showing: false,
				tooltipDirection: null,
				arrowAnchor: null,
				position: {top: 0, left: 0}
			};
		}

		adjustPosition () {
			const position = this.props.tooltipPosition;
			const arr = position.split(' ');

			if (arr.length === 2) {
				[this.tooltipDirection, this.arrowAnchor] = arr;
			} else if (position === 'above' || position === 'below') {
				this.tooltipDirection = position;
				this.arrowAnchor = 'left';
			} else {
				this.tooltipDirection = 'above';
				this.arrowAnchor = 'left';
			}

			if (this.context.rtl) {
				if (this.tooltipDirection === 'above' || this.tooltipDirection === 'below') {
					this.arrowAnchor = this.arrowAnchor === 'left' ? 'right' : 'left';
				} else if (this.tooltipDirection === 'left' || this.tooltipDirection === 'right') {
					this.tooltipDirection = this.tooltipDirection === 'left' ? 'right' : 'left';
				}
			}

			const tooltipNode = this.tooltipRef.getBoundingClientRect(); // label bound
			const clientNode = this.clientRef.getBoundingClientRect(); // clinet bound

			this.calcOverflow(tooltipNode, clientNode);
			this.adjustDirection();

			this.setState({
				tooltipDirection: this.tooltipDirection,
				arrowAnchor: this.arrowAnchor,
				position: this.getPosition(tooltipNode, clientNode)
			});
		}

		calcOverflow (tooltip, clientNode) {
			if (this.tooltipDirection === 'above' || this.tooltipDirection === 'below') {
				this.overflow = {
					isOverTop: clientNode.top - tooltip.height - this.TOOLTIP_HEIGHT < 0,
					isOverBottom: clientNode.bottom + tooltip.height + this.TOOLTIP_HEIGHT > window.innerHeight,
					isOverLeft: clientNode.left - tooltip.width + (clientNode.width) / 2 < 0,
					isOverRight: clientNode.right + tooltip.width - (clientNode.width) / 2 > window.innerWidth
				};
			} else if (this.tooltipDirection === 'left' || this.tooltipDirection === 'right') {
				this.overflow = {
					isOverTop: clientNode.top - (tooltip.height - clientNode.height) / 2 < 0,
					isOverBottom: clientNode.bottom + (tooltip.height - clientNode.height) / 2 > window.innerHeight,
					isOverLeft: clientNode.left - tooltip.width - this.TOOLTIP_HEIGHT < 0,
					isOverRight: clientNode.right + tooltip.width + this.TOOLTIP_HEIGHT > window.innerWidth
				};
			}
		}

		adjustDirection () {
			// Flip tooltip if it overlows towards the tooltip direction
			if (this.overflow.isOverTop && this.tooltipDirection === 'above') {
				this.tooltipDirection = 'below';
			} else if (this.overflow.isOverBottom && this.tooltipDirection === 'below') {
				this.tooltipDirection = 'above';
			} else if (this.overflow.isOverLeft && this.tooltipDirection === 'left') {
				this.tooltipDirection = 'right';
			} else if (this.overflow.isOverRight && this.tooltipDirection === 'right') {
				this.tooltipDirection = 'left';
			}

			// Flip sideways for 'above' and 'below' if it overflows to the sides
			if (this.tooltipDirection === 'above' || this.tooltipDirection === 'below') {
				if (this.overflow.isOverRight) {
					this.arrowAnchor = 'right';
				} else if (this.overflow.isOverLeft) {
					this.arrowAnchor = 'left';
				}
			}
		}

		getPosition (tooltipNode, clientNode) {
			let position = {};
			switch (this.tooltipDirection) {
				case 'above':
					position.top = clientNode.top - tooltipNode.height - this.TOOLTIP_HEIGHT;
					break;
				case 'below':
					position.top = clientNode.bottom + this.TOOLTIP_HEIGHT;
					break;
				case 'right':
					position.left = clientNode.right + this.TOOLTIP_HEIGHT;
					break;
				case 'left':
					position.left = clientNode.left - tooltipNode.width - this.TOOLTIP_HEIGHT;
					break;
				default:
					position = {};
			}

			if (this.tooltipDirection === 'above' || this.tooltipDirection === 'below') {
				position.left = clientNode.left + clientNode.width / 2;

				if (this.arrowAnchor === 'right') {
					position.left -= tooltipNode.width;
				} else if (this.arrowAnchor === 'center') {
					position.left -= tooltipNode.width / 2;
				}
			} else if (this.tooltipDirection === 'left' || this.tooltipDirection === 'right') {
				position.top = clientNode.top + clientNode.height / 2;

				if (this.arrowAnchor === 'top') {
					position.top -= tooltipNode.height;
				} else if (this.arrowAnchor === 'middle') {
					position.top -= tooltipNode.height / 2;
				}
			}

			return position;
		}

		handleFocus = (ev) => {
			const {tooltipText, showDelay} = this.props;

			if (tooltipText) {
				this.clientRef = ev.target;
				startJob('showTooltip', () => {
					this.setState({showing: true});
					this.adjustPosition();
				}, showDelay);
			}

			forwardFocus(ev, this.props);
		}

		handleBlur = (ev) => {
			if (this.props.tooltipText) {
				this.clientRef = null;
				stopJob('showTooltip');
				this.setState({showing: false});
			}

			forwardBlur(ev, this.props);
		}

		getTooltipRef = (node) => {
			this.tooltipRef = node;
		}

		render () {
			const {children, tooltipPreserveCase, tooltipText, tooltipWidth, ...rest} = this.props;
			delete rest.showDelay;
			delete rest.tooltipPosition;

			return (
				<Wrapped
					{...rest}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
				>
					{children}
					<FloatingLayer open={this.state.showing} scrimType="none">
						<Tooltip
							direction={this.state.tooltipDirection}
							arrowAnchor={this.state.arrowAnchor}
							position={this.state.position}
							width={tooltipWidth}
							tooltipRef={this.getTooltipRef}
							preserveCase={tooltipPreserveCase}
						>
							{tooltipText}
						</Tooltip>
					</FloatingLayer>
				</Wrapped>
			);
		}
	};
});

export default TooltipDecorator;
export {TooltipDecorator, Tooltip, TooltipBase};
