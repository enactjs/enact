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
import {adjustDirection, adjustAnchor, calcOverflow, getLabelOffset, getPosition} from './util';

let currentTooltip; // needed to know whether or not we should stop a showing job when unmounting

/**
 * Default config for [TooltipDecorator]{@link moonstone/TooltipDecorator.TooltipDecorator}
 *
 * @memberof moonstone/TooltipDecorator.TooltipDecorator
 * @hocconfig
 */
const defaultConfig = {
	/**
	 * The boundary around the screen which the tooltip should never cross, typically involving
	 * flipping to an alternate orientation or adjusting its offset to remain on screen.
	 * The default of 24 is derived from a standard 12px screen-keepout size plus the standard
	 * Spotlight-outset (12px) margin/padding value which keeps elements and text aligned inside a
	 * [Panel]{@link moonstone/Panels.Panel}.
	 *
	 * @type {Number}
	 * @default 24
	 * @memberof moonstone/TooltipDecorator.TooltipDecorator.defaultConfig
	 */
	screenEdgeKeepout: (12 + 12),

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
			 * Time to wait (in milliseconds) before showing tooltip on hover.
			 *
			 * @type {Number}
			 * @default 500
			 * @public
			 */
			tooltipDelay: PropTypes.number,

			/**
			 * Position of the tooltip with respect to the wrapped component.
			 *
			 * | *Value* | *Tooltip Direction* |
			 * |---|---|
			 * | `'above'` | Above component, flowing to the right |
			 * | `'above center'` | Above component, centered |
			 * | `'above left'` | Above component, flowing to the left |
			 * | `'above right'` | Above component, flowing to the right |
			 * | `'below'` | Below component, flowing to the right |
			 * | `'below center'` | Below component, centered |
			 * | `'below left'` | Below component, flowing to the right |
			 * | `'below right'` | Below component, flowing to the right |
			 * | `'left bottom'` | Left of the component, contents at the bottom |
			 * | `'left middle'` | Left of the component, contents middle aligned |
			 * | `'left top'` | Left of the component, contents at the top |
			 * | `'right bottom'` | Right of the component, contents at the bottom |
			 * | `'right middle'` | Right of the component, contents middle aligned |
			 * | `'right top'` | Right of the component, contents at the top |
			 *
			 * `TooltipDectorator` attempts to choose the best direction to meet layout and language
			 * requirements. Left and right directions will reverse for RTL languages. Additionally,
			 * the tooltip will reverse direction if it will prevent overflowing off the viewport
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
			 * Positions the tooltip relative to its container.
			 *
			 * Determines whether your tooltip should position itself relative to its container or
			 * relative to the screen (absolute positioning on the floating layer). When setting to
			 * `true`, to enable relative positioning, it may be important to specify the
			 * `tooltipDestinationProp` key in this HoC's config object. A relatively positioned
			 * Tooltip for a `Button`, for example, must be placed in the `decoration` prop.
			 *
			 * It may be necessary to assign the CSS rule `position` to the containing element so
			 * relatively positioned Tooltip has a frame to "stick to" the edge of.
			 *
			 * Anchoring points can be visualized as follows:
			 * ```
			 * ┌───◎───┐
			 * ◎       ◎
			 * └───◎───┘
			 * ```
			 *
			 * @type {Object}
			 * @public
			 */
			tooltipRelative: PropTypes.bool,

			/**
			 * Tooltip content.
			 *
			 * @type {Node}
			 * @public
			 */
			tooltipText: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),

			/**
			 * The interval (in milliseconds) to recheck the math for a currently showing tooltip's
			 * positioning and orientation. Useful if your anchor element moves.
			 *
			 * @type {Number}
			 * @default 400
			 * @public
			 */
			tooltipUpdateDelay: PropTypes.number,

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
			tooltipDelay: 500,
			tooltipPosition: 'above',
			tooltipUpdateDelay: 400
		}

		constructor (props) {
			super(props);

			this.state = {
				showing: false,
				tooltipDirection: null,
				arrowAnchor: null,
				position: {top: 0, left: 0}
			};
		}

		componentDidMount () {
			if (window.MutationObserver) {
				this.mutationObserver = new MutationObserver(this.setTooltipLayoutJob.start);
			}

			if (window.ResizeObserver) {
				this.resizeObserver = new ResizeObserver(this.setTooltipLayoutJob.start);
			}
		}

		componentDidUpdate (prevProps) {
			if (this.state.showing && (
				prevProps.tooltipText !== this.props.tooltipText ||
				prevProps.tooltipPosition !== this.props.tooltipPosition
			)) {
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

			const screenEdgeKeepout = ri.scale(config.screenEdgeKeepout);
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
			const overflow = calcOverflow(tooltipNode, clientNode, tooltipDirection, screenEdgeKeepout);

			tooltipDirection = adjustDirection(tooltipDirection, overflow, this.props.rtl);
			arrowAnchor = adjustAnchor(arrowAnchor, tooltipDirection, overflow, this.props.rtl);

			const tooltipPosition = getPosition(clientNode, tooltipDirection);
			const labelOffset = arrowAnchor === 'center' ? getLabelOffset(tooltipNode, tooltipDirection, tooltipPosition, overflow) : null;
			const {top, left} = this.state.position;

			if (
				(tooltipPosition.top !== top) ||
				(tooltipPosition.left !== left) ||
				(labelOffset !== this.state.labelOffset) ||
				(arrowAnchor !== this.state.arrowAnchor)
			) {
				this.setState({
					tooltipDirection,
					arrowAnchor,
					labelOffset,
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
		}, this.props.tooltipUpdateDelay)

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
			const {children, tooltipRelative, tooltipProps, tooltipText, tooltipWidth} = this.props;

			if (tooltipText) {
				let renderedTooltip = (
					<Tooltip
						aria-live="off"
						role="alert"
						labelOffset={this.state.labelOffset}
						{...tooltipProps}
						arrowAnchor={this.state.arrowAnchor}
						direction={this.state.tooltipDirection}
						position={tooltipRelative ? null : this.state.position}
						relative={tooltipRelative}
						style={{display: ((tooltipRelative && !this.state.showing) ? 'none' : null)}}
						tooltipRef={this.getTooltipRef}
						width={tooltipWidth}
					>
						{tooltipText}
					</Tooltip>
				);


				if (!tooltipRelative) {
					renderedTooltip = (
						<FloatingLayerBase open={this.state.showing} noAutoDismiss onDismiss={this.hideTooltip} scrimType="none" key="tooltipFloatingLayer">
							{renderedTooltip}
						</FloatingLayerBase>
					);
				}

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
			delete props.tooltipProps;
			delete props.tooltipRelative;
			delete props.tooltipText;
			delete props.tooltipUpdateDelay;
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
export {
	TooltipDecorator,
	Tooltip,
	TooltipBase
};
