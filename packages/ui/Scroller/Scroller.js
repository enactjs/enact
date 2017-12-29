/**
 * Exports the {@link ui/Scroller.Scroller} and
 * {@link ui/Scroller.ScrollerBase} components.
 * The default export is {@link ui/Scroller.Scroller}.
 *
 * @module ui/Scroller
 */

import classNamesBind from 'classnames/bind';
import PropTypes from 'prop-types';
import React, {Component} from 'react';

import ComponentOverride from '../ComponentOverride';

import css from './Scroller.less';

const classnames = classNamesBind.bind(css);

/**
 * {@link ui/Scroller.ScrollerBase} is a base component for Scroller.
 * In most circumstances, you will want to use Scrollable version:
 * {@link ui/Scroller.Scroller}
 *
 * @class ScrollerBase
 * @memberof ui/Scroller
 * @ui
 * @public
 */
class ScrollerBase extends Component {
	static displayName = 'Scroller'

	static propTypes = /** @lends ui/Scroller.ScrollerBase.prototype */ {
		defaultScrollLeft: PropTypes.number,
		defaultScrollTop: PropTypes.number,
		horizontal: PropTypes.string,
		vertical: PropTypes.string
	}

	static defaultProps = {
		defaultScrollLeft: 0,
		defaultScrollTop: 0,
		horizontal: 'auto',
		vertical: 'auto'
	}

	constructor (props) {
		super();

		this.state = {
			height: 0,
			width: 0,
			scrollHeight: 0,
			scrollWidth: 0,
			x: props.defaultScrollLeft,
			y: props.defaultScrollTop
		};
	}

	componentDidMount () {
		this.calculateMetrics();
	}

	componentDidUpdate (prevProps, prevState) {
		const {x, y} = this.state;

		if (this.containerNode) {
			let transform = '';
			if (x !== prevState.x) {
				transform += ` translateX(-${x}px)`;
			}

			if (y !== prevState.y) {
				transform += ` translateY(-${y}px)`;
			}

			this.contentNode.style.transform = transform;
		}
	}

	setContainer = (node) => {
		this.containerNode = node;
	}

	setContent = (node) => {
		this.contentNode = node;
	}

	calculateMetrics () {
		this.setState((currentBounds) => {
			if (this.containerNode) {
				const {clientHeight: height, clientWidth: width, scrollHeight, scrollWidth} = this.containerNode;

				if (
					height !== currentBounds.height ||
					width !== currentBounds.width ||
					scrollHeight !== currentBounds.scrollHeight ||
					scrollWidth !== currentBounds.scrollWidth
				) {
					return {height, width, scrollHeight, scrollWidth};
				}
			}

			return null;
		});
	}

	isHorizontalScrollbarVisible () {
		return this.props.horizontal === 'always' || (
			this.props.horizontal === 'auto' && this.state.scrollWidth > this.state.width
		);
	}

	isVerticalScrollbarVisible () {
		return this.props.vertical === 'always' || (
			this.props.vertical === 'auto' && this.state.scrollHeight > this.state.height
		);
	}

	handleHorizontalStep = ({value}) => {
		this.setState(() => {
			return {
				x: value
			};
		});
	}

	handleVerticalStep = ({value}) => {
		this.setState(() => {
			return {
				y: value
			};
		});
	}

	render () {
		const {children, className, scrollbarComponent, ...rest} = this.props;

		const showHorizontal = this.isHorizontalScrollbarVisible();
		const showVertical = this.isVerticalScrollbarVisible();

		const classes = classnames(
			css.scroller,
			className,
			{
				vertical: showVertical,
				horizontal: showHorizontal
			}
		);

		return (
			<div className={classes} {...rest}>
				<div className={css.container} ref={this.setContainer}>
					<div ref={this.setContent} className={css.content}>
						{children}
					</div>
				</div>
				<ComponentOverride
					component={showVertical ? scrollbarComponent : null}
					max={this.state.scrollHeight}
					onStep={this.handleVerticalStep}
					orientation="vertical"
					size={this.state.height}
					value={this.state.y}
				/>
				<ComponentOverride
					component={showHorizontal ? scrollbarComponent : null}
					max={this.state.scrollWidth}
					onStep={this.handleHorizontalStep}
					orientation="horizontal"
					size={this.state.width}
					value={this.state.x}
				/>
			</div>
		);
	}
}

export default ScrollerBase;
export {ScrollerBase as Scroller, ScrollerBase};
