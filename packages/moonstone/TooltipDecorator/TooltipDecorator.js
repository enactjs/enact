/**
 * Moonstone styled tooltip components.
 *
 * @module moonstone/TooltipDecorator
 */

import hoc from '@enact/core/hoc';
import {I18nContextDecorator} from '@enact/i18n/I18nDecorator';
import {FloatingLayerBase} from '@enact/ui/FloatingLayer';
import {forward, handle, forProp} from '@enact/core/handle';
import {Job} from '@enact/core/util';
import {on, off} from '@enact/core/dispatcher';
import React from 'react';
import PropTypes from 'prop-types';
import ri from '@enact/ui/resolution';

import {Tooltip, TooltipBase} from './Tooltip';

let currentTooltip; // needed to know whether or not we should stop a showing job when unmounting

/**
 * Default config for [TooltipDecorator]{@link moonstone/TooltipDecorator.TooltipDecorator}
 *
 * @memberof moonstone/TooltipDecorator.TooltipDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The name of the property which will receive the tooltip node.
	 *
	 * By default, `TooltipDecorator` will add a new child to the wrapped component, following any
	 * other children passed in. If a component needs to, it can specify another property to receive
	 * the tooltip and the `children` property will not be modified.
	 *
	 * @type {String}
	 * @default 'children'
	 * @memberof moonstone/TooltipDecorator.TooltipDecorator.defaultConfig
	 */
	tooltipDestinationProp: 'children'
};

/**
 * A higher-order component which positions [Tooltip]{@link moonstone/TooltipDecorator.Tooltip} in
 * relation to the wrapped component.
 *
 * The tooltip is automatically displayed when the decoratorated component is focused after a set
 * period of time.
 *
 * The tooltip is positioned around the decorator where there is available window space.
 *
 * Note that the direction of tooltip will be flipped horizontally in RTL locales.
 *
 * @class TooltipDecorator
 * @memberof moonstone/TooltipDecorator
 * @hoc
 * @public
 */
const TooltipDecorator = hoc(defaultConfig, (config, Wrapped) => {

	const tooltipDestinationProp = config.tooltipDestinationProp;

	const Decorator = class extends React.Component {
		static displayName = 'TooltipDecorator'

		static propTypes = /** @lends moonstone/TooltipDecorator.TooltipDecorator.prototype */ {
			/**
			 * Disables the component but does not affect tooltip operation.
			 *
			 * @type {Boolean}
			 * @default false
			 * @public
			 */
			disabled: PropTypes.bool,

			/**
			 * Indicates the tooltip text direction is right-to-left.
			 *
			 * @type {Boolean}
			 * @private
			 */
			rtl: PropTypes.bool,

			/**
			 * The casing of `tooltipText`.
			 *
			 * @see i18n/Uppercase#casing
			 * @type {String}
			 * @default 'upper'
			 * @public
			 */
			tooltipCasing: PropTypes.oneOf(['upper', 'preserve', 'word', 'sentence']),

			/**
			 * Time to wait (in milliseconds) before showing tooltip on hover.
			 *
			 * @type {Number}
			 * @default 500
			 * @public
			 */
			tooltipDelay: PropTypes.number,

			/**
			 * Position of the tooltip with respect to the activating control.
			 *
			 * * Values: `'above'`, `'above center'`, `'above left'`, `'above right'`, `'below'`,
			 * `'below center'`, `'below left'`, `'below right'`, `'left bottom'`, `'left middle'`,
			 * `'left top'`, `'right bottom'`, `'right middle'`, `'right top'`
			 *
			 * The values starting with `'left`' and `'right'` place the tooltip on the side
			 * (sideways tooltip) with two additional positions available, `'top'` and `'bottom'`,
			 * which place the tooltip content toward the top or bottom, with the tooltip pointer
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
			 * Properties to be passed to tooltip component.
			 *
			 * @type {Object}
			 * @public
			 */
			tooltipProps: PropTypes.object,

			/**
			 * Tooltip content.
			 *
			 * @type {Node}
			 * @public
			 */
			tooltipText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

			/**
			 * The width of tooltip content in pixels (px).
			 *
			 * If the content goes over the given width, it will automatically wrap. When `null`,
			 * content does not wrap.
			 *
			 * @type {Number|null}
			 * @public
			 */
			tooltipWidth: PropTypes.number
		}

		static defaultProps = {
			disabled: false,
			tooltipCasing: 'upper',
			tooltipDelay: 500,
			tooltipPosition: 'above'
		}

		constructor (props) {
			super(props);

			this.TOOLTIP_HEIGHT = ri.scale(18); // distance between client and tooltip's label

			this.state = {
				showing: false,
				tooltipDirection: null,
				arrowAnchor: null,
				position: {top: 0, left: 0}
			};
		}

		componentWillUnmount () {
			if (currentTooltip === this) {
				currentTooltip = null;
				this.showTooltipJob.stop();
			}

			if (this.props.disabled) {
				off('keydown', this.handleKeyDown);
			}
		}

		setTooltipLayout () {
			const position = this.props.tooltipPosition;
			const arr = position.split(' ');
			let tooltipDirection = null;
			let arrowAnchor = null;

			if (arr.length === 2) {
				[tooltipDirection, arrowAnchor] = arr;
			} else if (position === 'above' || position === 'below') {
				tooltipDirection = position;
				arrowAnchor = 'right';
			} else {
				tooltipDirection = 'above';
				arrowAnchor = 'right';
			}

			const tooltipNode = this.tooltipRef.getBoundingClientRect(); // label bound
			const clientNode = this.clientRef.getBoundingClientRect(); // client bound
			const overflow = this.calcOverflow(tooltipNode, clientNode, tooltipDirection);

			tooltipDirection = this.adjustDirection(tooltipDirection, overflow);
			arrowAnchor = this.adjustAnchor(arrowAnchor, tooltipDirection, overflow);

			this.setState({
				tooltipDirection,
				arrowAnchor,
				position: this.getPosition(tooltipNode, clientNode, arrowAnchor, tooltipDirection)
			});
		}

		calcOverflow (tooltip, clientNode, tooltipDirection) {
			if (tooltipDirection === 'above' || tooltipDirection === 'below') {
				return {
					isOverTop: clientNode.top - tooltip.height - this.TOOLTIP_HEIGHT < 0,
					isOverBottom: clientNode.bottom + tooltip.height + this.TOOLTIP_HEIGHT > window.innerHeight,
					isOverLeft: clientNode.left - tooltip.width + clientNode.width / 2 < 0,
					isOverRight: clientNode.right + tooltip.width - clientNode.width / 2 > window.innerWidth
				};
			} else if (tooltipDirection === 'left' || tooltipDirection === 'right') {
				return {
					isOverTop: clientNode.top - tooltip.height + clientNode.height / 2 < 0,
					isOverBottom: clientNode.bottom + tooltip.height - clientNode.height / 2 > window.innerHeight,
					isOverLeft: clientNode.left - tooltip.width < 0,
					isOverRight: clientNode.right + tooltip.width > window.innerWidth
				};
			}
		}

		adjustDirection (tooltipDirection, overflow) {
			if (this.props.rtl && (tooltipDirection === 'left' || tooltipDirection === 'right')) {
				tooltipDirection = tooltipDirection === 'left' ? 'right' : 'left';
			}

			// Flip tooltip if it overlows towards the tooltip direction
			if (overflow.isOverTop && tooltipDirection === 'above') {
				tooltipDirection = 'below';
			} else if (overflow.isOverBottom && tooltipDirection === 'below') {
				tooltipDirection = 'above';
			} else if (overflow.isOverLeft && tooltipDirection === 'left') {
				tooltipDirection = 'right';
			} else if (overflow.isOverRight && tooltipDirection === 'right') {
				tooltipDirection = 'left';
			}

			return tooltipDirection;
		}

		adjustAnchor (arrowAnchor, tooltipDirection, overflow) {
			if (tooltipDirection === 'above' || tooltipDirection === 'below') {
				if (this.props.rtl && arrowAnchor !== 'center') {
					arrowAnchor = arrowAnchor === 'left' ? 'right' : 'left';
				}

				// Flip sideways if it overflows to the sides
				if (overflow.isOverRight) {
					arrowAnchor = 'left';
				} else if (overflow.isOverLeft) {
					arrowAnchor = 'right';
				}
			}

			return arrowAnchor;
		}

		getPosition (tooltipNode, clientNode, arrowAnchor, tooltipDirection) {
			let position = {};
			switch (tooltipDirection) {
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

			if (tooltipDirection === 'above' || tooltipDirection === 'below') {
				position.left = clientNode.left + clientNode.width / 2;

				if (arrowAnchor === 'left') {
					position.left -= tooltipNode.width;
				} else if (arrowAnchor === 'center') {
					position.left -= tooltipNode.width / 2;
				}
			} else if (tooltipDirection === 'left' || tooltipDirection === 'right') {
				position.top = clientNode.top + clientNode.height / 2;

				if (arrowAnchor === 'top') {
					position.top -= tooltipNode.height;
				} else if (arrowAnchor === 'middle') {
					position.top -= tooltipNode.height / 2;
				}
			}

			return position;
		}

		showTooltipJob = new Job(() => {
			if (!this.state.showing) {
				this.setState({
					showing: true
				});
			}
		})

		showTooltip = (client) => {
			const {tooltipDelay, tooltipText} = this.props;

			if (tooltipText) {
				this.clientRef = client;
				currentTooltip = this;
				this.showTooltipJob.startAfter(tooltipDelay);
			}
		}

		hideTooltip = () => {
			if (this.props.tooltipText) {
				this.clientRef = null;
				currentTooltip = null;
				this.showTooltipJob.stop();
				if (this.state.showing) {
					this.setState({showing: false});
				}
			}
		}

		handle = handle.bind(this)

		handleKeyDown = this.handle(
			forProp('disabled', true),
			() => {
				this.hideTooltip();
				off('keydown', this.handleKeyDown);
			}
		);

		handleMouseOver = this.handle(
			forward('onMouseOver'),
			forProp('disabled', true),
			(ev) => {
				this.showTooltip(ev.target);
				on('keydown', this.handleKeyDown);
			}
		)

		handleMouseOut = this.handle(
			forward('onMouseOut'),
			forProp('disabled', true),
			() => {
				this.hideTooltip();
				off('keydown', this.handleKeyDown);
			}
		)

		handleFocus = this.handle(
			forward('onFocus'),
			({target}) => this.showTooltip(target)
		)

		handleBlur = this.handle(
			forward('onBlur'),
			this.hideTooltip
		)

		getTooltipRef = (node) => {
			this.tooltipRef = node;
			if (node) {
				this.setTooltipLayout();
			}
		}

		/**
		 * Conditionally creates the FloatingLayer and Tooltip based on the presence of
		 * `tooltipText` and returns a property bag to pass onto the Wrapped component
		 *
		 * @returns {Object} Prop object
		 * @private
		 */
		renderTooltip () {
			const {children, tooltipCasing, tooltipProps, tooltipText, tooltipWidth} = this.props;

			if (tooltipText) {
				const renderedTooltip = (
					<FloatingLayerBase open={this.state.showing} noAutoDismiss onDismiss={this.hideTooltip} scrimType="none" key="tooltipFloatingLayer">
						<Tooltip
							aria-live="off"
							role="alert"
							{...tooltipProps}
							arrowAnchor={this.state.arrowAnchor}
							casing={tooltipCasing}
							direction={this.state.tooltipDirection}
							position={this.state.position}
							tooltipRef={this.getTooltipRef}
							width={tooltipWidth}
						>
							{tooltipText}
						</Tooltip>
					</FloatingLayerBase>
				);

				if (tooltipDestinationProp === 'children') {
					return {
						children: [children, renderedTooltip]
					};
				} else {
					return {
						[tooltipDestinationProp]: renderedTooltip
					};
				}
			}

			return {children};
		}

		render () {
			// minor optimization to merge all the props together once since we also have to delete
			// invalid props before passing downstream
			const props = Object.assign(
				{},
				this.props,
				this.renderTooltip(),
				{
					onBlur: this.handleBlur,
					onFocus: this.handleFocus,
					onMouseOut: this.handleMouseOut,
					onMouseOver: this.handleMouseOver
				}
			);

			delete props.rtl;
			delete props.tooltipDelay;
			delete props.tooltipPosition;
			delete props.tooltipCasing;
			delete props.tooltipProps;
			delete props.tooltipText;
			delete props.tooltipWidth;

			return (
				<Wrapped {...props} />
			);
		}
	};

	return I18nContextDecorator(
		{rtlProp: 'rtl'},
		Decorator
	);
});

export default TooltipDecorator;
export {TooltipDecorator, Tooltip, TooltipBase};
