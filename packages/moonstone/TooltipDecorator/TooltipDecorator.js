/* global MutationObserver ResizeObserver */

/**
 * Moonstone styled tooltip components.
 *
 * @module moonstone/TooltipDecorator
 * @exports TooltipDecorator
 * @exports Tooltip
 * @exports TooltipBase
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
import {adjustDirection, adjustAnchor, calcOverflow, getPosition, getArrowPosition} from './util';

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

			if (window.MutationObserver) {
				this.mutationObserver = new MutationObserver(this.setTooltipLayoutJob.start);
			}

			if (window.ResizeObserver) {
				this.resizeObserver = new ResizeObserver(this.setTooltipLayoutJob.start);
			}

			this.state = {
				showing: false,
				tooltipDirection: null,
				arrowAnchor: null,
				position: {top: 0, left: 0}
			};
		}

		componentDidUpdate (prevProps) {
			if (this.state.showing && prevProps.tooltipText !== this.props.tooltipText) {
				this.setTooltipLayout();
			}
		}

		componentWillUnmount () {
			if (currentTooltip === this) {
				currentTooltip = null;

				if (this.mutationObserver) {
					this.mutationObserver.disconnect();
				}

				if (this.resizeObserver) {
					this.resizeObserver.disconnect();
				}

				this.showTooltipJob.stop();
				this.setTooltipLayoutJob.stop();
			}

			if (this.props.disabled) {
				off('keydown', this.handleKeyDown);
			}
		}

		setTooltipLayout () {
			if (!this.tooltipRef || !this.clientRef) return;

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
			const overflow = calcOverflow(tooltipNode, clientNode, tooltipDirection, this.TOOLTIP_HEIGHT);

			tooltipDirection = adjustDirection(tooltipDirection, overflow, this.props.rtl);
			arrowAnchor = adjustAnchor(arrowAnchor, tooltipDirection, overflow, this.props.rtl);

			const tooltipPosition = getPosition(tooltipNode, clientNode, arrowAnchor, tooltipDirection, this.TOOLTIP_HEIGHT, overflow, this.props.rtl);
			const arrowPosition = getArrowPosition(clientNode, overflow, this.props.rtl);
			const {top, left} = this.state.position;

			if ((tooltipPosition.top !== top) || (tooltipPosition.left !== left)) {
				this.setState({
					tooltipDirection,
					arrowAnchor,
					arrowPosition,
					position: tooltipPosition
				});
			}
		}

		showTooltipJob = new Job(() => {
			if (!this.state.showing) {
				this.setState({
					showing: true
				});
			}
		})

		setTooltipLayoutJob = new Job(() => {
			this.setTooltipLayout();
		}, 400)

		showTooltip = (client) => {
			const {tooltipDelay, tooltipText} = this.props;

			if (tooltipText) {
				this.clientRef = client;
				currentTooltip = this;
				this.showTooltipJob.startAfter(tooltipDelay);

				if (this.mutationObserver) {
					this.mutationObserver.observe(this.clientRef, {attributes: true, childList: true});
				}

				if (this.resizeObserver) {
					this.resizeObserver.observe(this.clientRef);
				}
			}
		}

		hideTooltip = () => {
			if (this.props.tooltipText) {
				if (this.mutationObserver) {
					this.mutationObserver.disconnect();
				}

				if (this.resizeObserver) {
					this.resizeObserver.disconnect();
				}

				this.clientRef = null;
				currentTooltip = null;

				this.showTooltipJob.stop();
				this.setTooltipLayoutJob.stop();

				if (this.state.showing) {
					this.setState({showing: false});
				}
			}
		}

		handle = handle.bind(this)

		// Recalculate tooltip layout on keydown to make sure tooltip is positioned correctly in case something changes as a result of the keydown.
		handleKeyDown = this.handle(
			forward('onKeyDown'),
			forProp('disabled', false),
			() => {
				this.setTooltipLayoutJob.start();
			}
		);

		// Global keydown handler to hide the tooltip for when the pointer is hovering over disabled wrapped component (showing the tooltip), and then the pointer times out and switches to 5-way, which will trigger this keydown handler, and spotting another component.
		handleGlobalKeyDown = this.handle(
			forProp('disabled', true),
			() => {
				this.hideTooltip();
				off('keydown', this.handleGlobalKeyDown);
			}
		);

		handleMouseOver = this.handle(
			forward('onMouseOver'),
			forProp('disabled', true),
			(ev) => {
				this.showTooltip(ev.target);
				on('keydown', this.handleGlobalKeyDown);
			}
		)

		handleMouseOut = this.handle(
			forward('onMouseOut'),
			forProp('disabled', true),
			() => {
				this.hideTooltip();
				off('keydown', this.handleGlobalKeyDown);
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
							arrowPosition={this.state.arrowPosition}
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
					onMouseOver: this.handleMouseOver,
					onKeyDown: this.handleKeyDown
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
