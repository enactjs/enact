import React from 'react';
import {hoc} from '@enact/core';
import ri from '@enact/ui/resolution';
import FloatingLayer from '@enact/ui/FloatingLayer';
import {isRtlText} from '@enact/i18n';
import {Tooltip} from './Tooltip';

const TooltipDecorator = hoc( (config, Wrapped) => {
	return class extends React.Component {
		static displayName = 'TooltipDecorator'

		static defaultProps = {
			tooltipPosition: 'auto'
		}

		static propTypes = {
			/**
			* Message of tooltip
			*
			* @type {string}
			* @default is not exist
			* @public
			*/
			tooltipText: React.PropTypes.string,

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
			tooltipPosition: React.PropTypes.oneOf(['auto', 'above', 'above center', 'above left', 'above right', 'below', 'below center', 'below left', 'below right', 'left bottom', 'left middle', 'left top', 'right bottom', 'right middle', 'right top']),

			/**
			* Delegate focus handler
			*
			* @type {string}
			* @default is not exist
			* @public
			*/
			onFocus: React.PropTypes.func,

			/**
			* Delegate blur handler
			*
			* @type {string}
			* @default is not exist
			* @public
			*/
			onBlur: React.PropTypes.func
		}

		constructor (props) {
			super(props);

			this.state = {
				showing: false
			};

			this.handleFocus = this.handleFocus.bind(this);
			this.handleBlur = this.handleBlur.bind(this);
		}

		adjustPosition () {
			const position = this.props.tooltipPosition;
			let tPos; // tooltip position
			let aPos; // arrow position
			let r;
			let arr;
			let rtl = isRtlText(this.props.tooltipText);

			if ((arr = position.split(' ')).length === 2) {
				[tPos, aPos] = arr;
			} else if (position === 'above' || position === 'below') {
				tPos = position;
				aPos = 'left';
			} else {
				tPos = 'below';
				aPos = 'left';
			}

			if (rtl) {
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
				type: tPos + ' ' + aPos + "Arrow",
				top: ri.unit(r.tY, 'rem'),
				left: ri.unit(r.tX, 'rem'),
				arrowType: aPos === 'center' || aPos === 'middle' ? 'edge' : 'corner'
			});
		}

		calcPosition (tPos, aPos) {
			const cBound = this.clientRef.getBoundingClientRect(); // clinet bound
			const lBound = this.tooltipRef.getBoundingClientRect(); // label bound
			const tooltipDistance = 18; // distance between client and tooltip's label
			let tX, tY; // tooltip position

			switch (tPos) {
				case 'below':
					tX = cBound.left + cBound.width/2;
					tY = cBound.bottom + tooltipDistance;

					if (aPos === 'right') {
						tX -= lBound.width;
					} else if (aPos === 'center') {
						tX -= lBound.width/2;
					}
					break;
				case 'above':
					tX = cBound.left + cBound.width/2;
					tY = cBound.top - lBound.height - tooltipDistance;

					if (aPos === 'right') {
						tX -= lBound.width;
					} else if (aPos === 'center') {
						tX -= lBound.width/2;
					}
					break;
				case 'left':
					tX = cBound.left - lBound.width - tooltipDistance;
					tY = cBound.top + cBound.height/2;

					if (aPos === 'top') {
						tY -= lBound.height;
					} else if(aPos === 'middle') {
						tY -= lBound.height/2;
					}
					break;
				case 'right':
					tX = cBound.right + tooltipDistance;
					tY = cBound.top + cBound.height/2;

					if (aPos === 'top') {
						tY -= lBound.height;
					} else if(aPos === 'middle') {
						tY -= lBound.height/2;
					}
					break;
				default:
					tX=0;
					tY=0;
					break;
			}

			return {
				tX: tX,
				tY: tY,
				tW: lBound.width,
				tH: lBound.height
			}
		}

		handleFocus (e) {
			this.clientRef = e.target;
			if( this.props.tooltipText && this.props.tooltipText.length>0 ) this.show();
			if( this.props.onFocus ) this.props.onFocus(e);
		}

		handleBlur (e) {
			if( this.props.tooltipText && this.props.tooltipText.length>0 ) this.hide();
			if( this.props.onBlur ) this.props.onBlur(e);
		}

		show () {
			this.setTimeout(() => {
				this.setState({
					showing: true
				});
				this.adjustPosition();
			}, 500);
		}

		hide () {
			this.clearTimeout();
			this.setState({
				showing: false
			});
		}

		clearTimeout () {
			window.clearTimeout(this.timer);
			this.timer = null;
		}

		setTimeout (fn, time) {
			this.clearTimeout();
			this.timer = window.setTimeout(fn, time);
		}

		getTooltipRef = (node) => {
			this.tooltipRef = node;
		}

		renderTooltip () {
			const {tooltipText, children} = this.props;
			const props = Object.assign({}, this.props);
			delete props.tooltipText;
			delete props.tooltipPosition;

			return(
				<Wrapped {...props}
					onFocus={this.handleFocus}
					onBlur={this.handleBlur}>
					{children}
					<FloatingLayer open={this.state.showing} scrimType='none'>
						<Tooltip
							text={tooltipText}
							type={this.state.type}
							top={this.state.top}
							left={this.state.left}
							arrowType={this.state.arrowType}
							getTooltipRef={this.getTooltipRef} />
					</FloatingLayer>
				</Wrapped>
			);
		}

		renderWrapped () {
			const props = Object.assign({}, this.props);
			delete props.tooltip;
			delete props.tooltipPosition;

			return(
				<Wrapped {...props} />
			);
		}

		render () {
			if (this.props.tooltipText) {
				return this.renderTooltip();
			} else {
				return this.renderWrapped();
			}
		}
	}
});

export default TooltipDecorator;
export {TooltipDecorator};
