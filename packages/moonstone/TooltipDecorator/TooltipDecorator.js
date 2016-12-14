import React, {PropTypes} from 'react';
import {hoc} from '@enact/core';
import {startJob, stopJob} from '@enact/core/jobs';
import ri from '@enact/ui/resolution';
import FloatingLayer from '@enact/ui/FloatingLayer';
import {contextTypes} from '@enact/i18n/I18nDecorator';
import {Tooltip} from './Tooltip';

const TooltipDecorator = hoc((config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'TooltipDecorator'

		static propTypes = {
			/**
			* Delegate blur handler
			*
			* @type {Function}
			* @public
			*/
			onBlur: PropTypes.func,

			/**
			* Delegate focus handler
			*
			* @type {Function}
			* @public
			*/
			onFocus: PropTypes.func,

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
			preserveCase: PropTypes.bool,

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
			* `'above'`, `'above center'`, `'above left'`, `'above right'`, `'below'`, `'below center'`, `'below left'`, `'below right'`,
			* `'left bottom'`, `'left middle'`, `'left top'`, `'right bottom'`, `'right middle'`, `'right top'`, `'auto'`.
			* The values starting with `'left`' and `'right'` place the tooltip on the side
			* (sideways tooltip) with two additional positions available, `'top'` and `'bottom'`, which
			* places the tooltip content toward the top or bottom, with the tooltip pointer
			* middle-aligned to the activator.
			*
			* Note: The sideways tooltip does not automatically switch sides if it gets too close or
			* overlaps with the window bounds, as this may cause undesirable layout implications,
			* covering your other controls.
			*
			* @type {String}
			* @default 'auto'
			* @public
			*/
			tooltipPosition: PropTypes.oneOf(['auto', 'above', 'above center', 'above left', 'above right', 'below', 'below center', 'below left', 'below right', 'left bottom', 'left middle', 'left top', 'right bottom', 'right middle', 'right top']),

			/**
			* Message of tooltip
			*
			* @type {String}
			* @public
			*/
			tooltipText: PropTypes.string
		}

		static defaultProps = {
			preserveCase: false,
			showDelay: 500,
			tooltipPosition: 'auto'
		}

		static contextTypes = contextTypes

		constructor (props) {
			super(props);

			this.state = {
				showing: false,
				type: 'below leftArrow',
				position: {
					left: 0,
					top: 0
				},
				arrowType: 'corner'
			};
		}

		adjustPosition () {
			const position = this.props.tooltipPosition;
			let tPos; // tooltip position
			let aPos; // arrow position
			let r;
			let arr;

			if ((arr = position.split(' ')).length === 2) {
				[tPos, aPos] = arr;
			} else if (position === 'above' || position === 'below') {
				tPos = position;
				aPos = 'left';
			} else {
				tPos = 'below';
				aPos = 'left';
			}

			if (this.context.rtl) {
				if (tPos === 'above' || tPos === 'below') {
					aPos = aPos === 'left' ? 'right' : 'left';
				} else if (tPos === 'left' || tPos === 'right') {
					tPos = tPos === 'left' ? 'right' : 'left';
				}
			}

			r = this.calcPosition(tPos, aPos);

			if (tPos === 'above' || tPos === 'below') {
				let isCalculate = false;

				if (aPos === 'left' && r.tX + r.tW > window.innerWidth || aPos === 'right' && r.tX < 0) {
					isCalculate = true;
					aPos = aPos === 'left' ? 'right' : 'left';
				}

				if (tPos === 'below' && r.tY + r.tH > window.innerHeight ||  tPos === 'above' && r.tY < 0 ) {
					isCalculate = true;
					tPos = tPos === 'above' ? 'below' : 'above';
				}

				if (isCalculate) {
					r = this.calcPosition(tPos, aPos);
				}
			}

			this.setState({
				type: tPos + ' ' + aPos + 'Arrow',
				position: {
					top: r.tY,
					left: r.tX
				},
				arrowType: aPos === 'center' || aPos === 'middle' ? 'edge' : 'corner'
			});
		}

		calcPosition (tPos, aPos) {
			const cBound = this.clientRef.getBoundingClientRect(); // clinet bound
			const lBound = this.tooltipRef.getBoundingClientRect(); // label bound
			const tooltipDistance = ri.scale(18); // distance between client and tooltip's label
			let tX, tY; // tooltip position

			switch (tPos) {
				case 'below':
					tX = cBound.left + cBound.width / 2;
					tY = cBound.bottom + tooltipDistance;

					if (aPos === 'right') {
						tX -= lBound.width;
					} else if (aPos === 'center') {
						tX -= lBound.width / 2;
					}
					break;
				case 'above':
					tX = cBound.left + cBound.width / 2;
					tY = cBound.top - lBound.height - tooltipDistance;

					if (aPos === 'right') {
						tX -= lBound.width;
					} else if (aPos === 'center') {
						tX -= lBound.width / 2;
					}
					break;
				case 'left':
					tX = cBound.left - lBound.width - tooltipDistance;
					tY = cBound.top + cBound.height / 2;

					if (aPos === 'top') {
						tY -= lBound.height;
					} else if (aPos === 'middle') {
						tY -= lBound.height / 2;
					}
					break;
				case 'right':
					tX = cBound.right + tooltipDistance;
					tY = cBound.top + cBound.height / 2;

					if (aPos === 'top') {
						tY -= lBound.height;
					} else if (aPos === 'middle') {
						tY -= lBound.height / 2;
					}
					break;
				default:
					tX = 0;
					tY = 0;
					break;
			}

			return {
				tX: tX,
				tY: tY,
				tW: lBound.width,
				tH: lBound.height
			};
		}

		handleFocus = (e) => {
			const {onFocus, tooltipText, showDelay} = this.props;

			if (tooltipText) {
				this.clientRef = e.target;
				startJob('showTooltip', () => {
					this.setState({showing: true});
					this.adjustPosition();
				}, showDelay);
			}

			if (onFocus) {
				onFocus(e);
			}
		}

		handleBlur = (e) => {
			const {onBlur, tooltipText} = this.props;

			if (tooltipText) {
				this.clientRef = null;
				stopJob('showTooltip');
				this.setState({showing: false});
			}

			if (onBlur) {
				onBlur(e);
			}
		}

		getTooltipRef = (node) => {
			this.tooltipRef = node;
		}

		render () {
			const {children, preserveCase, tooltipText, ...rest} = this.props;
			const props = Object.assign({}, rest);
			delete props.showDelay;
			delete props.tooltipText;
			delete props.tooltipPosition;

			return (
				<Wrapped
					{...props}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}
				>
					{children}
					<FloatingLayer open={this.state.showing} scrimType="none">
						<Tooltip
							type={this.state.type}
							position={this.state.position}
							arrowType={this.state.arrowType}
							getTooltipRef={this.getTooltipRef}
							preserveCase={preserveCase}
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
export {TooltipDecorator, Tooltip};
